// THIS IS v0 FOR THIS COMPOSABLE, IT IS MENT TO BE UGLY SO WE CAN MERGE TO MASTER
// TODO: Redo this composable to be more readable and maintainable, consider overhauling the whole component structure that is using it
// core
import {computed, ref} from 'vue'
// lib
import {useStore} from 'vuex'
// services
import {loggerService} from '@/services/loggerService'
// data & misc
import config from '@/config'
import {videoErrorMap} from '@/services/errorService'

export function useVideo({emit, videoRef = null, videoRecorderRef = null}) {
  // Data
  // #unused
  let isPaused = false
  // #SHARED WITH CMP AKLOSHBFKJASDFBVJKASDCBH
  const isAudioReady = ref(false)
  const selectedError = ref(null)
  const isFaceReady = ref(false)
  // #public
  const isStreaming = ref(false)
  const isVideoReady = ref(false)
  const videoStream = ref(null)
  const videoDevices = ref(null)
  const audioDevices = ref(null)
  const selectedDevices = ref({
    video: {deviceId: localStorage.getItem('videoinput') || 'default'},
    audio: {deviceId: localStorage.getItem('audioinput') || 'default'},
  })
  const videoErrors = ref([])

  // #private
  let _isVideoRecording = false
  let _cameraPermission = null
  let _cameraPermissionState = null
  let _micPermission = null
  let _micPermissionState = null
  let _mediaRecorder = null
  let _chunks = []

  const store = useStore()

  // Computed
  // #public
  const elVideo = computed({
    get: () => {
      console.log(
        '🚀 ~ file: useVideo.js:49 ~ elVideo ~ videoRef?.value || videoRecorderRef?.value?.$refs?.video:',
        videoRef?.value || videoRecorderRef?.value?.$refs?.video,
      )

      return videoRef?.value || videoRecorderRef?.value?.$refs?.video
    },
    set: (val) => {
      console.log('🚀 ~ file: useVideo.js:55 ~ elVideo ~ val', val)

      // if (videoRef?.value) {
      //     videoRef.value = val
      // }

      // else if (videoRecorderRef?.value) {
      //     videoRecorderRef.value.$refs.video = val
      // }
    },
  })

  const browser = computed(() => store.getters['app/browser'])

  // #private
  const mimeType = computed(() => {
    return browser.value.name === 'ios' ||
      browser.value.name === 'crios' ||
      browser.value.name === 'fxios' ||
      browser.value.name === 'safari'
      ? 'video/mp4; codecs="avc1.424028, mp4a.40.2"'
      : 'video/webm'
  })

  // Methods
  // #public
  const stopMediaRecorder = () => {
    if (_mediaRecorder && _mediaRecorder.state !== 'inactive') {
      _mediaRecorder.stop()
      loggerService.info('[videoMixin] [stopMediaRecorder]')
    }
  }

  const checkNetwork = async () => {
    const imgSrc = `${config.baseUrl}/favicon.ico?t=${Date.now()}`
    try {
      const startTime = new Date().getTime()
      const res = await fetch(imgSrc)
      const endTime = new Date().getTime()
      const blob = await res.blob()
      const duration = (endTime - startTime) / 1000
      const bitsLoaded = blob.size * 8
      const speedBps = bitsLoaded / duration
      const speedKbps = speedBps / 1024
      const speedMbps = speedKbps / 1024
      // console.log(speedMbps + " Mbps")

      removeVideoError(videoErrorMap.NO_NETWORK)
      if (speedMbps < 0.06) {
        addVideoError(videoErrorMap.NETWORK_UNSTABLE)
      } else {
        removeVideoError(videoErrorMap.NETWORK_UNSTABLE)
      }
    } catch (err) {
      removeVideoError(videoErrorMap.NETWORK_UNSTABLE)
      addVideoError(videoErrorMap.NO_NETWORK)
    }
  }

  const addVideoError = (err) => {
    if (videoErrors.value.includes(err)) return
    videoErrors.value.push(err)
    loggerService.info('[videoMixin] [addVideoError] Video error added', {
      err,
    })
  }

  const onSelectDevice = (device) => {
    isAudioReady.value = false
    isVideoReady.value = false
    stopVideoStream()
    if (device.type === 'audioinput') selectedDevices.value.audio.deviceId = device.id
    else selectedDevices.value.video.deviceId = device.id
    initVideoMixin()
    loggerService.info('[videoMixin] [onSelectDevice]', {device})
  }

  const removeVideoError = (errorToRemove) => {
    if (videoErrors.value.some((err) => err.type === errorToRemove.type)) {
      videoErrors.value = videoErrors.value.filter((error) => error.type !== errorToRemove.type)
      loggerService.info('[videoMixin] [removeVideoError] Video error removed', {errorToRemove})
      if (selectedError.value?.type === errorToRemove.type) selectedError.value = null
    }
  }

  const stopVideoStream = () => {
    isStreaming.value = false
    if (!videoStream.value) return
    videoStream.value.getTracks().forEach((t) => t.stop())
    loggerService.info('[videoMixin] [stopVideoStream]')
  }

  const startVideoRecording = () => {
    try {
      if (!videoStream.value) return
      _prepareVideoRecorder()
      _mediaRecorder.start()
      loggerService.info('[videoMixin] [startVideoRecording]')
    } catch (e) {
      loggerService.error('[videoMixin] [startVideoRecording] Could not start video media recorder', e)
    }
  }

  const stopVideoRecording = (jobId, questId) => {
    if (!_isVideoRecording) return
    return new Promise((res) => {
      const createVideoBlob = () => {
        const blob = new Blob(_chunks, {type: mimeType})
        if (blob.size > 0) {
          blob.interviewData = {questId, interviewId: jobId}
          res(blob)
        }
        _chunks = []
        isPaused = false
        _mediaRecorder.onstop = null
        _isVideoRecording = false
      }
      if (_mediaRecorder.state !== 'inactive') {
        _mediaRecorder.addEventListener('stop', createVideoBlob, {
          once: true,
        })
        _mediaRecorder.stop()
      } else {
        createVideoBlob()
      }

      loggerService.info('[videoMixin] [stopVideoRecording]', {jobId}, {questId})
    })
  }

  const initPreconditions = async () => {
    _checkIfSupported() // Check for browser media (video & audio) support
    _addListeners() // Add event listeners to the mediaDevice & mediaRecorder
    // await loadDevices() // Load user connected media devices (audio & video)
    await _verifyPermissions() // Check user media permissions (microphone & camera) and handle permission chenges
  }

  const initVideoMixin = async () => {
    loggerService.info('[VideoMixin] [initVideoMixin]')
    if (videoErrors.value.length) videoErrors.value = []
    await _initVideoStream()
    _loadDevices()
    isVideoReady.value = true
    _setVideoPreview()
    // checkNetwork() // mixin refactor
  }

  const removeNetworkListener = () => {
    const connection = navigator.connection
    if (connection) {
      connection.removeEventListener('change', checkNetwork)
    }
    window.removeEventListener('offline', checkNetwork)
    window.removeEventListener('online', checkNetwork)
    loggerService.info('[videoMixin] [removeNetworkListener] Network listeners removed')
  }

  const addNetworkListener = () => {
    loggerService.info('[videoMixin] [addNetworkListener]')
    const connection = navigator.connection
    if (connection) {
      loggerService.info('[videoMixin] [addNetworkListener] Navigator.connection event listener added')
      connection.addEventListener('change', checkNetwork)
    } else {
      window.addEventListener('offline', checkNetwork)
      window.addEventListener('online', checkNetwork)
      loggerService.info('[videoMixin] [addNetworkListener] Offline/online event listener added')
    }
  }

  // #private

  const _checkIfSupported = () => {
    loggerService.info('[VideoMixin] [checkIfSupported]')
    if (navigator.mediaDevices?.getUserMedia && window.MediaRecorder) return
    loggerService.info("[VideoMixin] [checkIfSupported] Media Devices are not supported in applicant's browser")
    store.commit('applicant/setInterviewErr', {
      name: 'BROWSER_NOT_SUPPORTED',
    })
  }

  const _addListeners = () => {
    loggerService.info('[VideoMixin] [addListeners]')
    navigator.mediaDevices.ondevicechange = async () => {
      const connectedDevicesCount = audioDevices.value?.length + videoDevices.value?.length
      await _loadDevices()
      if (videoDevices.value.length + audioDevices.value.length !== connectedDevicesCount) {
        loggerService.info('[VideoMixin] [ondevicechange] Media devices chaneged')
        isStreaming.value = false
        const prevMediaRecorderState = _mediaRecorder?.state
        await initVideoMixin()
        if (prevMediaRecorderState === 'inactive') startVideoRecording()
      }
    }
    // Event listeners for the media recorder (start / resume / pause)
    if (_mediaRecorder) {
      _mediaRecorder.addEventListener('start', () => {
        _isVideoRecording = true
        isPaused = false
        emit('start')
      })

      _mediaRecorder.addEventListener('resume', () => {
        _isVideoRecording = true
        isPaused = false
      })

      _mediaRecorder.addEventListener('pause', () => {
        isPaused = true
      })

      // Collect the available data into chunks
      _mediaRecorder.addEventListener(
        'dataavailable',
        (e) => {
          if (e.data && e.data.size > 0) {
            _chunks.push(e.data)
          }
        },
        true,
      )
      loggerService.info('[VideoMixin] [addListeners] Media recorder event listeners added')
    }
  }

  const _loadDevices = async () => {
    loggerService.info('[VideoMixin] [loadDevices]')
    const devices = await navigator.mediaDevices.enumerateDevices()
    videoDevices.value = devices
      .filter((device) => device.kind === 'videoinput')
      .map((device) => ({id: device.deviceId, name: device.label}))
    audioDevices.value = devices
      .filter((device) => device.kind === 'audioinput')
      .map((device) => ({id: device.deviceId, name: device.label}))
    loggerService.info(
      '[VideoMixin] [loadDevices] Set audio/video devices',
      {videoDevices: videoDevices.value},
      {audioDevices: audioDevices.value},
    )
  }

  const _verifyPermissions = async () => {
    // Camera Permission
    loggerService.info('[VideoMixin] [verifyPermissions]')
    if (!navigator.permissions) {
      loggerService.info('[VideoMixin] [verifyPermissions] There is no navigator.permissions')
      return
    }
    try {
      const cameraPerm = await navigator.permissions.query({
        name: 'camera',
      })
      _cameraPermission = cameraPerm
      _cameraPermissionState = cameraPerm.state
      _cameraPermission.onchange = _handleCameraPermissionChange

      if (cameraPerm.state === 'prompt') {
        // Browser permission modal is open
      } else if (cameraPerm.state === 'denied') {
        // User has pre denied camera access
        loggerService.info('[VideoMixin] [verifyPermissions] Candidate has pre denied camera access', cameraPerm)
        addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
      }
    } catch (err) {
      loggerService.error('[VideoMixin] [verifyPermissions] Could not query permission for camera', err)
    }

    // Microphone Permission
    try {
      const micPerm = await navigator.permissions.query({
        name: 'microphone',
      })
      _micPermission = micPerm
      _micPermissionState = micPerm.state
      _micPermission.onchange = _handleMicPermissionChange

      if (micPerm.state === 'prompt') {
        // Browser permission modal is open
      } else if (micPerm.state === 'denied') {
        // User has pre denied microphone access
        loggerService.info('[VideoMixin] [verifyPermissions] Candidate has pre denied microphone access', micPerm)
        addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
      }
    } catch (err) {
      loggerService.error('[VideoMixin] [verifyPermissions] Could not query permission for microphone', err)
    }
  }

  const _handleCameraPermissionChange = async (e) => {
    if (e.type !== 'change') return
    loggerService.info('[VideoMixin] [handleCameraPermissionChange] Camera permissions has changed')
    removeVideoError(videoErrorMap.DENIED_CAM_ACCESS)

    const newState = e.target.state
    if (newState === 'denied') {
      loggerService.info('[VideoMixin] [handleCameraPermissionChange] Applicant has denied camera access', e.target)
      isStreaming.value = false
      addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
    } else if (newState === 'granted') {
      if (_cameraPermissionState === 'denied' && _micPermissionState === 'granted') {
        loggerService.info('[VideoMixin] [handleCameraPermissionChange] Applicant has granted camera access', e.target)
        await initVideoMixin()
        if (_isVideoRecording) startVideoRecording()
      }
    } else if (newState === 'prompt') await navigator.mediaDevices.getUserMedia(selectedDevices.value)
    _cameraPermissionState = newState
  }

  const _handleMicPermissionChange = async (e) => {
    if (e.type !== 'change') return
    loggerService.info('[VideoMixin] [handleMicPermissionChange] Microphone permissions has changed')
    removeVideoError(videoErrorMap.DENIED_MIC_ACCESS)

    const newState = e.target.state
    if (newState === 'denied') {
      loggerService.info('[VideoMixin] [handleMicPermissionChange] Applicant has denied microphone access', e.target)
      isStreaming.value = false
      addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
    } else if (newState === 'granted') {
      if (_micPermissionState === 'denied' && _cameraPermissionState === 'granted') {
        loggerService.info('[VideoMixin] [handleMicPermissionChange] Applicant has granted microphone access', e.target)
        await initVideoMixin()
        if (_isVideoRecording) startVideoRecording()
      }
    } else if (newState === 'prompt') await navigator.mediaDevices.getUserMedia(selectedDevices.value)
    _micPermissionState = newState
  }

  const _initVideoStream = async () => {
    loggerService.info('[videoMixin] [initVideoStream]')
    if (isStreaming.value) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia(selectedDevices.value)
      isStreaming.value = true
      videoStream.value = stream
      //   console.log('🚀 ~ file: useVideo.js:370 ~ const_initVideoStream= ~ videoStream.value:', videoStream.value)
      const browserName = store.getters['app/browser'].name
      if (browserName === 'safari') {
        stream.getTracks().forEach(
          (track) =>
            (track.onended = () => {
              isStreaming.value = false
              _initVideoStream()
            }),
        )
      }
    } catch (err) {
      loggerService.error('[videoMixin] [initVideoStream] Failed to create new stream')
      await _handleInitVideoErr(err)
    }
  }

  const _handleInitVideoErr = async (err) => {
    loggerService.error('[videoMixin] [handleInitVideoErr] error code', err.code)
    loggerService.error('[videoMixin] [handleInitVideoErr] error name', err.name)
    loggerService.error('[videoMixin] [handleInitVideoErr] error message', err.message)
    loggerService.error('[videoMixin] [handleInitVideoErr] _micPermissionState', _micPermissionState)
    loggerService.error('[videoMixin] [handleInitVideoErr] _cameraPermissionState', _cameraPermissionState)

    switch (err.code) {
      case 0: {
        if (err.name === 'NotReadableError') {
          loggerService.error('[videoMixin] [handleInitVideoErr] Could not start video source', {err})
          addVideoError(videoErrorMap.CAMERA_BUSY)
        } else if (err.name === 'NotAllowedError') {
          if (err.message === 'Permission denied by system') {
            loggerService.error('[videoMixin] [handleInitVideoErr] Permission denied by system', {err})
            addVideoError(videoErrorMap.MEDIA_DENIED_BY_SYSTEM)
          } else {
            loggerService.error('[videoMixin] [handleInitVideoErr] Permission denied', {err})

            if (_micPermissionState !== 'granted') addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
            if (_cameraPermissionState !== 'granted') addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
          }
        }
        break
      }
      case 8: {
        try {
          await navigator.mediaDevices.getUserMedia({
            video: selectedDevices.value.video,
          })
        } catch (err) {
          if (isFaceReady.value) isFaceReady.value = false
          loggerService.error('[videoMixin] [handleInitVideoErr] Camera not found', {err})
          addVideoError(videoErrorMap.CAMERA_NOT_FOUND)
        }
        try {
          await navigator.mediaDevices.getUserMedia({
            audio: selectedDevices.value.audio,
          })
        } catch (err) {
          if (isAudioReady.value) isAudioReady.value = false
          loggerService.error('[videoMixin] [handleInitVideoErr] Microphone not found', {err})
          addVideoError(videoErrorMap.MIC_NOT_FOUND)
        }
        break
      }
      case 20: {
        if (err.name === 'AbortError') {
          loggerService.error('[videoMixin] [handleInitVideoErr] Camera busy', {err})
          addVideoError(videoErrorMap.CAMERA_BUSY)
        }
        break
      }
    }
  }

  const _setVideoPreview = () => {
    if (!elVideo.value) return
    if (!elVideo.value) return
    elVideo.value.srcObject = videoStream.value
    elVideo.value.play()
    elVideo.value.muted = true
    loggerService.info('[videoMixin] [setVideoPreview]')
  }

  const _prepareVideoRecorder = () => {
    _mediaRecorder = new MediaRecorder(videoStream.value, {
      mimeType: mimeType.value,
    })
    window.mediaRec = _mediaRecorder
    _mediaRecorder.ignoreMutedMedia = true
    _addListeners()
    loggerService.info('[videoMixin] [prepareVideoRecorder]')
  }

  return {
    // SHARED WITH CMP
    isAudioReady,
    selectedError,
    isFaceReady,
    // DATA
    isStreaming,
    isVideoReady,
    videoStream,
    videoDevices,
    audioDevices,
    selectedDevices,
    videoErrors,
    // COMPUTED
    elVideo,
    browser,
    // METHODS
    initVideoMixin,
    stopVideoStream,
    startVideoRecording,
    stopVideoRecording,
    onSelectDevice,
    addVideoError,
    removeVideoError,
    addNetworkListener,
    removeNetworkListener,
    stopMediaRecorder,
    initPreconditions,
    checkNetwork,
  }
}

