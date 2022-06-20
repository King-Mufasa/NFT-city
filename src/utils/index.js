export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: 1,
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: 0,
      };
    }
  } else {
    return {
      address: "",
      status: 3,
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: 1,
        };
      } else {
        return {
          address: "",
          status: 0,
        };
      }
    } catch (err) {
      return {
        address: "",
        status: 2,
      };
    }
  } else {
    return {
      address: "",
      status: 3,
    };
  }
};
