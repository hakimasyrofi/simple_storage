import './App.css';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Navigation from './components/Navigation';
import Modal from './components/Modal';

const ABI  = require('./abi.json');
const contractAddress = '0xF2088390C8f68f7Aa130413da46061A86585A93E';

interface UserInfo {
  account: string;
  balance: string;
  connectionid: number;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    account: '',
    balance: '',
    connectionid: 0,
  });
  const [sendAmount, setSendAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  let contractIsInitialized = false;
  let simpleStorageContract: any;

  function changeSendAmount(e: any) {
    setSendAmount(e.target.value);
  }

  const getBalance = async () => {
    const data = await simpleStorageContract.methods.balanceOf().call();
    setBalance(data);
  }

  const send = async () => {
    if (!contractIsInitialized){
      await onConnect();
    }
    setLoading(true);
    return simpleStorageContract.methods.store().send({ from: userInfo.account, value: Web3.utils.toWei(sendAmount.toString()) })
    .once('receipt', async (receipt: any) => {
      // console.log(receipt);
      setLoading(false);
      onConnect();
    })
    .catch((e: any) => {
      console.log(e);
    });
  }

  const withdraw = async () => {
    if (!contractIsInitialized){
      await onConnect();
    }
    setLoading(true);
    return simpleStorageContract.methods.withdraw(Web3.utils.toWei(sendAmount.toString())).send({ from: userInfo.account})
    .once('receipt', async (receipt: any) => {
      // console.log(receipt);
      setLoading(false);
      onConnect();
    })
    .catch((e: any) => {
      console.log(e);
    });
  }

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem('userAccount') || '{}');
      if (Object.keys(userData).length !== 0) {
        setUserInfo(userData);
        setIsConnected(true);
        onConnect();
      }
    }
    checkConnectedWallet();
  }, []);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
      console.log("web3 provider");
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        ethBalance = web3.utils.fromWei(ethBalance, 'ether');
        saveUserInfo(ethBalance, account, networkId);
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }

        if (networkId){
          simpleStorageContract = new web3.eth.Contract(ABI, contractAddress);
          await getBalance();
          contractIsInitialized = true;
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
  };

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({
      account: '',
      balance: '',
      connectionid: 0,
    });
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance: string, account: string, chainId: number): void => {
    const userAccount: UserInfo = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem('userAccount') || '{}');
    setUserInfo(userData);
    setIsConnected(true);
  };

  return (
    <div className="app">
      {loading && <Modal />}
      <Navigation isConnected={isConnected} connect={onConnect} disconnect={onDisconnect} address={userInfo.account} userBal={userInfo.balance}/>
      {isConnected && (
        <div className="app-wrapper">
          <div className="app-details container mx-auto">
            <label className="block pt-8 text-2xl font-medium text-gray-900 dark:text-white">Smart Contract Reserve: {balance/1E18} MATIC</label>
            <label className="block pt-8 mb-6 text-xl font-medium text-gray-900 dark:text-white">Input Amount (MATIC)</label>
            <input type="number" className="w-1/2 lg:w-1/3 px-4 bg-gray-50 font-medium rounded-lg border border-gray-300 mb-6" value={sendAmount} onChange={changeSendAmount} placeholder="Enter amount" />
            <br/>
            <button type="button" onClick={send} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-8 py-2.5 text-center mr-2 mb-2">Store MATIC</button>
            <button type="button" onClick={withdraw} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-8 py-2.5 text-center mr-2 mb-2">Withdraw MATIC</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