// Keeping this here for future refrence
// import config from '@/config'
// import {videoErrorMap} from '@/services/errorService'
// import {loggerService} from '@/services/loggerService'

// export default {
//   // Private vars ->
//   _cameraPermission: null,
//   _cameraPermissionState: null,
//   _micPermission: null,
//   _micPermissionState: null,
//   _mediaRecorder: null,

//   data() {
//     return {
//       videoStream: null,
//       isStreaming: false,
//       isVideoReady: false,
//       isVideoRecording: false,
//       videoDevices: null,
//       audioDevices: null,
//       selectedDevices: {
//         video: {deviceId: localStorage.getItem('videoinput') || 'default'},
//         audio: {deviceId: localStorage.getItem('audioinput') || 'default'},
//       },
//       chunks: [],
//       videoErrors: [],
//     }
//   },

//   computed: {
//     elVideo() {
//       return this.$refs.video || this.$refs.vidRecorder.$refs.video
//     },

//     browser() {
//       return this.$store.getters['app/browser']
//     },

//     mimeType() {
//       return this.browser.name === 'ios' ||
//         this.browser.name === 'crios' ||
//         this.browser.name === 'fxios' ||
//         this.browser.name === 'safari'
//         ? 'video/mp4; codecs="avc1.424028, mp4a.40.2"'
//         : 'video/webm'
//     },
//   },

