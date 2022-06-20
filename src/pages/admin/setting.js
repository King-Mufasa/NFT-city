import React, { useEffect,  useState } from 'react'
import axios from 'axios'
import Layout from '../../layout/layout'
import { PrimaryButton } from '../../components/button';
import { Search } from '../../components/input';

const CitySettingPage = () => {
  const [totalCities, setTotalCities] = useState([])
  const [cities, setCities] = useState([])
  const [keyword, setKeyword] = useState("")
  const getCities = () => {
    axios.get(process.env.REACT_APP_SERVER_URL + "city/get").then(res => {
      let data = res.data
      data.sort((a,b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0))
      setCities(data)
      setTotalCities(data)
    }).catch(res => console.log(res))
  }


  const updatePrice = (city, price) => {
    axios({
      url: process.env.REACT_APP_SERVER_URL + "city/update",
      method: "post",
      data: {
        id: city._id,
        price: price,
      }
    }).then(res => console.log(res))
      .catch(res => console.log(res))

  }


  const PriceInput = (props) => {
    const { city } = props
    const [price, setPrice] = useState(city.price)

    return (
      <div className='flex items-center justify-center gap-2'>
        <input value={price} onChange={(e) => setPrice(e.target.value)} className='bg-app-primary-100 outline-none w-10 focus:text-blue-800 font-bold' />
        {price !== city.price ? <PrimaryButton className="px-2 py-1" onClick={() => updatePrice(city, price)}>Update</PrimaryButton> : <p> USDT</p>}
      </div>
    )
  }


  useEffect(() => {
    setCities(keyword.length > 0 ? totalCities.filter(e => {
      return e.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || e.country.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    }) : totalCities)
  }, [keyword, totalCities])

  useEffect(() => {
    getCities()
  }, [])
  return (
    <Layout>
      <div className='py-3 sm:py-8 md:py-10 lg:py-12 xl:py-16 min-h-full flex justify-center text-white md:pl-14 board-container'>
        <div className='max-w-7xl mx-auto px-3 sm:px-6 md:px-8 w-full items-end'>
          <div className='md:mt-3 rounded-md overflow-hidden shadow-table '>
            <div className="bg-app-primary shadow-table flex flex-col pb-3 md:pb-0 space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between ">
              <div className="flex justify-between items-center w-full">
                <span className="text-left m-3 mb-0 md:mb-3 text-2xl md:text-4xl capitalize md:font-bold"> The World's Cities land price</span>
                <Search value={keyword} setValue={setKeyword} className="text-black" />
              </div>
            </div>
            <div className='box-shadow: var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow);'>
              <table className='overflow-scroll w-full table-auto border-separate relative'>
                <thead >
                  <tr >
                    <th className="leaderboard-table-header">
                      <h5 className="uppercase text-white">Rank</h5>
                    </th>
                    <th className="leaderboard-table-header">
                      <h5 className="uppercase text-white">City</h5>
                    </th>
                    <th className="leaderboard-table-header">
                      <h5 className="uppercase text-white">Flag</h5>
                    </th>
                    <th className="leaderboard-table-header">
                      <h5 className="uppercase text-white">Country</h5>
                    </th>
                    <th className="leaderboard-table-header">
                      <h5 className="flex flex-col lg:flex-row items-center justify-center uppercase text-white"> Tile price
                        {/*<svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-4 mt-2 lg:mt-0 lg:ml-2 opacity-50">
                        <path d="M5 5.5L10 0.5L0 0.5L5 5.5Z" fill="white">
                        </path>
                      </svg> */}
                      </h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    cities.map((item, idx) => (
                      <tr className={`${idx % 2 === 0 ? "bg-app-primary-200" : "bg-app-primary-300"} `} key={idx}>
                        <th className="p-1.5 md:p-2.5 font-normal">{idx + 1}</th>
                        <th className="p-1.5 md:p-2.5 font-normal">{item.name}</th>
                        <th className="p-full font-normal">
                          <img src={item.flagUrl} alt={`${item.code} flag`} className="h-8 mx-auto" />
                        </th>
                        <th className="p-1.5 md:p-2.5 font-normal">{item.country}</th>
                        <th className="p-1.5 md:p-2.5 font-normal flex justify-center items-center gap-2">
                          <PriceInput city={item} /></th>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>)
}

export default CitySettingPage