import * as faceapi from 'face-api.js'
import { loggerService } from './loggerService'

export const faceService = {
  loadModels,
  getFaceImage,
}

function loadModels() {
  try {
    faceapi.nets.tinyFaceDetector.loadFromUri('/face-models')
  } catch (err) {
    loggerService.error('[FaceService] error while loading models', err)
    faceapi.nets.tinyFaceDetector.loadFromUri('/face-models')
  }
}

// Give up face capture after: (5 seconds)
const MIN_DETECTION_SCORE = 0.6
const MAX_TIME = 1000 * 5
const options = new faceapi.TinyFaceDetectorOptions()

async function getFaceImage(video, time) {
  return new Promise((res, rej) => {
    if (time) {
      if (time - Date.now() <= 0) return rej(Error('Maximum capture time passed'))
    } else time = Date.now() + MAX_TIME
    _getSingleFace(video).then((detection) => {
      if (detection) {
        const { x, y } = detection.box.topLeft
        res(_cropImg(video, 200, 200, x - 10, y - 50))
      } else return res(getFaceImage(video, time))
    })
  })
}

function _getSingleFace(video) {
  return new Promise((res) => {
    const timeout = setTimeout(res, 300, null)
    return faceapi.detectSingleFace(video, options).then((detection) => {
      if (detection && detection.score > MIN_DETECTION_SCORE) {
        clearTimeout(timeout)
        return res(detection)
      }
    })
  })
}

function _cropImg(video, width, height, x, y) {
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  context.drawImage(video, x, y, width, height, 0, 0, width, height)
  return canvas.toDataURL()
}