//   methods: {
//     // public 1
//     stopMediaRecorder() {
//       if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
//         this._mediaRecorder.stop()
//         loggerService.info('[videoMixin] [stopMediaRecorder]')
//       }
//     },
//     // public 2
//     async checkNetwork() {
//       const imgSrc = `${config.baseUrl}/favicon.ico?t=${Date.now()}`
//       try {
//         const startTime = new Date().getTime()
//         const res = await fetch(imgSrc)
//         const endTime = new Date().getTime()
//         const blob = await res.blob()
//         const duration = (endTime - startTime) / 1000
//         const bitsLoaded = blob.size * 8
//         const speedBps = bitsLoaded / duration
//         const speedKbps = speedBps / 1024
//         const speedMbps = speedKbps / 1024
//         // console.log(speedMbps + " Mbps")

//         this.removeVideoError(videoErrorMap.NO_NETWORK)
//         if (speedMbps < 0.06) {
//           this.addVideoError(videoErrorMap.NETWORK_UNSTABLE)
//         } else {
//           this.removeVideoError(videoErrorMap.NETWORK_UNSTABLE)
//         }
//       } catch (err) {
//         this.removeVideoError(videoErrorMap.NETWORK_UNSTABLE)
//         this.addVideoError(videoErrorMap.NO_NETWORK)
//       }
//     },
//     // public 2
//     addVideoError(err) {
//       if (this.videoErrors.includes(err)) return
//       this.videoErrors.push(err)
//       loggerService.info('[videoMixin] [addVideoError] Video error added', {
//         err,
//       })
//     },
//     // public 2
//     onSelectDevice(device) {
//       this.isAudioReady = false
//       this.isVideoReady = false
//       this.stopVideoStream()
//       if (device.type === 'audioinput') this.selectedDevices.audio.deviceId = device.id
//       else this.selectedDevices.video.deviceId = device.id
//       this.initVideoMixin()
//       loggerService.info('[videoMixin] [onSelectDevice]', {device})
//     },
//     // public 1,2
//     removeVideoError(errorToRemove) {
//       if (this.videoErrors.some((err) => err.type === errorToRemove.type)) {
//         this.videoErrors = this.videoErrors.filter((error) => error.type !== errorToRemove.type)
//         loggerService.info('[videoMixin] [removeVideoError] Video error removed', {errorToRemove})
//         if (this.selectedError?.type === errorToRemove.type) this.selectedError = null
//       }
//     },
//     // public 1,2
//     stopVideoStream() {
//       this.isStreaming = false
//       if (!this.videoStream) return
//       this.videoStream.getTracks().forEach((t) => t.stop())
//       loggerService.info('[videoMixin] [stopVideoStream]')
//     },
//     // public 1,2
//     startVideoRecording() {
//       try {
//         if (!this.videoStream) return
//         this.prepareVideoRecorder()
//         this._mediaRecorder.start()
//         loggerService.info('[videoMixin] [startVideoRecording]')
//       } catch (e) {
//         loggerService.error('[videoMixin] [startVideoRecording] Could not start video media recorder', e)
//       }
//     },
//     // public 1,2
//     stopVideoRecording(jobId, questId) {
//       if (!this.isVideoRecording) return
//       return new Promise((res) => {
//         const createVideoBlob = () => {
//           const blob = new Blob(this.chunks, {type: this.mimeType})
//           if (blob.size > 0) {
//             blob.interviewData = {questId, interviewId: jobId}
//             res(blob)
//           }
//           this.chunks = []
//           this.isPaused = false
//           this._mediaRecorder.onstop = null
//           this.isVideoRecording = false
//         }
//         if (this._mediaRecorder.state !== 'inactive') {
//           this._mediaRecorder.addEventListener('stop', createVideoBlob, {
//             once: true,
//           })
//           this._mediaRecorder.stop()
//         } else {
//           createVideoBlob()
//         }

