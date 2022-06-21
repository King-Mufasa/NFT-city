import React, { useEffect, useState } from 'react'
import { faMap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { PrimaryButton } from '../button'
require('dotenv').config()

const NFTItem = (props) => {
  const { className, uri } = props
  const [nft, setNft] = useState()
  const defaultGateway = process.env.REACT_APP_DEFAULT_GATEWAY


  useEffect(() => {
    const fetchNft = () => {
      const customUri = uri.replace("ipfs.io", process.env.REACT_APP_DEFAULT_GATEWAY)
      axios.get(customUri).then(data => {
        setNft(data.data)
      })
    }
    if (uri)
      fetchNft()
  }, [uri])

  return (
    <div className={`relative rounded-md ${className}`}>
      {nft && <div>
        <img src={nft.image.replace('ipfs.io', defaultGateway)} className='rounded-md' alt='nft' />
        <p className='absolute top-2 text-white font-semibold z-10 px-4 text-xl'>{nft.name}</p>
        <div className='absolute rounded-md top-0 w-full h-12 bg-gradient-to-b from-app-primary-100 to-app-trans'></div>
        <div className='absolute rounded-md bottom-0 w-full h-12 bg-gradient-to-t from-app-primary-100 to-app-trans'></div>
        <div className='bg-black text-white rounded-md m-2 absolute bottom-1 left-1 right-1 p-2 gap-2 flex flex-col'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faMap} className='text-app-primary-light' />
              <p className='text-xs md:text-sm '>Up for sale</p>
            </div>
            <p className='text-app-orange font-bold md:text-xl lg:text-2xl'>
              {/* {nft.listing.price.matic} */}
            </p>
          </div>
          <PrimaryButton className="uppercase text-black hover:text-white w-full">View on map</PrimaryButton>
        </div>
      </div>
      }
    </div>
  )
}

export default NFTItem