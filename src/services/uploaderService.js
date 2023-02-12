import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import AwsS3Multipart from '@uppy/aws-s3-multipart'
import httpService from './httpService'
import { loggerService } from './loggerService'
import store from '@/store'

export const uploaderService = {
  initVideoUpload,
  initUpload,
  uploadFile,
  handleNetworkError,
  retryUpload,
  addEventListener,
}

const ROUTE = 'upload'

let gUppy = null

const logger = {
  error: (...args) => loggerService.error('[Uppy]', ...args),
  warn: (...args) => loggerService.warn('[Uppy]', ...args),
  debug: (...args) => loggerService.debug('[Uppy]', ...args),
}

function initVideoUpload() {
  gUppy = _getUppy()
  gUppy.use(AwsS3Multipart, {
    limit: 2,
    // getChunkSize: (file) => 20,
    createMultipartUpload,
    prepareUploadPart,
    listParts,
    completeMultipartUpload,
    abortMultipartUpload,
  })
  return gUppy
}

function initUpload(bucketName, restrictions) {
  const uppy = _getUppy(restrictions)
  uppy.use(AwsS3, {
    timeout: 1000 * 60,
    getUploadParameters,
  })

  async function getUploadParameters(file) {
    const target = await httpService.get(
      `${ROUTE}/sign?fileKey=${file.name}&fileType=${file.type}&bucketName=${bucketName}`,
      JSON.stringify({
        filename: file.name,
      }),
    )
    return { method: 'PUT', url: target.signedURL }
  }
  return uppy
}

async function uploadFile(blob, name) {
  loggerService.info('[UploaderService] [uploadFile]', { name })
  gUppy.addFile({
    data: blob,
    name: name,
    type: blob.type,
  })
}

function handleNetworkError(fileId) {
  function handleOnReconnect() {
    store.commit('applicant/setWaitForNetwork', { waitForNetwork: false })
    gUppy.retryUpload(fileId)
    loggerService.info(`Retrying file upload after network reconnect, file ID: ${fileId}`)
    window.removeEventListener('online', handleOnReconnect)
  }
  window.addEventListener('online', handleOnReconnect)
}

function retryUpload(fileId) {
  gUppy.retryUpload(fileId)
}

function addEventListener(eventName, func) {
  gUppy.on(eventName, func)
}

function _getUppy(restrictions = {}) {
  return new Uppy({
    allowMultipleUploads: true,
    autoProceed: true,
    logger,
    restrictions,
  })
}

async function createMultipartUpload(file) {
  const fileKey = `${file.data.interviewData.interviewId}/${file.name}`
  try {
    const { uploadId } = await httpService.get(`${ROUTE}/start_multipart?fileKey=${fileKey}&fileType=${file.type}`)
    return { key: fileKey, uploadId }
  } catch (err) {
    loggerService.error('[uploaderService] Error when creating multipart upload', err)
    throw err
  }
}

function prepareUploadPart(file, { number, key, uploadId }) {
  try {
    return httpService.get(`${ROUTE}/sign_multipart?fileKey=${key}&uploadId=${uploadId}&partNum=${number}`)
  } catch (err) {
    loggerService.error('[uploaderService] Error when signing upload part url', err)
    throw err
  }
}
async function listParts(file, { uploadId, key }) {
  try {
    const { parts } = await httpService.post(`${ROUTE}/list_parts?fileKey=${key}&uploadId=${uploadId}`)
    return parts
  } catch (err) {
    loggerService.error('[uploaderService] Error when listing parts', err)
    throw err
  }
}

function completeMultipartUpload(file, { uploadId, key, parts }) {
  try {
    return httpService.post(`${ROUTE}/complete_multipart?uploadId=${uploadId}&fileKey=${key}`, parts)
  } catch (err) {
    loggerService.error('[uploaderService] Error when completing multipart upload', err)
    throw err
  }
}

function abortMultipartUpload(file, { uploadId, key }) {
  try {
    return httpService.get(`${ROUTE}/abort_multipart?uploadId=${uploadId}&fileKey=${key}`)
  } catch (err) {
    loggerService.error('[uploaderService] Error when aborting multipart upload', err)
    throw err
  }
}