//         loggerService.info('[videoMixin] [stopVideoRecording]', {jobId}, {questId})
//       })
//     },
//     // public 1,2
//     async initPreconditions() {
//       this.checkIfSupported() // Check for browser media (video & audio) support
//       this.addListeners() // Add event listeners to the mediaDevice & mediaRecorder
//       // await this.loadDevices() // Load user connected media devices (audio & video)
//       await this.verifyPermissions() // Check user media permissions (microphone & camera) and handle permission chenges
//     },
//     // public 1,2
//     async initVideoMixin() {
//       loggerService.info('[VideoMixin] [initVideoMixin]')
//       if (this.videoErrors.length) this.videoErrors = []
//       await this.initVideoStream()
//       this.loadDevices()
//       this.isVideoReady = true
//       this.setVideoPreview()
//       // this.checkNetwork() // mixin refactor
//     },
//     // public 2,3
//     removeNetworkListener() {
//       const connection = navigator.connection
//       if (connection) {
//         connection.removeEventListener('change', this.checkNetwork)
//       }
//       window.removeEventListener('offline', this.checkNetwork)
//       window.removeEventListener('online', this.checkNetwork)
//       loggerService.info('[videoMixin] [removeNetworkListener] Network listeners removed')
//     },
//     // public 1,2,3
//     addNetworkListener() {
//       loggerService.info('[videoMixin] [addNetworkListener]')
//       const connection = navigator.connection
//       if (connection) {
//         loggerService.info('[videoMixin] [addNetworkListener] Navigator.connection event listener added')
//         connection.addEventListener('change', this.checkNetwork)
//       } else {
//         window.addEventListener('offline', this.checkNetwork)
//         window.addEventListener('online', this.checkNetwork)
//         loggerService.info('[videoMixin] [addNetworkListener] Offline/online event listener added')
//       }
//     },
//     // private
//     getElVideo() {
//       return this.$refs.video || this.$refs.vidRecorder?.$refs.video
//     },
//     // private
//     checkIfSupported() {
//       loggerService.info('[VideoMixin] [checkIfSupported]')
//       if (navigator.mediaDevices?.getUserMedia && window.MediaRecorder) return
//       loggerService.info("[VideoMixin] [checkIfSupported] Media Devices are not supported in applicant's browser")
//       this.$store.commit('applicant/setInterviewErr', {
//         name: 'BROWSER_NOT_SUPPORTED',
//       })
//     },
//     // private
//     addListeners() {
//       loggerService.info('[VideoMixin] [addListeners]')
//       navigator.mediaDevices.ondevicechange = async () => {
//         const connectedDevicesCount = this.audioDevices?.length + this.videoDevices?.length
//         await this.loadDevices()
//         if (this.videoDevices.length + this.audioDevices.length !== connectedDevicesCount) {
//           loggerService.info('[VideoMixin] [ondevicechange] Media devices chaneged')
//           this.isStreaming = false
//           const prevMediaRecorderState = this._mediaRecorder?.state
//           await this.initVideoMixin()
//           if (prevMediaRecorderState === 'inactive') this.startVideoRecording()
//         }
//       }
//       // Event listeners for the media recorder (start / resume / pause)
//       if (this._mediaRecorder) {
//         this._mediaRecorder.addEventListener('start', () => {
//           this.isVideoRecording = true
//           this.isPaused = false
//           this.$emit('start')
//         })

