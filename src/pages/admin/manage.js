import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { faAngleLeft, faAngleRight, faEye, faInfoCircle, faLocationCrosshairs, faMicrochip, faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { v4 as uuidv4, } from 'uuid';
import mapboxgl from 'mapbox-gl';
import Geocoder from "react-map-gl-geocoder";
import axios from 'axios';
import { CommonButton, PrimaryButton } from '../../components/button';
import Layout from "../../layout/layout";
import "mapbox-gl/dist/mapbox-gl.css";
import { getLandArea, getSelectedArea, getTileArea, getTilePoint, } from '../../utils/fasalib';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/input';
import APIkit from '../../components/axios';
import { getSpecLands, } from '../../utils/map-api';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

let request;
let requestSaved;
const VISIBLE = 17
const MAXTILE = 2500;

let toggleMultiSelect = false
const ManagePage = (props) => {
  const context = useAppContext()
  const navigate = useNavigate()
  if (!context.isOwner) {
    navigate("/")
  }
  const [zoom, setZoom] = useState(20);
  const [expand, setExpand] = useState(true)
  const [filterlng, setFilterLng] = useState(-160.16041746073756)
  const [filterlat, setFilterLat] = useState(21.89266234012584)
  const [gridData, setGridData] = useState([])
  const [savedLand, setSavedLand] = useState([])
  const [selectPath, setSelectPath] = useState([])
  const [startPoint, setStartPoint] = useState([])
  const [dragPoint, setDragPoint] = useState()
  const [selecting, setSelecting] = useState(false)
  const [drag, setDrag] = useState(false)
  const [previewData, setPreviewData] = useState([])
  const [landName, setLandName] = useState()
  const [landPrice, setLandPrice] = useState(0)
  const [hoverInfo, setHoverInfo] = useState(null);
  const [basePrice, setBasePrice] = useState(context.setting?.basePrice)
  const [mapstyle, setMapStyle] = useState({
    url: "mapbox://styles/apetit0111/ckyjvuv9iary214o1hsoph9il",
    name: "satellite"
  })
  const [viewport, setViewport] = useState({
    latitude: 21.8926623,
    longitude: -160.16041746073756,
    zoom: 20,
    bearing: 0,
    pitch: 0
  });

  const geocoderContainerRef = useRef(); //GeoCoder
  const mapRef = useRef(); //Map container
  const layerStyle = {
    id: 'point',
    type: 'line',
    paint: {
      'line-width': 0.5,
      'line-color': '#60c1f5',
    }
  };

  const areaStyle = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-color': {
        property: 'type',
        stops: [
          [1, '#FFFFFF'],
          [2, '#abdda4'],
          [3, '#0075ff'],
        ]
      },
      "fill-opacity": 0.5
    }
  }


  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: { offsetX, offsetY }
    } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(
      hoveredFeature
        ? {
          feature: hoveredFeature,
          x: offsetX,
          y: offsetY
        }
        : null
    );
  }, []);


  const filteredLands = () => {
    const filter = {
      lngMin: Math.min(mapRef.current.getMap().getBounds()._ne.lng, mapRef.current.getMap().getBounds()._sw.lng),
      lngMax: Math.max(mapRef.current.getMap().getBounds()._ne.lng, mapRef.current.getMap().getBounds()._sw.lng),
      latMin: Math.min(mapRef.current.getMap().getBounds()._ne.lat, mapRef.current.getMap().getBounds()._sw.lat),
      latMax: Math.max(mapRef.current.getMap().getBounds()._ne.lat, mapRef.current.getMap().getBounds()._sw.lat),
    }
    clearTimeout(requestSaved)
    requestSaved = setTimeout(async () => {
      const specLand = await getSpecLands(filter)
      setSavedLand(specLand)
    }, 200)
  }

  useEffect(() => {
    async function fetchData() {
      if (context.cityContract) {
        const basePrice = await context.cityContract.methods._basePrice().call()
        setBasePrice(parseFloat(basePrice / 1000000000000000000))
      }
    }
    fetchData()
  }, [context.cityContract])



  /**
   * Create special area with different price
   */
  const savePrice = () => {
    if (selectPath.length === 0 || landPrice === undefined || landPrice === 0 || landName === undefined || landName === "") {
      context.notify.notification({
        eventCode: 'dbUpdate',
        type: 'error',
        message:
          'Please set all require values (price, land, name)'
      })
      return
    }
    const area = getLandArea(selectPath)
    APIkit({
      method: "POST",
      url: process.env.REACT_APP_SERVER_URL + "api/specland/create",
      data: {
        landId: uuidv4(),
        area: area,
        price: landPrice,
        name: landName,
        count: selectPath.length,
        tilePath: selectPath,
      }
    })
      .then(
        (response) => {
          const newLand = {
            "type": "Feature",
            "properties": {
              "name": response.data.name,
              "type": 3,
              "price": response.data.price
            },
            "geometry": {
              "type": "MultiPolygon",
              "coordinates": response.data.tilePath  //selected Area
            }
          }
          setSavedLand([...savedLand, newLand])
          setSelectPath([])
        }
      )
      .catch(
        (response) => console.log("error", response)
      )
  }


  /**
   * set Base price of contract
   */
  const saveBasePrice = async () => {
    if (basePrice === undefined || basePrice === "") {
      context.notify.notification({
        eventCode: 'dbUpdate',
        type: 'error',
        message:
          'Please input valid price'
      })
      return
    }
    if (context.cityContract) {
      const maticPrice = basePrice * 10 ** 18
      if (context.cityContract && context.address) {
        const hash = await context.cityContract.methods
          .setBasePrice(maticPrice.toString())
          .send({ from: context.address })
          .then(res => console.log(res))
        console.log(hash)
      }
    }
  }


  /**
   * Zoom control
   * @param {*} e
   */

  const handleZoom = (e) => {
    setZoom(e.target.value)
    setViewport({
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: parseFloat(e.target.value)
    })
  }

  const handleStepZoom = (increase) => {
    let newZoom;
    if (increase) {
      newZoom = zoom < 24 ? zoom + 1 : 24
    }
    else (
      newZoom = zoom > 1 ? zoom - 1 : 0
    )
    setViewport({
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: newZoom
    })
    setZoom(newZoom)
  }


  /**
   * get grid lat lng from api, to draw grid view on map
   * @param {*} viewport map props object
   */
  useEffect(() => {
    filteredLands()
    if (!selecting) {
      clearTimeout(request)
      request = setTimeout(() => {
        if (mapRef.current) {
          axios.get("https://api.what3words.com/v3/grid-section", {
            params: {
              "key": process.env.REACT_APP_W3W_KEY,
              "bounding-box": `${mapRef.current.getMap().getBounds()._ne.lat},${mapRef.current.getMap().getBounds()._ne.lng},${mapRef.current.getMap().getBounds()._sw.lat},${mapRef.current.getMap().getBounds()._sw.lng}`,
              "format": "geojson"
            }
          }).then((response) => {
            makeGridData(response.data)
          }).catch(response => console.log(response))
        }
      }, 100)
    }
    setZoom(viewport.zoom)
    setDrag(true)
  }, [viewport, selecting])


  const makeGridData = (data) => {
    let featureData = []
    const buffData = data.features[0].geometry.coordinates
    buffData.map((item, idx) => {
      if (idx < buffData.length)
        // if (idx == (buffData.length - 1))
        featureData.push(item)
    })
    setGridData(featureData)
  }


  const handleCross = () => {
    setZoom(20)
    setFilterLat(0)
    setFilterLng(0)
    setViewport({
      latitude: parseFloat(0),
      longitude: parseFloat(0),
      zoom: 20
    })
  }

  const handleViewportChange = useCallback(
    (newViewport) => {
      setViewport(newViewport)
    },
    []
  );

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {

      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    [handleViewportChange]
  );

  /**
   * select area when user click map tile
   * @param {*} event map event object
   */
  const selectArea = (event) => {
    if (viewport.zoom > VISIBLE) {
      const newArea = getTilePoint(gridData, event.lngLat)
      // if clicked point is out of seleceted area. drag preview area and select new area.
      if (selectPath.filter(e => JSON.stringify(e) === JSON.stringify([newArea])).length === 0) {
        if (!drag) {
          toggleMultiSelect = !toggleMultiSelect
          setSelecting(!selecting)
          if (toggleMultiSelect) {
            setStartPoint(event.lngLat)
          }
          else {
            const buffer = selectPath.concat(getSelectedArea(gridData, previewData))
            let filteredBuffer = Array.from(new Set(buffer.map(JSON.stringify)), JSON.parse)
            setSelectPath(filteredBuffer.slice(0, MAXTILE))
            setPreviewData([])
            setStartPoint([])
            setPreviewData([])
          }
        }
        setDrag(false)
      }
      // if clicked point is under selected area, remove it from selected area.
      else {
        setSelectPath(selectPath.filter(e => JSON.stringify(e) !== JSON.stringify([newArea])).slice(0, MAXTILE))
      }
    }
  }
  /**
   * Draw preview tile
   */
  useEffect(() => {
    if (viewport.zoom > VISIBLE) {
      if (toggleMultiSelect) {
        setPreviewData(getTileArea(getTilePoint(gridData, startPoint), getTilePoint(gridData, dragPoint.lngLat)))
      }
    }
  }, [dragPoint, startPoint, gridData, viewport.zoom])


  const data = useMemo(() => {
    let features = [
      {
        "type": "Feature",
        "properties": {
          "name": "grid",
          "type": 2
        },
        "geometry": {
          "coordinates": gridData,
          "type": "MultiLineString"
        },
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Selected",
          "type": 2
        },
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": selectPath  //selected Area
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Preview",
          "type": 1
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            previewData  //Previewing Area
          ]
        },
      },
    ]
    features = features.concat(savedLand)
    return {
      "type": "FeatureCollection",
      "features": features
    }
  }, [selectPath, previewData, gridData, savedLand])

  useEffect(() => {
    setViewport({
      latitude: parseFloat(filterlat),
      longitude: parseFloat(filterlng),
      zoom: viewport.zoom
    })
  }, [filterlat, filterlng, viewport.zoom])

  return (
    <Layout>
      <div className='home-container h-screen flex'>
        <ReactMapGL
          {...viewport}
          ref={mapRef}
          width="100%"
          height="100%"
          mapStyle={mapstyle.url}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBPX_ACCESSTOKEN}
          onViewportChange={setViewport}
          onMouseDown={() => setDrag(false)}
          onMouseMove={(e) => setDragPoint(e)}
          onHover={onHover}
          onMouseUp={selectArea}
        >
          {viewport.zoom > VISIBLE && <>
            <Source id="my-data" type="geojson" data={data}>
              <Layer {...layerStyle} />
              <Layer {...areaStyle} />
            </Source>
          </>
          }
          {viewport.zoom > VISIBLE && hoverInfo && hoverInfo.x !== 0 && hoverInfo.y !== 0 && hoverInfo.feature.properties.name !== "grid" && (
            <div className="z-50 absolute text-white bg-gray-900 bg-opacity-50 p-4 rounded-md" style={{ left: hoverInfo.x, top: hoverInfo.y }}>
              <div className='flex gap-1'>Land Name: <p className='font-bold text-cyan-400'>{hoverInfo.feature.properties.name}</p></div>
              <div className='flex gap-1'>Land Price: <p className='font-bold text-yellow-400'>{hoverInfo.feature.properties.price} / Tile</p></div>
            </div>
          )}

          <Geocoder
            mapRef={mapRef}
            containerRef={geocoderContainerRef}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBPX_ACCESSTOKEN}
            newZoom={20}
            zoom={20}
            setZoom={20}
            position="top-right"
          />
        </ReactMapGL>

        <div className='flex select-none'>
          <div className='select-none absolute left-24 flex items-center bottom-10 cursor-pointer zoom-controller gap-1 bg-black bg-opacity-50  p-4 rounded-md text-app-primary-100'>
            <CommonButton onClick={() => { handleStepZoom(false) }}><FontAwesomeIcon icon={faMinus} /></CommonButton>
            <div className='bg-white flex items-center px-2 bg-opacity-50 h-12 rounded-md'>
              <input className='zoom-seeker' type="range" name="vol" min="0" max="24" step={"0.01"} value={zoom} fill={zoom} onChange={handleZoom} style={{ background: 'linear-gradient(to right, #FF35C0 0%, #FF35C0 ' + zoom / 24 * 100 + '%, #fff ' + zoom / 24 * 100 + '%, white 100%)' }} />
            </div>
            <CommonButton onClick={() => { handleStepZoom(true) }}><FontAwesomeIcon icon={faPlus} /></CommonButton>
          </div>
        </div>

        <div className={`w-full max-w-50 bg-gray-900 h-screen absolute top-0 right-0 bg-opacity-50 py-4 px-2 flex flex-col gap-4 ${expand ? "translate-x-0" : "translate-x-full transform"} duration-200`}>
          <div className='flex gap-6'>
            <div className='flex items-center bg-white w-full gap-4 rounded-md' ref={geocoderContainerRef}>
            </div>
            <button className='p-2 text-white rounded-full bg-white bg-opacity-10 w-12 h-12 hover:bg-app-primary-100 outline-none flex-shrink-0' onClick={() => setExpand(!expand)}>
              <FontAwesomeIcon icon={faAngleRight} size='1x' />
            </button>
          </div>
          {selecting && <p className='text-2xl font-bold text-app-green'>Selecting...</p>}
          {!selecting && <div className='flex gap-4 flex-col px-4'>
            <div className='flex text-white justify-between items-end uppercase flex-col'>
              <p className='text-2xl font-bold text-left w-full'> SELECTED LANDS: {selectPath.length}/{MAXTILE}</p>
              <button className='underline font-semibold' onClick={() => setSelectPath([])}>clear selection</button>
            </div>
            <div className='rounded-xl bg-gray-800 bg-opacity-50 text-white font-semibold'>
              <div className='p-6 flex flex-col gap-4'>
                <div className='flex justify-between items-center'>
                  <p className='capitalize text-2xl font-bold'>Set Land Price</p>
                </div>
                <div className='flex gap-2 items-center justify-between'>
                  <div className='flex gap-2 items-center'>
                    <p className='text-lg'>TOTAL {(landPrice * selectPath.length).toFixed(2)} USDT</p>
                  </div>
                  <FontAwesomeIcon icon={faInfoCircle} size='lg' className='' />
                </div>
                <div>
                  <p>Area Name</p>
                  <Input value={landName} setValue={setLandName} />
                  <p>Price per Tile</p>
                  <Input value={landPrice} setValue={setLandPrice} type="number" />
                </div>

                <div className='opacity-60 flex gap-4'>
                  <p>{viewport.longitude}</p>
                  <p>{viewport.latitude}</p>
                </div>
              </div>
              <div className='bg-app-primary p-6 rounded-b-xl flex flex-col gap-4'>
                <PrimaryButton className="w-full uppercase text-xl" onClick={() => savePrice()}>set price</PrimaryButton>
              </div>
            </div>
            <div className='rounded-xl bg-gray-800 bg-opacity-50 text-white font-semibold'>
              <div className='p-6 flex flex-col gap-4'>
                <div className='flex justify-between items-center'>
                  <p className='capitalize text-2xl font-bold'>Set Base Price</p>
                  <p className='text-sm'>( All price for land and see )</p>
                </div>
                <div className='flex gap-2 items-center justify-between'>
                  <div className='flex gap-2 items-center'>
                    <Input value={basePrice} setValue={setBasePrice} />
                  </div>
                </div>
              </div>
              <div className='bg-app-primary p-6 rounded-b-xl flex flex-col gap-4'>
                <PrimaryButton className="w-full uppercase text-xl" onClick={() => saveBasePrice()}>set Base price</PrimaryButton>
              </div>
            </div>
          </div>
          }
        </div>
        {!expand && <div className='w-16 h-screen fixed right-0 bg-opacity-50 bg-gray-900 flex flex-col items-center py-2 gap-4 select-none'>
          <button className='p-2 text-white rounded-full bg-white bg-opacity-10 w-12 h-12 hover:bg-app-primary-100 outline-none' onClick={() => setExpand(true)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <CommonButton onClick={() => setExpand(true)}>
            <FontAwesomeIcon size='1x' icon={faSearch} />
          </CommonButton>
          <CommonButton onClick={() => setExpand(true)}>
            <FontAwesomeIcon size='1x' icon={faEye} />
          </CommonButton>
          <CommonButton onClick={() => handleCross()}>
            <FontAwesomeIcon size='1x' icon={faLocationCrosshairs} />
          </CommonButton>
          <div className='flex gap-20 flex-col'>
            <FontAwesomeIcon icon={faMicrochip} size='1x' className='text-white mt-8' />
            <p className='text-white font-bold transform rotate-90 uppercase whitespace-nowrap text-xl'>Tiles selected :</p>
          </div>
        </div>}


      </div>
    </Layout >
  )
}

export default ManagePage