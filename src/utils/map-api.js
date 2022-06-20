import axios from "axios"
import APIkit from "../components/axios"
import {  citiesData } from "./cities"

export const getCurrency = async () => {
  // const res = await axios('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
  // console.log("sdf",((1/parseFloat(Object.values(res.data)[0].usd)).toFixed(10)))
  // return parseFloat((1/parseFloat(Object.values(res.data)[0].usd)).toFixed(10))


  return parseFloat((1 / parseFloat(1.8).toFixed(10)))
}

export const getAddress = async (props) => {
  const { lnglat } = props
  const res = await axios(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lnglat.lng},${lnglat.lat}.json?limit=1&types=address&language=en&access_token=${process.env.REACT_APP_MAPBPX_ACCESSTOKEN}`);
  return res.data.features[0];
}

export const getPlace = async (props) => {
  const { lnglat } = props
  const res = await axios(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lnglat.lng},${lnglat.lat}.json?limit=1&types=place&language=en&access_token=${process.env.REACT_APP_MAPBPX_ACCESSTOKEN}`);
  return res.data.features[0];
}





export const uploadCity = () => {
  axios({
    method: "post",
    data: citiesData,
    url: process.env.REACT_APP_SERVER_URL + "city/init",
  }).then(res => console.log(res))
    .catch(res => console.log(res))
}

export const uploadNFT = (id, uri, count, path, image, price, owner, area) => {
  const nft = {
    tokenId: id,
    tokenUri: uri,
    count: count,
    tilePath: path,
    image: image,
    price: price,
    owner: owner,
    area: area
  }
  console.log("NFT", nft)
  APIkit({
    method: "post",
    data: nft,
    url: process.env.REACT_APP_SERVER_URL + "api/nfts/create",
  }).then(res => console.log(res))
    .catch(res => console.log(res))
}

// export const setBlockList = () => {
//   axios({
//     method: "post",
//     data: {
//       blocked: blockList
//     },
//     url: process.env.REACT_APP_SERVER_URL + "setting/setblock-list",
//   }).then(res => console.log(res))
//     .catch(res => console.log(res))
// }

export const calculatePrice = async (filter, selectPath) => {
  // return {
  //   count:10,
  //   price:0.002
  // }

  const specPrice = await APIkit({
    url: process.env.REACT_APP_SERVER_URL + "api/specland/price",
    method: "post",
    data: {
      // city: cityname.text,
      filter: filter,
      land: selectPath,
    }
  })
  console.log(specPrice)
  return specPrice.data
}

export const filteredNFT = async (filter) => {
  const nfts = await APIkit({
    method: "post",
    url: process.env.REACT_APP_SERVER_URL + "api/nfts/filter",
    data: filter
  })
  let NFTbuffer = []
  if (nfts?.data?.result?.length > 0) {
    for(let nft of nfts.data.result) {
      const newLand = {
        "type": "Feature",
        "properties": {
          "name": nft.owner,
          "type": 4,
          "price": nft.price,
          "existing": true
        },
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": nft.tilePath  //selected Area
        }
      }
      NFTbuffer.push(newLand)
    }
  }
  return NFTbuffer
}


export const getSpecLands = async (filter) => {
  const response = await APIkit({
    method: "post",
    url: process.env.REACT_APP_SERVER_URL + "api/specland/get",
    data: filter
  })
  let landbuffer = []
  if (response.data.result.length > 0) {
    for(let land of response.data.result){
      const newLand = {
        "type": "Feature",
        "properties": {
          "name": land.name,
          "type": 3,
          "price": land.price
        },
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": land.tilePath  //selected Area
        }
      }
      landbuffer.push(newLand)
    }
    // makeSavedlandPath(response.data)
  }
  return landbuffer
}

// export const getMyLands = () => {
//   axios({
//     method: "get"

//   })
// }