//         this._mediaRecorder.addEventListener('resume', () => {
//           this.isVideoRecording = true
//           this.isPaused = false
//         })

//         this._mediaRecorder.addEventListener('pause', () => {
//           this.isPaused = true
//         })

//         // Collect the available data into chunks
//         this._mediaRecorder.addEventListener(
//           'dataavailable',
//           (e) => {
//             if (e.data && e.data.size > 0) {
//               this.chunks.push(e.data)
//             }
//           },
//           true,
//         )
//         loggerService.info('[VideoMixin] [addListeners] Media recorder event listeners added')
//       }
//     },
//     // private
//     async loadDevices() {
//       loggerService.info('[VideoMixin] [loadDevices]')
//       const devices = await navigator.mediaDevices.enumerateDevices()
//       this.videoDevices = devices
//         .filter((device) => device.kind === 'videoinput')
//         .map((device) => ({id: device.deviceId, name: device.label}))
//       this.audioDevices = devices
//         .filter((device) => device.kind === 'audioinput')
//         .map((device) => ({id: device.deviceId, name: device.label}))
//       loggerService.info(
//         '[VideoMixin] [loadDevices] Set audio/video devices',
//         {videoDevices: this.videoDevices},
//         {audioDevices: this.audioDevices},
//       )
//     },
//     // private
//     async verifyPermissions() {
//       // Camera Permission
//       loggerService.info('[VideoMixin] [verifyPermissions]')
//       if (!navigator.permissions) {
//         loggerService.info('[VideoMixin] [verifyPermissions] There is no navigator.permissions')
//         return
//       }
//       try {
//         const cameraPerm = await navigator.permissions.query({
//           name: 'camera',
//         })
//         this._cameraPermission = cameraPerm
//         this._cameraPermissionState = cameraPerm.state
//         this._cameraPermission.onchange = this.handleCameraPermissionChange

//         if (cameraPerm.state === 'prompt') {
//           // Browser permission modal is open
//         } else if (cameraPerm.state === 'denied') {
//           // User has pre denied camera access
//           loggerService.info('[VideoMixin] [verifyPermissions] Candidate has pre denied camera access', cameraPerm)
//           this.addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
//         }
//       } catch (err) {
//         loggerService.error('[VideoMixin] [verifyPermissions] Could not query permission for camera', err)
//       }

//       // Microphone Permission
//       try {
//         const micPerm = await navigator.permissions.query({
//           name: 'microphone',
//         })
//         this._micPermission = micPerm
//         this._micPermissionState = micPerm.state
//         this._micPermission.onchange = this.handleMicPermissionChange

//         if (micPerm.state === 'prompt') {
//           // Browser permission modal is open
//         } else if (micPerm.state === 'denied') {
//           // User has pre denied microphone access
//           loggerService.info('[VideoMixin] [verifyPermissions] Candidate has pre denied microphone access', micPerm)
//           this.addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
//         }
//       } catch (err) {
//         loggerService.error('[VideoMixin] [verifyPermissions] Could not query permission for microphone', err)
//       }
//     },
//     // private
//     async handleCameraPermissionChange(e) {
//       if (e.type !== 'change') return
//       loggerService.info('[VideoMixin] [handleCameraPermissionChange] Camera permissions has changed')
//       this.removeVideoError(videoErrorMap.DENIED_CAM_ACCESS)

//       const newState = e.target.state
//       if (newState === 'denied') {
//         loggerService.info('[VideoMixin] [handleCameraPermissionChange] Applicant has denied camera access', e.target)
//         this.isStreaming = false
//         this.addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
//       } else if (newState === 'granted') {
//         if (this._cameraPermissionState === 'denied' && this._micPermissionState === 'granted') {
//           loggerService.info(
//             '[VideoMixin] [handleCameraPermissionChange] Applicant has granted camera access',
//             e.target,
//           )
//           await this.initVideoMixin()
//           if (this.isVideoRecording) this.startVideoRecording()
//         }
//       } else if (newState === 'prompt') await navigator.mediaDevices.getUserMedia(this.selectedDevices)
//       this._cameraPermissionState = newState
//     },
//     // private
//     async handleMicPermissionChange(e) {
//       if (e.type !== 'change') return
//       loggerService.info('[VideoMixin] [handleMicPermissionChange] Microphone permissions has changed')
//       this.removeVideoError(videoErrorMap.DENIED_MIC_ACCESS)

//       const newState = e.target.state
//       if (newState === 'denied') {
//         loggerService.info('[VideoMixin] [handleMicPermissionChange] Applicant has denied microphone access', e.target)
//         this.isStreaming = false
//         this.addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
//       } else if (newState === 'granted') {
//         if (this._micPermissionState === 'denied' && this._cameraPermissionState === 'granted') {
//           loggerService.info(
//             '[VideoMixin] [handleMicPermissionChange] Applicant has granted microphone access',
//             e.target,
//           )
//           await this.initVideoMixin()
//           if (this.isVideoRecording) this.startVideoRecording()
//         }
//       } else if (newState === 'prompt') await navigator.mediaDevices.getUserMedia(this.selectedDevices)
//       this._micPermissionState = newState
//     },
//     // private
//     async initVideoStream() {
//       loggerService.info('[videoMixin] [initVideoStream]')
//       if (this.isStreaming) return
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia(this.selectedDevices)
//         this.isStreaming = true
//         this.videoStream = stream

//         const browserName = this.$store.getters['app/browser'].name
//         if (browserName === 'safari') {
//           stream.getTracks().forEach(
//             (track) =>
//               (track.onended = () => {
//                 this.isStreaming = false
//                 this.initVideoStream()
//               }),
//           )
//         }
//       } catch (err) {
//         loggerService.error('[videoMixin] [initVideoStream] Failed to create new stream')
//         await this.handleInitVideoErr(err)
//       }
//     },
//     // private
//     async handleInitVideoErr(err) {
//       loggerService.error('[videoMixin] [handleInitVideoErr] error code', err.code)
//       loggerService.error('[videoMixin] [handleInitVideoErr] error name', err.name)
//       loggerService.error('[videoMixin] [handleInitVideoErr] error message', err.message)
//       loggerService.error('[videoMixin] [handleInitVideoErr] _micPermissionState', this._micPermissionState)
//       loggerService.error('[videoMixin] [handleInitVideoErr] _cameraPermissionState', this._cameraPermissionState)

//       switch (err.code) {
//         case 0: {
//           if (err.name === 'NotReadableError') {
//             loggerService.error('[videoMixin] [handleInitVideoErr] Could not start video source', {err})
//             this.addVideoError(videoErrorMap.CAMERA_BUSY)
//           } else if (err.name === 'NotAllowedError') {
//             if (err.message === 'Permission denied by system') {
//               loggerService.error('[videoMixin] [handleInitVideoErr] Permission denied by system', {err})
//               this.addVideoError(videoErrorMap.MEDIA_DENIED_BY_SYSTEM)
//             } else {
//               loggerService.error('[videoMixin] [handleInitVideoErr] Permission denied', {err})

//               if (this._micPermissionState !== 'granted') this.addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
//               if (this._cameraPermissionState !== 'granted') this.addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
//             }
//           }
//           break
//         }
//         case 8: {
//           try {
//             await navigator.mediaDevices.getUserMedia({
//               video: this.selectedDevices.video,
//             })
//           } catch (err) {
//             if (this.isFaceReady) this.isFaceReady = false
//             loggerService.error('[videoMixin] [handleInitVideoErr] Camera not found', {err})
//             this.addVideoError(videoErrorMap.CAMERA_NOT_FOUND)
//           }
//           try {
//             await navigator.mediaDevices.getUserMedia({
//               audio: this.selectedDevices.audio,
//             })
//           } catch (err) {
//             if (this.isAudioReady) this.isAudioReady = false
//             loggerService.error('[videoMixin] [handleInitVideoErr] Microphone not found', {err})
//             this.addVideoError(videoErrorMap.MIC_NOT_FOUND)
//           }
//           break
//         }
//         case 20: {
//           if (err.name === 'AbortError') {
//             loggerService.error('[videoMixin] [handleInitVideoErr] Camera busy', {err})
//             this.addVideoError(videoErrorMap.CAMERA_BUSY)
//           }
//           break
//         }
//       }
//     },
//     // private
//     setVideoPreview() {
//       if (!this.elVideo) return
//       const elVideo = this.getElVideo()
//       if (!elVideo) return
//       elVideo.srcObject = this.videoStream
//       elVideo.play()
//       elVideo.muted = true
//       loggerService.info('[videoMixin] [setVideoPreview]')
//     },
//     // private
//     prepareVideoRecorder() {
//       this._mediaRecorder = new MediaRecorder(this.videoStream, {
//         mimeType: this.mimeType,
//       })
//       window.mediaRec = this._mediaRecorder
//       this._mediaRecorder.ignoreMutedMedia = true
//       this.addListeners()
//       loggerService.info('[videoMixin] [prepareVideoRecorder]')
//     },
//   },
// }
