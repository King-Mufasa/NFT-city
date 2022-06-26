/**
 * Get clicked tile points
 * @param {*} gridData grid data of current viewport
 * @param {*} lngLat clicked point
 * @returns 5 point of tile which include clicked point
 */
export const getTilePoint = (gridData, lngLat) => {
  let startLat, startLng, endLat, endLng;
  const buffer = gridData
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i][0][0] < lngLat[0] && buffer[i + 1][0][0] > lngLat[0]) {
      startLat = parseFloat(buffer[i][0][0].toFixed(9))
      endLat = parseFloat(buffer[i + 1][0][0].toFixed(9))
    }
    if (buffer[i][0][1] < lngLat[1] && buffer[i + 1][0][1] > lngLat[1]) {
      startLng = parseFloat(buffer[i][0][1].toFixed(9))
      endLng = parseFloat(buffer[i + 1][0][1].toFixed(9))
    }
  }
  const pointer = [[startLat, startLng], [startLat, endLng], [endLat, endLng], [endLat, startLng], [startLat, startLng]]
  return (pointer)
}


/**
 * Get selected area with mouse drap
 * @param {*} start start point, array of 5 dot
 * @param {*} end end point, array of 5 dot
 * @returns 5 point array of selected area
 */
export const getTileArea = (start, end) => {
  return ([[Math.min(start[0][0], end[0][0]), Math.min(start[0][1], end[0][1])],
  [Math.min(start[1][0], end[1][0]), Math.max(start[1][1], end[1][1])],
  [Math.max(start[2][0], end[2][0]), Math.max(start[2][1], end[2][1])],
  [Math.max(start[3][0], end[3][0]), Math.min(start[3][1], end[3][1])],
  [Math.min(start[0][0], end[0][0]), Math.min(start[0][1], end[0][1])]
  ])
}

/**
 * get center point as key point from tile
 * @param {*} path 5 point array of tile
 * @returns key point of clicked tile0
 */
export const getKeyPoint = (path) => {
  if (path.length === 5 && path[0] !== null && path[1] !== null && path[2] !== null && path[3] !== null && path[4] !== null) {
    const data = {
      lng: parseFloat((path[1][0] + (path[2][0] - path[1][0]) / 2).toFixed(9)),
      lat: parseFloat((path[0][1] + (path[1][1] - path[0][1]) / 2).toFixed(9))
    }
    return (data)
  }
  else {
    return null
  }
}


export const getTileFromKey = (gridData, lngLat) => {
  let startLat, startLng, endLat, endLng;
  const buffer = gridData
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i][0][0] < lngLat.lng && buffer[i + 1][0][0] > lngLat.lng) {
      startLat = buffer[i][0][0]
      endLat = buffer[i + 1][0][0]
    }
    if (buffer[i][0][1] < lngLat.lat && buffer[i + 1][0][1] > lngLat.lat) {
      startLng = buffer[i][0][1]
      endLng = buffer[i + 1][0][1]
    }
  }
  const pointer = [[startLat, startLng], [startLat, endLng], [endLat, endLng], [endLat, startLng], [startLat, startLng]]
  return (pointer)
}


/**  B ______ C
 *    |      |
 *    |      |
 *    |______|
 *   A        D
 * 
 * get current tile's point with start point
 * @param {*} gridData
 * @param {*} point point A (left bottom)
 * @returns tile's point
 */
export const getNextXpoint = (gridData, point) => {
  const buffer = gridData
  let pointB, pointC, pointD
  if (point !== undefined && point.length > 0) {
    for (let i = 0; i < buffer.length - 1; i++) {
      if (parseFloat(buffer[i][0][0].toFixed(9)) - point[0] === 0) {
        pointD = [parseFloat(buffer[i + 1][0][0].toFixed(9)), point[1]]
      }
      if (parseFloat(buffer[i][0][1].toFixed(9)) - point[1] === 0) {
        pointB = [point[0], parseFloat(buffer[i + 1][0][1].toFixed(9))]
      }
    }
    if (pointD !== undefined && pointB !== undefined && pointD.length > 0 && pointB.length > 1)
      pointC = [pointD[0], pointB[1]]
    return ([point, pointB, pointC, pointD, point])
  }
}


