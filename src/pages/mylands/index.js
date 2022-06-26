import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import { PrimaryButton } from "../../components/button";
import { useAppContext } from "../../contexts/AppContext";
import Layout from "../../layout/layout";
import { selectUtil } from "../../slice/utilitySlice";
import { CONTRACT_ADDRESS_TOKEN } from "../../utils/address";
import "rsuite-table/dist/css/rsuite-table.css";
import { FullscreenLoader } from "../../components/loader";
require('dotenv').config()

const MyLandsPage = () => {

  const util = useSelector(selectUtil)
  console.log("util", util)
  const context = useAppContext()
  const [nftList, setNftList] = useState([])
  const [loading, setLoading] = useState(false)
  // const [nftUris, setNftUris] = useState([])
  // let crone

  // const fetchNft = async () => {
  //   if (context.cityContract && context.walletAddress) {
  //     const myNftIDs = await context.cityContract.methods.tokensOfOwner(context.walletAddress).call()
  //     const request = myNftIDs.map((id) => fetchNftUri(id));
  //     const nftUris = await Promise.all(request)
  //     setNftUris(nftUris)
  //   }
  // }

  // const fetchNftUri = (id) => new Promise((resolve) => {
  //   const uri = context.cityContract.methods.tokenURI(id).call().on("error", () => console.log("error")).then(res => console.log(res))
  //   resolve(uri)
  // })

  // useEffect(() => {
  //   if (context.connected) {
  //     fetchNft()
  //     crone = setInterval(() => {
  //       if (context.connected)
  //         fetchNft()
  //     }, 15000)
  //   }
  //   else {
  //     clearInterval(crone)
  //   }
  // }, [context.connected])

  useEffect(() => {
    const fetchHistory = async () => {
      const apiKey = "DeUdi5nWBmawm7YBsvBa0-22aytCHjOk"
      const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;
      const axiosURL = `${baseURL}`;

      // Address we want get NFT mints from
      const toAddress = context.walletAddress;

      let data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 0,
        "method": "alchemy_getAssetTransfers",
        "params": [
          {
            "fromBlock": "0x0",
            "fromAddress": "0x0000000000000000000000000000000000000000",
            "toAddress": toAddress,
            "excludeZeroValue": true,
            "category": ["erc721", "erc1155"]
          }
        ]
      });


      var requestOptions = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: data,
      };
      setLoading(true)
      const res = await axios(axiosURL, requestOptions);
      // Print contract address and tokenId for each NFT:
      let buffer = []
      for (const events of res.data.result.transfers) {
        if (events.erc1155Metadata == null && events.rawContract.address === CONTRACT_ADDRESS_TOKEN) {
          console.log("ERC-721 Token Minted: ID- ", events.tokenId, " Contract- ", events.rawContract.address);
          buffer.push(events)
        }
      }
      setNftList(buffer)
      console.log(buffer)
      setLoading(false)
    }
    if (context.walletAddress) {
      fetchHistory()
    }
  }, [context.walletAddress])


  const sliceAddress = (val) => {
    return val.slice(0, 5) + '...' + val.slice(-4)
  }

  return (
    <Layout>
      {loading ? <FullscreenLoader /> :
        <div className="pt-24 container mx-auto px-4">
          <div className="rounded-full bg-gradient-to-r from-app-primary-light to-transparent px-8 py-2 text-white font-bold ">
            <p className="text-4xl font-semibold">NFT-City</p>
          </div>
          <div className="grid grid-cols-6 gap-8 mt-8 ">

            <div className="text-white bg-app-primary-light rounded-xl p-6 cursor-pointer sm:h-72 col-span-6 sm:col-span-3 xl:col-span-1">
              <p className="text-xl font-bold">Propoties</p>
              {context.walletAddress && <div className="flex justify-between ">
                <p className="text-app-primary-200">Address</p>
                <p>{sliceAddress(context.walletAddress)}</p>
              </div>}
            </div>

            <div className="text-white bg-app-primary-light rounded-xl p-6 cursor-pointer h-72 flex flex-col col-span-6 sm:col-span-3 xl:col-span-2">
              <p className="text-xl font-bold">Amount</p>
              <div className="flex divide-x-2 flex-1">
                <div className="flex items-center justify-center flex-col px-8">
                  <p className="text-5xl">{nftList.length}</p>
                  <p className="text-app-primary-200">NFTS</p>
                </div>
                <div className="flex flex-col">
                  <div className="">

                  </div>
                </div>
              </div>
              <Link to="/" className="mt-4">
                <PrimaryButton className="w-full">Mint More</PrimaryButton>
              </Link>
            </div>
            <div className="text-white bg-app-primary-light rounded-xl p-6 cursor-pointer h-72 flex flex-col col-span-6 xl:col-span-3">
              <p className="text-xl font-bold px-[50px]">NFTS</p>
              <div className="">
                <Table data={nftList} className="w-full text-app-primary rounded-lg">
                  <Column width={150} resizable>
                    <HeaderCell>Category</HeaderCell>
                    <Cell dataKey="category" className="uppercase" />
                  </Column>
                  <Column width={150} resizable>
                    <HeaderCell>Block Number</HeaderCell>
                    <Cell dataKey="blockNum" />
                  </Column>
                  <Column width={80} resizable>
                    <HeaderCell>Token ID</HeaderCell>
                    <Cell className="flex items-center">
                      {(rowData, rowIndex) => {
                        console.log("KILL",rowData)
                        return (
                          <div
                            key={rowIndex}
                            className="flex items-center gap-2"
                          >
                            <p className="text-app-gray-900 font-medium">
                              {parseInt(rowData.tokenId)}
                            </p>
                          </div>
                        );
                      }}
                    </Cell>
                  </Column>
                  <Column width={"auto"}>
                    <HeaderCell >Hash</HeaderCell>
                    <Cell dataKey="hash" />
                  </Column>
                </Table>
              </div>
            </div>

            <div>

            </div>
          </div>
          {/* <div className="container flex items-center justify-center mx-auto pt-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {
              nftUris.map((uri, idx) =>
                <NFTItem uri={uri} key={idx} />
              )
            }
          </div>
        </div> */}
        </div>}
    </Layout>
  )
}

export default MyLandsPage