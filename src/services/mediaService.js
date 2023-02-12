
export const mediaService = {
  readFile,
  uploadImg,
  getImgs
  // uploadVid,
}

// const MB = 1024000
// const MAX_VID_SIZE = 80 * MB
const UNSPLASH_KEY = process.env.VUE_APP_UNSPLASH_KEY
const config = { CLOUD_NAME: 'webify', PRESET_NAME: 'intervid' }

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

async function uploadImg(img) {
  const { CLOUD_NAME } = config
  const PRESET_NAME = 'intervid_user'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const formData = new FormData()

  formData.append('file', img)
  formData.append('upload_preset', PRESET_NAME)
  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })
  const uploadedImg = await res.json()
  return uploadedImg.secure_url
}

async function getImgs(search) {
  try {
    const res = await (await fetch(`https://api.unsplash.com/search/photos?page=1&per_page=20&query=${search}&client_id=${UNSPLASH_KEY}`, { method: 'GET' })).json()
    return res.results.map(result => {
      return {
        regular: result.urls.regular,
        small: result.urls.small,
      }
    })
  } catch (err) {
    console.log('cannot get images', err)
  }
}

// function uploadVid(vidBlob) {
//   const fullSize = vidBlob.size
//   if (fullSize > MAX_VID_SIZE) return _chunkedUpload(vidBlob)
//   return _normalUpload(vidBlob)
// }

// async function _chunkedUpload(vidBlob) {
//   const { CLOUD_NAME } = config
//   const PRESET_NAME = 'intervid_cand'
//   const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`

//   var res
//   const uploadId = makeId(10)
//   const fileSize = vidBlob.size
//   const chunkSize = 20 * MB
//   for (let start = 0; start < fileSize; start += chunkSize) {
//     const end = start + chunkSize > fileSize ? fileSize : start + chunkSize
//     const chunk = vidBlob.slice(start, end)
//     const formData = new FormData()
//     formData.append('file', chunk)
//     formData.append('upload_preset', PRESET_NAME)
//     const range = `bytes ${start}-${end - 1}/${fileSize}`
//     res = await fetch(UPLOAD_URL, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Content-Range': range,
//         'X-Unique-Upload-Id': uploadId,
//       },
//     })
//   }
//   const uploadedImg = await res.json()
//   return uploadedImg.secure_url
// }

// async function _normalUpload(vidBlob) {
//   const { CLOUD_NAME } = config
//   const PRESET_NAME = 'intervid_cand'
//   const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
//   const formData = new FormData()

//   formData.append('file', vidBlob)
//   formData.append('upload_preset', PRESET_NAME)
//   const res = await fetch(UPLOAD_URL, {
//     method: 'POST',
//     body: formData,
//   })
//   const uploadedImg = await res.json()
//   return uploadedImg.secure_url
// }

export function checkOnlineStatus() {
  return new Promise((res) => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return res(false)
    const MIN_SPEED = 300 // Kbps
    var imageAddr = 'http://www.tranquilmusic.ca/images/cats/Cat2.JPG' + '?n=' + Math.random()
    var startTime, endTime
    var downloadSize = 5616998
    var download = new Image()
    download.onload = function () {
      endTime = new Date().getTime()
      var duration = (endTime - startTime) / 1000 // Math.round()
      var bitsLoaded = downloadSize * 8
      var speedBps = bitsLoaded / duration
      var speedKbps = speedBps / 1024
      if (speedKbps >= MIN_SPEED) return res(true)
      else return res(false)
    }
    download.onerror = (ev) => {
      res(false)
    }
    startTime = new Date().getTime()
    download.src = imageAddr
  })
}
// Mock interupted screen recording
// (async function () {
//   let chunks = []
//   let recorder = null
//   let stream = null
//   var count = 0
//   var initStream = async () => {
//     stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' }, audio: false })
//     addStreamStopListener(stream).then((e) => {
//       console.log('Stop listener!');
//       console.log(recorder.state);
//     })
//     initRecord()
//   }
//   var initRecord = () => {
//     recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs="vp8, opus"' })
//     recorder.onstop = () => {
//       console.log(recorder.state);
//     }
//     recorder.ondataavailable = e => {
//       chunks.push(e.data)
//     }
//     recorder.onstop = () => {
//       count++
//       console.log('getting data', chunks);
//       // const blob = new Blob(chunks, { type: chunks[0].type })
//       if (count === 2) {
//         // console.log(blob);
//         concatVideo(chunks)

//       }
//     }
//   }
//   await initStream()
//   recorder.start()

//   setTimeout(() => {
//     const tracks = stream.getTracks()
//     tracks.forEach(track => track.stop())
//     setTimeout(async () => {
//       await initStream()
//       recorder.start()
//       setTimeout(() => {
//         const tracks = stream.getTracks()
//         tracks.forEach(track => track.stop())
//       }, 5000)
//     })
//   }, 3000)

// })
// function addVideo(blob) {
//   var vid = document.createElement('video')
//   vid.setAttribute('autoplay', true)
//   vid.setAttribute('controls', true)
//   vid.height = 1000
//   vid.width = 1000
//   vid.src = URL.createObjectURL(blob)
//   document.body.prepend(vid)
// }
//  This should fix compatibility of the event, check in MAC OSX
export function addStreamStopListener(stream) {
  return new Promise((resolve, reject) => {
    try {
      var callback = resolve
      stream.addEventListener(
        'ended',
        (e) => {
          callback(e)
          callback = function () { }
        },
        { once: true },
      )
      stream.addEventListener(
        'inactive',
        (e) => {
          callback(e)
          callback = function () { }
        },
        { once: true },
      )
      stream.getTracks().forEach((track) => {
        track.addEventListener(
          'ended',
          (e) => {
            callback(e)
            callback = function () { }
          },
          { once: true },
        )
        track.addEventListener(
          'inactive',
          (e) => {
            callback(e)
            callback = function () { }
          },
          { once: true },
        )
      })
    } catch (e) {
      reject(e)
    }
  })
}
