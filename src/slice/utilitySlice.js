import { createSlice, } from '@reduxjs/toolkit';

const initialState = {
  web3: null,
  onBoard: null,
  walletAddress: "",
  connected: false
}

const utilitySlice = createSlice({
  name: 'web3 util',
  initialState,
  reducers: {
    setWeb3: (state, action) => {
      state.web3 = action.payload
    },
    setOnBoard: (state, action) => {
      state.onBoard = action.payload
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    }
  }
})


export const selectUtil = (state) => state.util
export const { setWeb3, setOnBoard, setWalletAddress, setConnected } = utilitySlice.actions
export default utilitySlice.reducer