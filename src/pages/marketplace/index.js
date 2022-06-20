import React, { useState } from 'react'
import { faBitcoinSign, faSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Accordion from '../../components/accordion'
import { PrimaryButton } from '../../components/button'
import { Input, Search } from '../../components/input'
import NFTItem from '../../components/item/nft'
import { PageTitle } from '../../components/label'
import Layout from '../../layout/layout'
import { NFTList } from './data'

const MarketPlacePage = () => {
  const [minTile, setMinTile] = useState()
  const [maxTile, setMaxTile] = useState()
  const [minPrice, setMinPrice] = useState()
  const [maxPrice, setMaxPrice] = useState()

  return (
    <Layout>
      <div className='sm:pl-14 flex flex-col md:flex-row h-full relative'>
        <div className='w-full bg-ne-deepPurple p-3 md:py-6 xl:py-9 flex-col absolute inset-0 md:relative md:flex lg:max-w-sm z-10 hidden bg-gray-400 bg-opacity-50'>
          <div className="hidden md:flex justify-between">
            <div className="flex items-center">
              <button className="rounded-full bg-white p-1.5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M1 21H13L13 23H1L1 21ZM5.24 8.07L8.07 5.24L22.21 19.38L19.38 22.21L5.24 8.07ZM12.32 1L17.98 6.66L15.15 9.49L9.49 3.83L12.32 1ZM3.83 9.48L9.49 15.14L6.66 17.97L1 12.31L3.83 9.48Z" fill="#3E204D" >
                  </path>
                </svg>
              </button>
              <PageTitle>market place</PageTitle>
            </div>
          </div>
          <form className="md:mt-6 space-y-2.5 h-full overflow-y-auto formulate-form formulate-form--search">
            <Search className="" />
            <div className="bg-app-primary text-white bg-opacity-25 bg-blend-multiply shadow rounded-md p-3">
              <Accordion summary={<div className='flex gap-2 items-center'>
                <div className='w-6 h-6 flex items-center justify-center'>
                  <FontAwesomeIcon icon={faSquare} size='lg' />
                </div>
                <h5 className="uppercase text-xl font-semibold select-none"> lands quantity </h5>
              </div>} >
                <div className="mt-8" >
                  <div className="flex justify-between gap-2 items-center">
                    <Input value={minTile} setValue={setMinTile} type="number" placeholder="Min 0.1" />
                    <p>to</p>
                    <Input value={maxTile} setValue={setMaxTile} type="number" placeholder="Max" />
                  </div>
                </div>
              </Accordion>
            </div>

            <div className="bg-app-primary text-white bg-opacity-25 bg-blend-multiply shadow rounded-md p-3">
              <Accordion summary={<div className='flex gap-2 items-center'>
                <div className='w-6 h-6 flex items-center justify-center'>
                  <FontAwesomeIcon icon={faBitcoinSign} size='lg' />
                </div>
                <h5 className="uppercase text-xl font-semibold select-none"> Price (matic) </h5>
              </div>} >
                <div className="mt-8" >
                  <div className="flex justify-between gap-2 items-center">
                    <Input value={minPrice} setValue={setMinPrice} type="number" placeholder="Min 0.1" />
                    <p>to</p>
                    <Input value={maxPrice} setValue={setMaxPrice} type="number" placeholder="Max" />
                  </div>
                </div>
              </Accordion>
            </div>
            <PrimaryButton className="w-full uppercase text-xl">apply</PrimaryButton>
          </form>
        </div>
        <div className='p-3 sm:px-4 sm:py-5 flex flex-col w-full h-screen overflow-hidden'>
          <div data-v-1a35ac0e="" className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between w-full">
            <div data-v-1a35ac0e="">
              <div data-v-1a35ac0e="" className="text-app-green text-label text-md font-semibold">21830 results</div>
              <div data-v-1a35ac0e="" className="mt-0.5 flex">
                <div data-v-1a35ac0e="" className="flex flex-wrap">
                </div>
              </div>
            </div>
            <div data-classification="select" data-has-value="true" data-type="select" className="lg:mr-3 flex-shrink-0 formulate-input" data-v-1a35ac0e="">
              <div className="formulate-input-wrapper">
                <div data-type="select" className="formulate-input-element formulate-input-element--select">
                  <select placeholder="Sort by ..." id="formulate--marketplace-10" name="sortBy" className="outline-none w-full rounded-md text-ne-style shadow placeholder-ne-style override:text-base py-1.5 pl-3 pr-9">
                    <option value="" hidden="hidden" disabled="disabled">
                      Sort by ...
                    </option>
                    <option value="name-asc">Sort by alphabet</option>
                    <option value="name-desc">Sort by reverse alphabet</option>
                    <option value="tileCount-desc">From big to small</option>
                    <option value="tileCount-asc">From small to big</option>
                    <option value="viewCount-desc">Popularity</option>
                    <option value="listingEvent-asc">Listing date from oldest</option>
                    <option value="listingEvent-desc">Listing date from newest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 flex-1 relative'>
            <div className='absolute inset-0 overflow-y-auto section'>
              <div className='grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
                {NFTList.map((nftitem, idx) => (
                  <NFTItem nft={nftitem} key={idx} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default MarketPlacePage