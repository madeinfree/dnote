import React from 'react';
import './App.css';
import coverPicture from './assets/cover.png'
import Web3 from 'web3'
import dayjs from 'dayjs'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { green, red } from '@material-ui/core/colors';

let web3
const JSONInterFace = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_cost",
        "type": "uint256"
      }
    ],
    "name": "confirmTodo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBetMoneyRule",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getChallenge",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getChallengeBonus",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "giveMoneyPull",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_flowMoney",
        "type": "uint256"
      }
    ],
    "name": "joinChallenge",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint24",
        "name": "_durationDate",
        "type": "uint24"
      }
    ],
    "name": "setBetDurationDateRule",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_minBetMoney",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxBetMoney",
        "type": "uint256"
      }
    ],
    "name": "setBetMoneyRule",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
  iconColor: {
    color: green[800]
  },
  cancelIconColor: {
    color: red[800]
  }
}));

function App() {
  const classes = useStyles();
  const [account, setAccount] = React.useState({
    address: '',
    balance: 0
  })
  const [contractBalance, setContractBalance] = React.useState(0)
  const [contract, setContract] = React.useState(null)
  const [betMoney, setBetMoney] = React.useState(0)
  const [flowMoney, setFlowMoney] = React.useState(0)
  const [challenge, setChallenge] = React.useState({
    betMoney: '0',
    flowMoney: '0',
    startDate: '0',
    updatedDate: '0',
    endDate: '0',
    locked: false
  })
  const [changeDurationDate, setChangeDurationDate] = React.useState('')
  const [todayTodo, setTodayTodo] = React.useState({
    title: '',
    cost: 0
  })
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: ''
  });
  const { vertical, horizontal, open, message } = state;
  React.useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(async accounts => {
          if (accounts.length > 0) {
            const balance = await web3.eth.getBalance(accounts[0])
            const contractBalance = await web3.eth.getBalance('0xE9ad469aBFD745B98Fd1A00cd1d0d39c3F74606b')
            setContractBalance(web3.utils.fromWei(contractBalance.toString()))
            setAccount({
              address: accounts[0],
              balance: web3.utils.fromWei(balance.toString())
            })
            setContract(new web3.eth.Contract(JSONInterFace, '0xE9ad469aBFD745B98Fd1A00cd1d0d39c3F74606b'))
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [])
  function handleGetSelfChallenge() {
    contract.methods.getChallenge()
      .call({
        from: account.address
      }).then(data => {
        setChallenge({
          betMoney: data[0],
          flowMoney: data[1],
          startDate: data[2],
          updatedDate: data[3],
          endDate: data[4],
          locked: data[5]
        })
      })
  }
  function handleJoinChallenge() {
    contract.methods.joinChallenge(flowMoney)
      .send({
        from: account.address,
        value: web3.utils.toWei(betMoney)
      }).then(async data => {
        const balance = await web3.eth.getBalance(account.address)
        const contractBalance = await web3.eth.getBalance('0xE9ad469aBFD745B98Fd1A00cd1d0d39c3F74606b')
        setContractBalance(web3.utils.fromWei(contractBalance.toString()))
        setState({ ...state, open: true, message: '挑戰開始了，期待你努力完成挑戰囉！' });
        setAccount({
          ...account,
          balance: web3.utils.fromWei(balance.toString())
        })
      })
  }
  function handleConfirmChallenge() {
    contract.methods.confirmTodo(todayTodo.title, todayTodo.cost)
      .send({
        from: account.address
      }).then(async data => {
        const balance = await web3.eth.getBalance(account.address)
        const contractBalance = await web3.eth.getBalance('0xE9ad469aBFD745B98Fd1A00cd1d0d39c3F74606b')
        setContractBalance(web3.utils.fromWei(contractBalance.toString()))
        setState({ ...state, open: true, message: '恭喜你！已經登記一筆消費紀錄完成。' });
        setAccount({
          ...account,
          balance: web3.utils.fromWei(balance.toString())
        })
      })
  }
  function handleGetChallengeBonus() {
    contract.methods.getChallengeBonus()
      .send({
        from: account.address
      }).then(async data => {
        const balance = await web3.eth.getBalance(account.address)
        const contractBalance = await web3.eth.getBalance('0xE9ad469aBFD745B98Fd1A00cd1d0d39c3F74606b')
        setContractBalance(web3.utils.fromWei(contractBalance.toString()))
        setState({ ...state, open: true, message: '恭喜你！獎金已取回。' });
        setAccount({
          ...account,
          balance: web3.utils.fromWei(balance.toString())
        })
      })
  }
  function handleChangeChallengeDurationDate() {
    contract.methods.setBetDurationDateRule(changeDurationDate)
      .send({
        from: account.address
      }).then(data => {})
  }
  function handleClose() {
    setState({ ...state, open: false });
  };
  return (
    <div style={{ backgroundImage: `url(${coverPicture})`, height: '100%', backgroundPosition: 'center' }} className="App">
      <div>
        <div style={{ fontSize: 40, textAlign: 'center' }}>用賭注來一場與記帳的搏鬥</div>
        <h1 style={{ textAlign: 'center' }}>獎金池 {contractBalance} ETH</h1>
        <Container maxWidth='lg'>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            key={`${vertical},${horizontal}`}
            open={open}
            onClose={handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{message}</span>}
          />
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={4}>
                <h2>{account.address}</h2>
                <h2>{account.balance} ETH</h2>
                <div>
                  <TextField
                    id="filled-name"
                    label="壓注金額（0.002 ~ 0.01 ETH）"
                    value={betMoney}
                    onChange={(e) => setBetMoney(e.target.value)}
                    margin="normal"
                    variant="filled"
                    helperText="此金額將影響最後報酬回饋金額（壓注金額 * 10%）"
                  />
                </div>
                <div>
                  <TextField
                    id="filled-name"
                    label="預計花費（500 ~ 1000）"
                    value={flowMoney}
                    onChange={(e) => setFlowMoney(e.target.value)}
                    margin="normal"
                    variant="filled"
                    helperText="每日記帳用，預計一週總花費金額"
                  />
                </div>
                <Button
                  variant="contained"
                  color='primary'
                  className={classes.button}
                  endIcon={<Icon>send</Icon>}
                  onClick={handleJoinChallenge}
                >下注</Button>
              </Grid>
              <Grid item xs={4}>
                <h2>記帳項目</h2>
                <div><TextField
                  id="filled-name"
                  label="花費項目"
                  value={todayTodo.title}
                  onChange={(e) => setTodayTodo({
                    ...todayTodo,
                    title: e.target.value
                  })}
                  margin="normal"
                  variant="filled"
                  helperText="輸入您的今日完成項目"
                /></div>
                <div><TextField
                  id="filled-name"
                  label="花費金額"
                  value={todayTodo.cose}
                  onChange={(e) => setTodayTodo({
                    ...todayTodo,
                    cost: e.target.value
                  })}
                  margin="normal"
                  variant="filled"
                  helperText="輸入支出花費金額"
                /></div>
                <Button
                  variant="contained"
                  color='primary'
                  className={classes.button}
                  endIcon={<Icon>send</Icon>}
                  onClick={handleConfirmChallenge}
                >送出進度</Button>
              </Grid>
              <Grid item xs={4}>
                <h2>挑戰合約下注內容</h2>
                <h3>壓注金額 {challenge.betMoney}</h3>
                <h3>預計花費 {challenge.flowMoney}</h3>
                <h3>下注時間 {dayjs(challenge.startDate * 1000).format('YYYY-MM-DD HH:mm')}</h3>
                <h3>上次互動時間 {dayjs(challenge.updatedDate * 1000).format('YYYY-MM-DD HH:mm')}</h3>
                <h3>結束時間 {dayjs(challenge.endDate * 1000).format('YYYY-MM-DD HH:mm')}</h3>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>進度 {challenge.locked ? <Icon className={classes.iconColor}>check</Icon> : dayjs().isAfter(dayjs(challenge.endDate * 1000)) ?
                  <React.Fragment><Icon className={classes.cancelIconColor}>cancel</Icon><span> 挑戰已經過期</span></React.Fragment> :
                  <Icon className={classes.cancelIconColor}>cancel</Icon>}</h3>
                <Button
                  variant="contained"
                  color='secondary'
                  className={classes.button}
                  onClick={handleGetSelfChallenge}
                  endIcon={<Icon>send</Icon>}
                >取得挑戰合約</Button>
                {
                  challenge.locked && <Button
                    variant="contained"
                    color='secondary'
                    className={classes.button}
                    onClick={handleGetChallengeBonus}
                    endIcon={<Icon>send</Icon>}
                  >取得挑戰回饋獎金</Button>
                }
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.paper}>
            <h2>管理操作（僅有合約創建者可以使用）</h2>
            <div>
              <TextField
                id="filled-name"
                label="修改挑戰進行時間"
                value={changeDurationDate}
                onChange={(e) => setChangeDurationDate(e.target.value)}
                margin="normal"
                variant="filled"
                helperText="此功能可更改挑戰者加入後的進行時間"
              />
            </div>
            <div>
              <Button
                variant="contained"
                color='secondary'
                className={classes.button}
                onClick={handleChangeChallengeDurationDate}
                endIcon={<Icon>send</Icon>}
              >修改合約內容</Button>
            </div>
          </Paper>
        </Container>
      </div>
    </div>
  );
}

export default App;
