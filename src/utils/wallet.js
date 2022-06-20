import Onboard from 'bnc-onboard'
import Notify from "bnc-notify"
require('dotenv').config()

const APP_NAME = process.env.REACT_APP_NAME
const APP_URL = process.env.REACT_APP_URL
const NETWORK_ID = parseInt(process.env.REACT_APP_CHAIN_ID)
const RPC_URL = process.env.REACT_APP_RPC_URL
const PORTIS_KEY = process.env.REACT_APP_PORTIS_KEY
const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_KEY
const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL


const wallets = [
  { walletName: "metamask", preferred: true },
  { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
  { walletName: "authereum", preferred: true },
  {
    walletName: "walletConnect",
    infuraKey: INFURA_KEY,
    preferred: true,
  },
  {
    walletName: "fortmatic",
    apiKey: FORTMATIC_KEY,
    preferred: true,
  },
  {
    walletName: "portis",
    apiKey: PORTIS_KEY,
    label: "Login with Email",
  },
  { walletName: "opera" },
  { walletName: "operaTouch" },
  { walletName: "torus" },
  {
    walletName: "trezor",
    appUrl: APP_URL,
    email: CONTACT_EMAIL,
    rpcUrl: RPC_URL,
  },
  {
    walletName: "ledger",
    rpcUrl: RPC_URL,
  },
  {
    walletName: "lattice",
    rpcUrl: RPC_URL,
    appName: APP_NAME,
  },
  {
    walletName: "cobovault",
    rpcUrl: RPC_URL,
    appName: APP_NAME,
  },
  { walletName: "status" },
  { walletName: "walletLink", rpcUrl: RPC_URL, appName: APP_NAME },
  { walletName: "imToken", rpcUrl: RPC_URL },
  { walletName: "meetone" },
  { walletName: "mykey", rpcUrl: RPC_URL },
  { walletName: "huobiwallet", rpcUrl: RPC_URL },
  { walletName: "hyperpay" },
  { walletName: "wallet.io", rpcUrl: RPC_URL },
  { walletName: "atoken" },
  { walletName: "frame" },
  { walletName: "ownbit" },
  { walletName: "alphawallet" }
]

export const ChainID = NETWORK_ID

export const getWeb3 = async () => {
  if (typeof window !== "undefined") {
    const { default: Web3 } = await import("web3")
    const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })
    const web3 = new Web3(window.ethereum || httpProvider)
    return web3
  } else {
    return null
  }
}

export const getOnBoard = async () => {
  if (typeof window !== "undefined") {
    const { default: Onboard } = await import("bnc-onboard")
    const onboard = Onboard({
      dappId: BLOCKNATIVE_KEY,
      networkId: NETWORK_ID,
      darkMode: false,
      walletSelect: {
        wallets: wallets,
      },
    });
    return onboard
  } else {
    return null
  }
}

export function initOnboard(subscriptions) {
  const onboard = Onboard
  return onboard({
    dappId: BLOCKNATIVE_KEY,
    networkId: NETWORK_ID,
    darkMode: false,
    hideBranding: false,
    // darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: wallets
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
      { checkName: 'balance', minimumBalance: '100000' }
    ]
  })
}

export function initNotify() {
  const notify = Notify
  return notify({
    dappId: BLOCKNATIVE_KEY,
    networkId: NETWORK_ID,
    onerror: error => console.log(`Notify error: ${error.message}`)
  })
}
