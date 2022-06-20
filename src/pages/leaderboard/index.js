import React, { useState } from 'react'
import { PrimaryButton } from '../../components/button'
import Layout from '../../layout/layout'
import { uploadCity } from '../../utils/map-api'
import { countryRanking, userRanking } from './data'
import "./leaderboard.scss"
const LeaderBoardPage = () => {
  const [mode, setMode] = useState(1) //1:user 2:country
  return (
    <Layout>
      <div className='py-3 sm:py-8 md:py-10 lg:py-12 xl:py-16 min-h-full flex justify-center text-white md:pl-14 board-container'>
        <div className='max-w-7xl mx-auto px-3 sm:px-6 md:px-8 w-full'>
          <div className='md:mt-3 rounded-md overflow-hidden shadow-table '>
            <div className="bg-app-primary shadow-table flex flex-col pb-3 md:pb-0 space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between ">
              <div className="flex justify-between items-center">
              <PrimaryButton onClick={()=>{uploadCity()}}>test</PrimaryButton>
                <span className="text-left m-3 mb-0 md:mb-3 text-2xl md:text-4xl capitalize md:uppercase md:font-bold"> users leaderboard </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0 m-3 mb-0 md:hidden">
                  <path d="M12.4132 18.0102L10.9982 16.5972L15.5982 11.9972L10.9982 7.39723L12.4132 5.99023L18.4232 12.0002L12.4142 18.0102H12.4132ZM6.98822 18.0102L5.57422 16.5972L10.1742 11.9972L5.57422 7.40423L6.98822 5.99023L12.9992 12.0002L6.98922 18.0102H6.98822Z" fill="white">
                  </path>
                </svg>
              </div>
              <div data-has-value="true" data-type="select" className="m-3 sm:mr-3 flex-shrink-0 formulate-input" >
                <div className="formulate-input-wrapper">  <div data-type="select" className="formulate-input-element formulate-input-element--select">
                  <select placeholder="Leaderboard type" id="formulate--leaderboard-1" name="leaderboardType" className="text-black outline-none w-full rounded-md text-ne-style shadow placeholder-ne-style override:text-base py-1.5 pl-3 pr-9" onChange={(e) => setMode(parseInt(e.target.value))}>
                    <option value={1} hidden="hidden" disabled="disabled">
                      Leaderboard type
                    </option>
                    <option value={1}>Users</option>
                    <option value={2}>Countries</option>
                  </select>
                </div>
                </div>
              </div>
            </div>
            <div className='box-shadow: var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow);'>
              <table className='overflow-scroll w-full table-auto border-separate relative'>
                <thead >
                  {mode === 1 && <tr >
                    <th className="leaderboard-table-header">
                      <h5 className="uppercase text-white">Rank</h5>
                    </th>
                    <th className="leaderboard-table-header">
                      <h5 className="uppercase text-white">Username</h5>
                    </th>
                    <th className="leaderboard-table-header">
                      <h5 className="flex flex-col md:flex-row items-center justify-center uppercase text-white">
                        <span >Tiles</span>
                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-4 mt-2 md:mt-0 md:ml-2 opacity-50">
                          <path d="M5 5.5L10 0.5L0 0.5L5 5.5Z" fill="white">
                          </path>
                        </svg>
                      </h5>
                    </th>
                    <th className="leaderboard-table-header">
                      <h5 className="flex flex-col md:flex-row items-center justify-center uppercase text-white">
                        <span >Owned NFT</span>
                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-4 mt-2 md:mt-0 md:ml-2">
                          <path d="M5 5.5L10 0.5L0 0.5L5 5.5Z" fill="white">
                          </path>
                        </svg>
                      </h5>
                    </th>
                  </tr>}
                  {
                    mode === 2 && <tr >
                      <th className="leaderboard-table-header">
                        <h5 className="uppercase text-white">Rank</h5>
                      </th>
                      <th className="leaderboard-table-header">
                        <h5 className="uppercase text-white">Flag</h5>
                      </th>
                      <th className="leaderboard-table-header">
                        <h5 className="uppercase text-white">Country</h5>
                      </th>
                      <th className="leaderboard-table-header">
                        <h5 className="flex flex-col lg:flex-row items-center justify-center uppercase text-white"> Tile price <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-4 mt-2 lg:mt-0 lg:ml-2 opacity-50">
                          <path d="M5 5.5L10 0.5L0 0.5L5 5.5Z" fill="white">
                          </path>
                        </svg>
                        </h5>
                      </th>
                      <th className="leaderboard-table-header">
                        <h5 className="flex flex-col lg:flex-row items-center justify-center uppercase text-white">
                          <span >Total tiles sold</span>
                          <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-4 mt-2 lg:mt-0 lg:ml-2 opacity-50">
                            <path d="M5 5.5L10 0.5L0 0.5L5 5.5Z" fill="white">
                            </path>
                          </svg>
                        </h5>
                      </th>
                      <th className="leaderboard-table-header">
                        <h5 className="uppercase flex flex-col lg:flex-row items-center justify-center text-white">
                          <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-0 mb-2 lg:mr-2 lg:mb-0 has-tooltip" data-original-title="null">
                            <path d="M12.836 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10ZM12.836 16v-4M12.836 8.02V8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                          </svg>
                          <span >7 days popularity</span>
                          <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-4 mt-2 lg:mt-0 lg:ml-2">
                            <path d="M5 5.5L10 0.5L0 0.5L5 5.5Z" fill="white">
                            </path>
                          </svg>
                        </h5>
                      </th>
                    </tr>
                  }
                </thead>
                <tbody>
                  {
                    mode === 1 ? userRanking.map((item, idx) => (
                      <tr className={`${idx % 2 === 0 ? "bg-app-primary-200" : "bg-app-primary-300"} `} key={idx}>
                        <th className="p-1.5 md:p-2.5 font-normal">{idx + 1}</th>
                        <th className="p-1.5 md:p-2.5 font-normal flex">
                          <div className="max-w-56 max-h-56 rounded-full overflow-hidden flex-shrink-0 w-6 h-6" >
                            <img src={item.user.avatar} className="object-cover" alt='avatar'/>
                          </div>
                          <a href="/profile/665cbfde-b11d-4115-8354-ffa713c27411" className="ml-2.5" >{item.user.username}</a>
                        </th>
                        <th className="p-1.5 md:p-2.5 font-normal">{item.tilesCount}</th>
                        <th className="p-1.5 md:p-2.5 font-normal">{item.landsCount}</th>
                      </tr>
                    )) :
                      countryRanking.map((item, idx) => (
                        <tr className={`${idx % 2 === 0 ? "bg-app-primary-200" : "bg-app-primary-300"} `} key={idx}>
                          <th className="p-1.5 md:p-2.5 font-normal">{idx + 1}</th>
                          <th className="p-full font-normal">
                            <img src={item.flagUrl} alt={`${item.code} flag`} className="h-8 mx-auto"/>
                          </th>
                          <th className="p-1.5 md:p-2.5 font-normal">{item.name}</th>
                          <th className="p-1.5 md:p-2.5 font-normal">{item.price.toFixed(2)} USDT</th>
                          <th className="p-1.5 md:p-2.5 font-normal">{item.totalTileCount}</th>
                          <th className="p-1.5 md:p-2.5 font-normal">{item.lastWeekTileCount}</th>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LeaderBoardPage