/**
 *    ______________
 *   |  |           |
 *   |  |           |
 *   |  |   All     |
 *   |  |           |
 *   |__|___________|
 *   |__|___________|
 * 
 * @param {*} gridData 
 * @param {*} preview big tile made by mouse drag
 * @returns all list of tiles in selected area
 */

export const getSelectedArea = (gridData, preview) => {
  let Oldtile = []
  let buffer = []
  let test;
  let endPoint = preview
  let nextStart = preview[0];
  // console.log("griddata",gridData)
  // console.log("preview",preview)
  let limit = 100
  if (gridData !== undefined && preview !== undefined) {
    do {
      endPoint = buffer.length === 0 ? preview[3] : Oldtile[2]
      test = 0
      limit--
      if (limit === 0) {
        break
      }
      do {
        let tile = getNextXpoint(gridData, test === 0 ? nextStart : Oldtile[3])
        if (test === 0)
          nextStart = tile[1]
        Oldtile = tile
        buffer = [...buffer, [tile]]
        test++
        // console.log(Oldtile, endPoint)
      } while (Oldtile !== undefined && JSON.stringify(Oldtile[3]) !== JSON.stringify(endPoint))
      // console.log("Old", Oldtile)
    } while (Oldtile !== undefined && JSON.stringify(Oldtile[2]) !== JSON.stringify(preview[2]))
  }
  return buffer
}


export const simplifyTile = (tileData) => {
  let buff = []
  tileData[0].forEach((data) => {
    buff.push([parseFloat(data[0]).toFixed(9), parseFloat(data[1]).toFixed(9)])
  })
  return JSON.stringify([buff])
}

export const getLandArea = (tileData) => {
  if (tileData !== null) {
    let minLng = tileData[0][0][0][0], minLat = tileData[0][0][0][1], maxLng = minLng, maxLat = minLat
    tileData.forEach((tile) => {
      tile[0].forEach((data) => {
        minLng = Math.min(minLng, data[0])
        maxLng = Math.max(maxLng, data[0])
        minLat = Math.min(minLat, data[1])
        maxLat = Math.max(maxLat, data[1])
      })
    })
    return {
      minLng: minLng,
      maxLng: maxLng,
      minLat: minLat,
      maxLat: maxLat,
    }
  }
}

export const checkDistance = (newpoint, area) => {
  if ((getLandArea(area).minLng - newpoint[0] > 0.0001)
    || (getLandArea(area).maxLng - newpoint[0] > 0.0001)
    || (getLandArea(area).minLat - newpoint[1] > 0.005)
    || (getLandArea(area).maxLat - newpoint[1] > 0.005)) {
    return false
  }
  return true
}


export const checkDouplicate = (existing, selected) => {
  let buff = selected
  for (let i = 0; i < selected.length; i++) {
    const tile = JSON.stringify(selected[i])
    for (let j = 0; j < existing.length; j++) {
      const land = JSON.stringify(existing[j].geometry.coordinates)
      if (land.indexOf(tile) !== -1) {
        buff = buff.filter(e => e !== selected[i])
      }
    }
  }
  return buff
}

export const toUint = (tileArray) => {
  let buffer = []
  tileArray.forEach((tile) => {
    tile[0].forEach((item) => {
      console.log(item)
      buffer.push(item.map((data) => {
        return data * 1000000
      }))
    })
  })
  console.log(buffer)
  return buffer
}

export const toSingleTile = (tileData) => {
  let buffer = []
  for (let squire of tileData) {
    for (let point of squire[0]) {
      buffer.push(point)
    }
  }
  buffer = uniqBy(buffer, JSON.stringify)
  return buffer
}

function uniqBy(a, key) {
  var seen = {};
  return a.filter(function (item) {
    var k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  })
}
