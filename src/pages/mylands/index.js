import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../../components/button";
import NFTItem from "../../components/item/nft";
import { useAppContext } from "../../contexts/AppContext";
import Layout from "../../layout/layout";
require('dotenv').config()

const MyLandsPage = () => {
  const context = useAppContext()
  const [nftUris, setNftUris] = useState([])
  let crone

  const fetchNft = async () => {
    if (context.cityContract && context.walletAddress) {
      const myNftIDs = await context.cityContract.methods.tokensOfOwner(context.walletAddress).call()
      const request = myNftIDs.map((id) => fetchNftUri(id));
      const nftUris = await Promise.all(request)
      setNftUris(nftUris)
    }
  }

  const fetchNftUri = (id) => new Promise((resolve) => {
    const uri = context.cityContract.methods.tokenURI(id).call().on("error", () => console.log("error")).then(res => console.log(res))
    resolve(uri)
  })

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

  const sliceAddress = (val) => {
    return val.slice(0, 5) + '...' + val.slice(-4)
  }



  return (
    <Layout>
      <div className="pt-24 container mx-auto">
        <div className="rounded-full bg-gradient-to-r from-app-primary-light to-transparent px-8 py-2 text-white font-bold">
          <p>NFT-City</p>
        </div>
        <div className="flex gap-8 mt-8">
          <div className="flex w-1/2 gap-8">

            <div className="text-white bg-app-primary-light rounded-xl p-6 cursor-pointer w-1/3 h-60">
              <p className="text-xl font-bold">Propoties</p>
              {context.walletAddress && <div className="flex justify-between ">
                <p className="text-app-primary-200">Address</p>
                <p>{sliceAddress(context.walletAddress)}</p>
              </div>}
            </div>

            <div className="text-white bg-app-primary-light rounded-xl p-6 cursor-pointer w-2/3 h-60 flex flex-col">
              <p className="text-xl font-bold">Amount</p>
              <div className="flex divide-x-2 flex-1">
                <div className="flex items-center justify-center flex-col px-8">
                  <p className="text-5xl">4</p>
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
          </div>
          <div className="text-white bg-app-primary-light rounded-xl p-6 cursor-pointer w-3/6 h-60 flex flex-col">
            <p className="text-xl font-bold px-[50px]">MINTS</p>
            <div className="flex flex-1">
              <table className="w-full">
                <thead>
                  <th>
                    Date
                  </th>
                  <th>
                    Amount
                  </th>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">
                      12/13/2022 12:32
                    </td>
                    <td className="text-center">
                      3
                    </td>
                    <td>

                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      12/13/2022 12:32
                    </td>
                    <td className="text-center">
                      3
                    </td>
                    <td>

                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      12/13/2022 12:32
                    </td>
                    <td className="text-center">
                      3
                    </td>
                    <td>

                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      12/13/2022 12:32
                    </td>
                    <td className="text-center">
                      3
                    </td>
                    <td>

                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      12/13/2022 12:32
                    </td>
                    <td className="text-center">
                      3
                    </td>
                    <td>

                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">
                      12/13/2022 12:32
                    </td>
                    <td className="text-center">
                      3
                    </td>
                    <td>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>

          </div>
        </div>
        <div className="container flex items-center justify-center mx-auto pt-24">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {
              nftUris.map((uri, idx) =>
                <NFTItem uri={uri} key={idx} />
              )
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyLandsPage