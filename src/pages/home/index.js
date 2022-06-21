import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import * as turf from "@turf/turf";
import { mapStype } from './mapconfig';
import Geocoder from "react-map-gl-geocoder";
import Map, { Source, Layer } from 'react-map-gl';
import WertWidget from '@wert-io/widget-initializer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faEye, faInfoCircle, faLocationCrosshairs, faMicrochip, faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from "../../layout/layout";
import { Input } from '../../components/input';
import Accordion from '../../components/accordion';
import WhiteLogo from '../../assets/icons/logo.png'
import { useAppContext } from '../../contexts/AppContext';
import { FullscreenLoader } from '../../components/loader';
import { createMetaData, pinFileToIPFS } from '../../utils/pinata';
import { CommonButton, PrimaryButton } from '../../components/button';
import { areaStyle, layerStyle } from '../../utils/map-style';
import { calculatePrice, filteredNFT, getAddress, getSpecLands, uploadNFT } from '../../utils/map-api';
import { checkDouplicate, getKeyPoint, getLandArea, getSelectedArea, getTileArea, getTilePoint } from '../../utils/fasalib';
import "./homepage.scss"
require('dotenv').config()

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

let request;
let requestSaved;
const VISIBLE = 17
const MAXTILE = 2500;

let toggleMultiSelect = false
const HomePage = (props) => {
  const context = useAppContext()
  const [zoom, setZoom] = useState(20);
  const [expand, setExpand] = useState(true)
  const [gridData, setGridData] = useState([])
  const [savedLand, setSavedLand] = useState()
  const [existingNFT, setExistingNFT] = useState()
  const [selectPath, setSelectPath] = useState([])
  const [startPoint, setStartPoint] = useState([])
  const [dragPoint, setDragPoint] = useState()
  const [selecting, setSelecting] = useState(false)
  const [drag, setDrag] = useState(false)
  const [landPrice, setLandPrice] = useState(0)
  const [previewData, setPreviewData] = useState([])
  const [address, setAddress] = useState()
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hovered, setHovered] = useState(undefined);
  const [preview, setPreview] = useState()
  const [landName, setLandName] = useState("no-name")
  const [landDesc, setLandDesc] = useState("no-description")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [mapstyle, setMapStyle] = useState({
    url: "mapbox://styles/apetit0111/ckyjvuv9iary214o1hsoph9il",
    name: "satellite"
  })
  const [viewport, setViewport] = useState({
    latitude: 48.8926623,
    longitude: 2.35,
    zoom: 18,
    bearing: 0,
    pitch: 0
  });

  const [captureViewPort, steCaptureViewPort] = useState({
    latitude: 48.8926623,
    longitude: 2.35,
    zoom: 18,
    bearing: 0,
    pitch: 0
  })

  const geocoderContainerRef = useRef(); //GeoCoder
  const mapRef = useRef(); //Map container
  const captureRef = useRef() //Capture map container
  const wertOptions = {
    partner_id: "01G13792P9K49DPFAP2Q0NQQPD",
    container_id: "wert-widget",
    currency_amount: 10,
    commodity: "MATIC",
    color_background: "#ffffff",
    color_buttons: "#4096ff",
    buttons_border_radius: "10",
    color_buttons_text: "#fcfcfc",
    color_main_text: "#525252",
    color_icons: "#7d90ff",
    color_links: "#e82cc9"
  }



  const wertWidget = new WertWidget({
    ...wertOptions,
    listeners: {
      position: data => console.log('step:', data.step),
    }
  });

  // wertWidget.open();



  /**
   * move to zero point
   */
  const handleCross = () => {
    setZoom(20)
    setViewport({
      latitude: parseFloat(0),
      longitude: parseFloat(0),
      zoom: 20
    })
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



  const makeGridData = (data) => {
    let featureData = []
    const buffData = data.features[0].geometry.coordinates
    buffData.forEach(item => {
      featureData.push(item)
    });
    setGridData(featureData)
  }


  /**
   * Geocoder functions.
   */

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
      if (selectPath.length > 1 && selectPath[0][0] !== null) {
        if (getKeyPoint(selectPath[0][0]) === null) {
          setSelectPath([])
        }
        const distance = turf.distance(event.lngLat, [getKeyPoint(selectPath[0][0])?.lng, getKeyPoint(selectPath[0][0])?.lat])
        if (distance > 0.3) {
          context.notify.notification({
            eventCode: 'dbUpdate',
            type: 'hint',
            message:
              'Too for away from select. Clear selection or go back'
          })
          return
        }
      }
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




  // const readyToTransact = async () => {
  //   console.log(context.provider)
  //   if (!context.provider) {
  //     const walletSelected = await context.onBoard.walletSelect()
  //     if (!walletSelected) return false
  //   }
  //   const ready = await context.onBoard.walletCheck()
  //   return ready
  // }

  /**
   * Upload map image to Pinata.
   * @returns
   */

  const uploadData = async () => {
    setStatus(1)
    setLoading(true)
    let result = await pinFileToIPFS(preview)
    if (result.success) {
      const image = result.imageUri
      result = await createMetaData(landName, result.imageUri, selectPath, landDesc, captureViewPort.longitude, captureViewPort.latitude)
      setLoading(false)
      setStatus(0)
      return {
        uri: result.hash,
        image: image
      }
    }
    else {
      setStatus(0)
      setLoading(false)
      //   //handle error
    }
    return false
  }

  /**
   * create zoomed preview for nft
   */
  const makePreview = () => {
    setLoading(true)
    const area = getLandArea(selectPath)
    const centerLat = (area.minLat + area.maxLat) / 2
    const centerLng = (area.minLng + area.maxLng) / 2
    let zoom = 17
    const distance = Math.max((area.maxLat - area.minLat), (area.maxLng - area.minLng))
    console.log(distance)
    if ((distance) > 0.001) {
      zoom = 15
    }
    else if ((distance) > 0.0006) {
      zoom = 15
    }
    else if ((distance) > 0.0004) {
      zoom = 15
    }
    else if ((distance) > 0.0003) {
      zoom = 15
    }
    else if ((distance) > 0.0001) {
      zoom = 15
    }
    else {
      zoom = 15
    }
    steCaptureViewPort({
      latitude: centerLat,
      longitude: centerLng,
      zoom: zoom
    })

    setTimeout(() => {
      setPreview(captureRef.current.getMap().getCanvas().toDataURL())
    }, 2000)
  }

  const mintNFT = async () => {
    if (context.walletAddress !== undefined && context.cityContract) {
      // const specPrice = await calculatePrice(selectPath)
      // const price = await getCurrency(landPrice)
      // const maticPrice = context.web3.utils.toWei(landPrice, 'ether');
      makePreview()
    }
  }

  const handleBuyMatic = () => {
    wertWidget.open();
  }



  useEffect(() => {
    const landMint = async () => {
      const maticPrice = context.web3.utils.toWei(landPrice, 'ether');

      const uri = await uploadData()
      console.log("Upload success", uri)
      if (uri) {
        setStatus(2)
        setLoading(true)
        const { update } = context.notify.notification({
          eventCode: 'dbUpdate',
          type: 'pending',
          message:
            'Confirming transaction'
        })
        if (context.isOwner) {
          await context.cityContract.methods
            .giveaway(uri.uri)
            .send({ from: context.walletAddress })
            .once('sending', function (payload) {
              update({
                eventCode: 'pending',
                message: 'Transaction is sending',
                type: 'pending'
              })
            })
            .on("error", () => {
              setLoading(false)
              setStatus(0)
              update({
                eventCode: 'error',
                message: 'Transacton failed',
                type: 'hint'
              })
              setPreview(null)
            })
            .then(res => {
              setLoading(false)
              setStatus(0)
              if (res?.events?.newTokenId?.returnValues?._value) {
                const area = getLandArea(selectPath)
                uploadNFT(res.events.newTokenId.returnValues._value, uri.image, selectPath.length, selectPath, uri.image, context.web3.utils.fromWei(maticPrice, 'ether'), context.walletAddress, area)
              }
            })
        }
        else {
          await context.cityContract.methods
            .mint(1, selectPath)
            .send({ from: context.walletAddress, value: maticPrice})
            .once('sending', function (payload) {
              update({
                eventCode: 'pending',
                message: 'Transaction is sending',
                type: 'pending'
              })
            })
            .on("error", () => {
              setLoading(false)
              setStatus(0)
              update({
                eventCode: 'error',
                message: 'Transacton failed',
                type: 'hint'
              })
              setPreview(null)
            })
            .then(res => {
              setLoading(false)
              setStatus(0)
              if (res?.events?.newTokenId?.returnValues?._value) {
                const area = getLandArea(selectPath)
                uploadNFT(res.events.newTokenId.returnValues._value, uri.image, selectPath.length, selectPath, uri.image, context.web3.utils.fromWei(maticPrice, 'ether'), context.walletAddress, area)
              }
            })
        }
        update(
          {
            eventCode: 'success',
            message: 'Your Transaction has been successed',
            type: 'success'
          }
        )
        setPreview(null)
      }
    }
    if (preview) {
      // const specPrice = await calculatePrice(selectPath)
      // const price = await getCurrency(landPrice)
      landMint()
    }
  }, [preview])

  const data = useMemo(() => {
    let features = [
      {
        "type": "Feature",
        "properties": {
          "name": "Selected",
          "type": 2,
          "price": context.unitCost
        },
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": selectPath  //selected Area
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Arkansas",
          "type": 1
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            previewData  //Previewing Area
          ]
        },
      },
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
      // {
      //   "type": "Feature",
      //   "properties": {
      //     "name": "grid",
      //     "type": 1
      //   },
      //   "geometry": {
      //     "coordinates": hovered,
      //     "type": "Polygon"
      //   },
      // },
    ]
    if (savedLand !== undefined)
      features = features.concat(savedLand)
    if (existingNFT !== undefined)
      features = features.concat(existingNFT)
    if (hovered !== null)
      features = features.concat(hovered)
    return {
      "type": "FeatureCollection",
      "features": features
    }
  }, [selectPath, previewData, gridData, savedLand, existingNFT, context.unitCost, hovered])

  const nftData = useMemo(() => {
    let features = [
      {
        "type": "Feature",
        "properties": {
          "name": "Selected",
          "type": 2,
          "price": context.unitCost
        },
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": selectPath  //selected Area
        }
      },
    ]
    return {
      "type": "FeatureCollection",
      "features": features
    }
  }, [selectPath])



  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: { offsetX, offsetY }
    } = event;
    const hoveredFeature = features && features[0];
    if (hoveredFeature?.properties?.existing) {
      setHoverInfo(
        hoveredFeature
          ? {
            name: hoveredFeature.properties.name,
            feature: hoveredFeature,
            x: offsetX,
            y: offsetY
          }
          : null
      );
    }
    else {
      setHoverInfo(null)
    }
  }, []);

  useEffect(() => {
    if (hoverInfo?.feature.properties?.existing) {
      setHovered(
        {
          "type": "Feature",
          "properties": {
            "type": 5,
          },
          "geometry": hoverInfo?.feature.geometry
        }
      )
    }
    else {
      setHovered(null)
    }
  }, [hoverInfo])


  const getFilter = () => {
    let filter
    if (mapRef !== undefined) {
      filter = {
        lngMin: Math.min(mapRef.current?.getMap().getBounds()._ne.lng, mapRef.current?.getMap().getBounds()._sw.lng),
        lngMax: Math.max(mapRef.current?.getMap().getBounds()._ne.lng, mapRef.current?.getMap().getBounds()._sw.lng),
        latMin: Math.min(mapRef.current?.getMap().getBounds()._ne.lat, mapRef.current?.getMap().getBounds()._sw.lat),
        latMax: Math.max(mapRef.current?.getMap().getBounds()._ne.lat, mapRef.current?.getMap().getBounds()._sw.lat),
      }
    }
    return filter
  }

  useEffect(() => {
    async function fetchData() {
      const valid = checkDouplicate(existingNFT, selectPath)
      if (valid !== selectPath) {
        setSelectPath(valid)
      }
      const specPrice = await calculatePrice(getFilter(), selectPath)
      // console.log("unit cose", context.unitCost)
      setLandPrice((context.unitCost * (selectPath.length - specPrice.count) + specPrice.price).toFixed(2))
    }
    fetchData()
  }, [selectPath, context.unitCost, existingNFT])


  /**
   * get grid lat lng from api, to draw grid view on map
   * @param {*} viewport map props object
   */
  useEffect(() => {
    const filter = {
      lngMin: Math.min(mapRef.current.getMap().getBounds()._ne.lng, mapRef.current.getMap().getBounds()._sw.lng),
      lngMax: Math.max(mapRef.current.getMap().getBounds()._ne.lng, mapRef.current.getMap().getBounds()._sw.lng),
      latMin: Math.min(mapRef.current.getMap().getBounds()._ne.lat, mapRef.current.getMap().getBounds()._sw.lat),
      latMax: Math.max(mapRef.current.getMap().getBounds()._ne.lat, mapRef.current.getMap().getBounds()._sw.lat),
    }
    clearTimeout(requestSaved)
    requestSaved = setTimeout(async () => {
      // const savedLand = await filteredLands(filter)
      // setSavedLand(savedLand)
      if (mapRef) {
        const nfts = await filteredNFT(getFilter())
        setExistingNFT(nfts)
        const specLand = await getSpecLands(filter)
        setSavedLand(specLand)
      }
    }, 500)
    if (!selecting) {
      clearTimeout(request)
      request = setTimeout(async () => {
        if (viewport.zoom >= VISIBLE && mapRef.current !== null) {
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
        const address = await getAddress({
          lnglat: {
            lng: viewport.longitude,
            lat: viewport.latitude
          }
        })
        if (address !== undefined)
          setAddress(address.place_name_en)
      }, 100)
    }
    setZoom(viewport.zoom)
    setDrag(true)
  }, [viewport, selecting])

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



  return (
    <Layout>
      {loading && <FullscreenLoader msg={status === 1 ? "uploading" : status === 2 ? "confirming" : ""} />}
      <div className='home-container h-screen flex'>
        <Map
          {...viewport}
          ref={mapRef}
          width="100%"
          height="100%"
          mapStyle={mapstyle.url}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBPX_ACCESSTOKEN}
          onViewportChange={setViewport}
          onMouseDown={() => setDrag(false)}
          onMouseMove={(e) => setDragPoint(e)}
          onMouseUp={selectArea}
          onHover={onHover}
          preserveDrawingBuffer={true}
          onLoad={() => { console.log("Loaded!") }}
        >
          {viewport.zoom > VISIBLE && <>
            <Source id="my-data" type="geojson" data={data}>
              <Layer {...areaStyle} />
              <Layer {...layerStyle} />
            </Source>
          </>
          }
          {viewport.zoom > VISIBLE && hoverInfo && hoverInfo.x !== 0 && hoverInfo.y !== 0 && hoverInfo.feature.properties.name !== "grid" && (
            <div className="z-50 absolute text-white bg-gray-900 bg-opacity-50 p-4 rounded-md" style={{ left: hoverInfo.x, top: hoverInfo.y }}>
              {hoverInfo.feature.properties?.existing ? <div className='flex gap-1'>Owner : <p className='font-bold text-cyan-400'>{hoverInfo.feature.properties.name}</p></div>
                : <div className='flex gap-1'>Land Name: <p className='font-bold text-cyan-400'>{hoverInfo.feature.properties.name}</p></div>}
              {hoverInfo.feature.properties?.existing ? <div className='flex gap-1'>Price: <p className='font-bold text-yellow-400'>{hoverInfo.feature.properties.price}</p></div>
                : <div className='flex gap-1'>Land Price: <p className='font-bold text-yellow-400'>{hoverInfo.feature.properties.price} / Tile</p></div>}
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
        </Map>
        <div className='w-full h-full items-center justify-center relative hidden'>
          <Map
            {...captureViewPort}
            ref={captureRef}
            width="500px"
            height="500px"
            mapStyle={mapStype[3].url}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBPX_ACCESSTOKEN}
            preserveDrawingBuffer={true}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Source id="my-data" type="geojson" data={nftData}>
              <Layer {...areaStyle} />
            </Source>
          </Map>
        </div>

        <div className='flex select-none'>
          <div className='select-none absolute left-24 flex items-center bottom-10 cursor-pointer zoom-controller gap-1 bg-black bg-opacity-50  p-4 rounded-md text-app-primary-100'>
            <CommonButton onClick={() => { handleStepZoom(false) }}><FontAwesomeIcon icon={faMinus} /></CommonButton>
            <div className='bg-white flex items-center px-2 bg-opacity-50 h-12 rounded-md'>
              <input className='zoom-seeker' type="range" name="vol" min="0" max="24" step={"0.01"} value={zoom} fill={zoom} onChange={handleZoom} style={{ background: 'linear-gradient(to right, #FF35C0 0%, #FF35C0 ' + zoom / 24 * 100 + '%, #fff ' + zoom / 24 * 100 + '%, white 100%)' }} />
            </div>
            <CommonButton onClick={() => { handleStepZoom(true) }}><FontAwesomeIcon icon={faPlus} /></CommonButton>
          </div>
        </div>

        <div className={`w-full max-w-50 bg-gray-900 absolute top-12 bottom-0 right-0 bg-opacity-50 py-4 px-2 flex flex-col gap-4 ${expand ? "translate-x-0" : "translate-x-full transform"} duration-200`}>
          <div className='flex items-end justify-end gap-4'>
            <Accordion summary={<div className='flex gap-2 cursor-pointer items-center'><FontAwesomeIcon icon={faEye} /><p>{mapstyle.name}</p></div>} className="bg-white py-2 rounded-md  w-40 relative" autoclose={true}>
              <div className='flex flex-col gap-2 mt-4 absolute bg-white w-full left-0 rounded-md px-4 py-2 z-10' >
                {mapStype.map((style, idx) => (
                  <div className='cursor-pointer' onClick={() => { setMapStyle(style); }} key={idx}>{style.name}</div>
                ))}
              </div>
            </Accordion>
            <button className='p-2 text-white rounded-full bg-white bg-opacity-10 w-12 h-12 hover:bg-app-primary-100 outline-none flex-shrink-0' onClick={() => setExpand(!expand)}>
              <FontAwesomeIcon icon={faAngleRight} size='1x' />
            </button>
          </div>
          {/* <div className='flex justify-center items-center h-32'>
            <img src={Logo} className='h-full' />
          </div> */}
          <div className='flex gap-6 h-12 justify-center w-full px-4 mt-8'>
            <div className='flex items-center bg-white gap-4 rounded-md w-full ' ref={geocoderContainerRef}>
            </div>
          </div>
          {selectPath.length > 0 &&
            <div className='mt-4'>
              {selecting && <p className='text-2xl font-bold text-app-green'>Selecting...</p>}
              {!selecting && <div className='flex gap-4 flex-col px-4'>

                <div className='rounded-xl bg-gray-400 bg-opacity-50 text-white font-semibold relative'>
                  {/* {uploading && <Loader />} */}
                  <div className='p-6 flex flex-col gap-4'>
                    <div className='flex text-white justify-between uppercase '>
                      <p className='text-right text-gray-300'>{selectPath.length}/2500</p>
                      <button className='font-semibold px-4 py-1 bg-gray-900 rounded-full' onClick={() => setSelectPath([])}>clear selection</button>
                    </div>
                    {
                      selectPath.length > 0 && preview && <div>
                        <p>preview</p>
                        <div className='flex items-center gap-8'>
                          <img src={preview} alt="preview" className="w-32 h-32 rounded-xl border" />
                          <div className='flex-col gap-4 hidden'>
                            <div>
                              <p>Land name</p>
                              <Input value={landName} setValue={setLandName} />
                            </div>
                            <div>
                              <p>Land Description</p>
                              <Input value={landDesc} setValue={setLandDesc} />
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    <div className='flex gap-2 items-center justify-between'>
                      <div className='flex gap-2 items-center'>
                        <p className='text-2xl'>Price per Land {context.unitCost}  USDT</p>
                      </div>
                      <FontAwesomeIcon icon={faInfoCircle} size='lg' className='' />
                    </div>
                    <div className='flex gap-2'>
                      <p className='text-gray-300'>{address}</p>
                    </div>
                    <div className='text-gray-300 flex gap-4'>
                      <p>{viewport.longitude}</p>
                      <p>{viewport.latitude}</p>
                    </div>
                    {context.connected &&
                      <div className='flex gap-2 flex-col justify-end items-end'>
                        <div className='flex gap-2 w-1/2'>
                          <p className='text-gray-300 w-28'>TOTAL</p>
                          <p className=''>{landPrice} USDT</p>
                        </div>
                        <div className='flex gap-2 w-1/2'>
                          <p className='text-gray-300 w-28'>Current Owner</p>
                          <p className=''>-</p>
                        </div>
                      </div>}
                  </div>
                  {context.connected && <div className='bg-black p-6 rounded-b-xl flex flex-col gap-4 bg-opacity-70'>
                    <PrimaryButton className="w-full uppercase text-xl" onClick={() => {
                      if (context.walletAddress)
                        mintNFT()
                      else if (!context.wallet || !context.wallet.provider)
                        context.onBoard.walletSelect()
                      else if (context.wallet.provider)
                        context.onBoard.walletCheck()
                    }}>{context.walletAddress ? "buy now" : "Connect Wallet"}</PrimaryButton>

                    <PrimaryButton className="w-full uppercase text-xl" onClick={handleBuyMatic}>Buy With Card</PrimaryButton>
                  </div>}
                </div>
                <img src={WhiteLogo} className='opacity-50' alt='logo' />
              </div>
              }
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

export default HomePage