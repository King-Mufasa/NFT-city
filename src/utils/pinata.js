
//imports needed for this function
const FormData = require('form-data');

const key = process.env.REACT_APP_PINATA_KEY
const secret = process.env.REACT_APP_PINATA_SECRET

const axios = require('axios');


export const dataURLtoFile = (dataurl) => {

  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], "mapscreen.png", { type: mime });
}

export const pinFileToIPFS = async (imgData) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let result = {}
  let data = new FormData();
  data.append('file', dataURLtoFile(imgData));
  await axios.post(url,
    data,
    {
      headers: {
        'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
        'pinata_api_key': key,
        'pinata_secret_api_key': secret
      }
    }
  ).then(function (response) {
     result = {
      success: true,
      imageUri: "https://ipfs.io/ipfs/" + response.data.IpfsHash,
      timestamp: response.data.Timestamp
    }
  }).catch(function (error) {
    console.log(error)
    result = {
      success: false,
      error: error
    }
  });

  return result
}

export const createMetaData = async (name, imgUri, tilePath, description, lng, lat) => {
  // const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // const data = {
  //   name: name,
  //   image: imgUri,
  //   description: description,
  //   attributes: {
  //     tilepath: JSON.stringify(tilePath),
  //   }
  // }
  let result = {}
  let data = new FormData();
  data.append('file', new File([JSON.stringify({
    name: name,
    image: imgUri,
    description: description,
    attributes: {
      tilepath: JSON.stringify(tilePath),
      longitude: lng,
      latitude: lat
    }
  })],"metadata.json", { type: "json" }));

  await axios.post(url,
    data,
    {
      headers: {
        'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
        'pinata_api_key': key,
        'pinata_secret_api_key': secret
      }
    }
  ).then((response) => {
    console.log(response)
    result = {
      success: true,
      hash: "https://ipfs.io/ipfs/" + response.data.IpfsHash,
      timestamp: response.data.Timestamp
    }
  }).catch(function (error) {
    result = {
      success: false,
      error: error
    }
  });
  return result
}