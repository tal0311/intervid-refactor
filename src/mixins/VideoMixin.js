import config from '@/config'
import { videoErrorMap } from '@/services/errorService'
import { loggerService } from '@/services/loggerService'

export default {
  // Private vars ->
  _cameraPermission: null,
  _cameraPermissionState: null,
  _micPermission: null,
  _micPermissionState: null,
  _mediaRecorder: null,

  data() {
    return {
      videoStream: null,
      isStreaming: false,
      isVideoReady: false,
      isVideoRecording: false,
      videoDevices: null,
      audioDevices: null,
      selectedDevices: {
        video: { deviceId: localStorage.getItem('videoinput') || 'default' },
        audio: { deviceId: localStorage.getItem('audioinput') || 'default' },
      },
      chunks: [],
      videoErrors: [],
    }
  },

  computed: {
    elVideo() {
      return this.$refs.video || this.$refs.vidRecorder.$refs.video
    },

    browser() {
      return this.$store.getters['app/browser']
    },

    mimeType() {
      return this.browser.name === 'ios' || this.browser.name === 'crios' || this.browser.name === 'fxios' || this.browser.name === 'safari'
        ? 'video/mp4; codecs="avc1.424028, mp4a.40.2"'
        : 'video/webm'
    }
  },

  methods: {
    async initPreconditions() {
      this.checkIfSupported() // Check for browser media (video & audio) support
      this.addListeners() // Add event listeners to the mediaDevice & mediaRecorder
      // await this.loadDevices() // Load user connected media devices (audio & video)
      await this.verifyPermissions() // Check user media permissions (microphone & camera) and handle permission chenges
    },

    getElVideo() {
      return this.$refs.video || this.$refs.vidRecorder?.$refs.video
    },

    checkIfSupported() {
      loggerService.info('[VideoMixin] [checkIfSupported]')
      if (navigator.mediaDevices?.getUserMedia && window.MediaRecorder) return
      loggerService.info("[VideoMixin] [checkIfSupported] Media Devices are not supported in applicant's browser")
      this.$store.commit('applicant/setInterviewErr', { name: 'BROWSER_NOT_SUPPORTED' })
    },

    addListeners() {
      loggerService.info('[VideoMixin] [addListeners]')
      navigator.mediaDevices.ondevicechange = async (ev) => {
        const connectedDevicesCount = this.audioDevices?.length + this.videoDevices?.length
        await this.loadDevices()
        if (this.videoDevices.length + this.audioDevices.length !== connectedDevicesCount) {
          loggerService.info('[VideoMixin] [ondevicechange] Media devices chaneged')
          this.isStreaming = false
          const prevMediaRecorderState = this._mediaRecorder?.state
          await this.initVideoMixin()
          if (prevMediaRecorderState === 'inactive') this.startVideoRecording()
        }
      }
      // Event listeners for the media recorder (start / resume / pause)
      if (this._mediaRecorder) {
        this._mediaRecorder.addEventListener('start', () => {
          this.isVideoRecording = true
          this.isPaused = false
          this.$emit('start')
        })

        this._mediaRecorder.addEventListener('resume', () => {
          this.isVideoRecording = true
          this.isPaused = false
        })

        this._mediaRecorder.addEventListener('pause', () => {
          this.isPaused = true
        })

        // Collect the available data into chunks
        this._mediaRecorder.addEventListener(
          'dataavailable',
          (e) => {
            if (e.data && e.data.size > 0) {
              this.chunks.push(e.data)
            }
          },
          true,
        )
        loggerService.info('[VideoMixin] [addListeners] Media recorder event listeners added')
      }
    },

    async loadDevices() {
      loggerService.info('[VideoMixin] [loadDevices]')
      const devices = await navigator.mediaDevices.enumerateDevices()
      this.videoDevices = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({ id: device.deviceId, name: device.label }))
      this.audioDevices = devices
        .filter((device) => device.kind === 'audioinput')
        .map((device) => ({ id: device.deviceId, name: device.label }))
      loggerService.info(
        '[VideoMixin] [loadDevices] Set audio/video devices',
        { videoDevices: this.videoDevices },
        { audioDevices: this.audioDevices },
      )
    },

    async verifyPermissions() {
      // Camera Permission
      loggerService.info('[VideoMixin] [verifyPermissions]')
      if (!navigator.permissions) {
        loggerService.info('[VideoMixin] [verifyPermissions] There is no navigator.permissions')
        return
      }
      try {
        const cameraPerm = await navigator.permissions.query({ name: 'camera' })
        this._cameraPermission = cameraPerm
        this._cameraPermissionState = cameraPerm.state
        this._cameraPermission.onchange = this.handleCameraPermissionChange

        if (cameraPerm.state === 'prompt') {
          // Browser permission modal is open
        } else if (cameraPerm.state === 'denied') {
          // User has pre denied camera access
          loggerService.info('[VideoMixin] [verifyPermissions] Candidate has pre denied camera access', cameraPerm)
          this.addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
        }
      } catch (err) {
        loggerService.error('[VideoMixin] [verifyPermissions] Could not query permission for camera', err)
      }

      // Microphone Permission
      try {
        const micPerm = await navigator.permissions.query({ name: 'microphone' })
        this._micPermission = micPerm
        this._micPermissionState = micPerm.state
        this._micPermission.onchange = this.handleMicPermissionChange

        if (micPerm.state === 'prompt') {
          // Browser permission modal is open
        } else if (micPerm.state === 'denied') {
          // User has pre denied microphone access
          loggerService.info('[VideoMixin] [verifyPermissions] Candidate has pre denied microphone access', micPerm)
          this.addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
        }
      } catch (err) {
        loggerService.error('[VideoMixin] [verifyPermissions] Could not query permission for microphone', err)
      }
    },

    async handleCameraPermissionChange(e) {
      if (e.type !== 'change') return
      loggerService.info('[VideoMixin] [handleCameraPermissionChange] Camera permissions has changed')
      this.removeVideoError(videoErrorMap.DENIED_CAM_ACCESS)

      const newState = e.target.state
      if (newState === 'denied') {
        loggerService.info('[VideoMixin] [handleCameraPermissionChange] Applicant has denied camera access', e.target)
        this.isStreaming = false
        this.addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
      } else if (newState === 'granted') {
        if (this._cameraPermissionState === 'denied' && this._micPermissionState === 'granted') {
          loggerService.info(
            '[VideoMixin] [handleCameraPermissionChange] Applicant has granted camera access',
            e.target,
          )
          await this.initVideoMixin()
          if (this.isVideoRecording) this.startVideoRecording()
        }
      } else if (newState === 'prompt') await navigator.mediaDevices.getUserMedia(this.selectedDevices)
      this._cameraPermissionState = newState
    },

    async handleMicPermissionChange(e) {
      if (e.type !== 'change') return
      loggerService.info('[VideoMixin] [handleMicPermissionChange] Microphone permissions has changed')
      this.removeVideoError(videoErrorMap.DENIED_MIC_ACCESS)

      const newState = e.target.state
      if (newState === 'denied') {
        loggerService.info('[VideoMixin] [handleMicPermissionChange] Applicant has denied microphone access', e.target)
        this.isStreaming = false
        this.addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
      } else if (newState === 'granted') {
        if (this._micPermissionState === 'denied' && this._cameraPermissionState === 'granted') {
          loggerService.info(
            '[VideoMixin] [handleMicPermissionChange] Applicant has granted microphone access',
            e.target,
          )
          await this.initVideoMixin()
          if (this.isVideoRecording) this.startVideoRecording()
        }
      } else if (newState === 'prompt') await navigator.mediaDevices.getUserMedia(this.selectedDevices)
      this._micPermissionState = newState
    },

    async initVideoMixin() {
      loggerService.info('[VideoMixin] [initVideoMixin]')
      if (this.videoErrors.length) this.videoErrors = []
      await this.initVideoStream()
      this.loadDevices()
      this.isVideoReady = true
      this.setVideoPreview()
      // this.checkNetwork() // mixin refactor
    },

    addNetworkListener() {
      loggerService.info('[videoMixin] [addNetworkListener]')
      const connection = navigator.connection
      if (connection) {
        loggerService.info('[videoMixin] [addNetworkListener] Navigator.connection event listener added')
        connection.addEventListener('change', this.checkNetwork)
      } else {
        window.addEventListener('offline', this.checkNetwork)
        window.addEventListener('online', this.checkNetwork)
        loggerService.info('[videoMixin] [addNetworkListener] Offline/online event listener added')
      }
    },

    removeNetworkListener() {
      const connection = navigator.connection
      if (connection) {
        connection.removeEventListener('change', this.checkNetwork)
      }
      window.removeEventListener('offline', this.checkNetwork)
      window.removeEventListener('online', this.checkNetwork)
      loggerService.info('[videoMixin] [removeNetworkListener] Network listeners removed')
    },

    async checkNetwork(e) {
      const imgSrc = `${config.baseUrl}/favicon.ico?t=${Date.now()}`
      try {
        const startTime = (new Date()).getTime();
        const res = await fetch(imgSrc)
        const endTime = (new Date()).getTime();
        const blob = await res.blob()
        const duration = (endTime - startTime) / 1000
        const bitsLoaded = blob.size * 8
        const speedBps = bitsLoaded / duration
        const speedKbps = speedBps / 1024
        const speedMbps = speedKbps / 1024
        // console.log(speedMbps + " Mbps")

        this.removeVideoError(videoErrorMap.NO_NETWORK)
        if (speedMbps < 0.06) {
          this.addVideoError(videoErrorMap.NETWORK_UNSTABLE)
        } else {
          this.removeVideoError(videoErrorMap.NETWORK_UNSTABLE)
        }
      } catch (err) {
        this.removeVideoError(videoErrorMap.NETWORK_UNSTABLE)
        this.addVideoError(videoErrorMap.NO_NETWORK)
      }
    },

    async initVideoStream() {
      loggerService.info('[videoMixin] [initVideoStream]')
      if (this.isStreaming) return
      try {
        const stream = await navigator.mediaDevices.getUserMedia(this.selectedDevices)
        this.isStreaming = true
        this.videoStream = stream

        const browserName = this.$store.getters['app/browser'].name
        if (browserName === 'safari') {
          stream.getTracks().forEach(
            (track) =>
            (track.onended = () => {
              this.isStreaming = false
              this.initVideoStream()
            }),
          )
        }
      } catch (err) {
        loggerService.error('[videoMixin] [initVideoStream] Failed to create new stream')
        await this.handleInitVideoErr(err)
      }
    },

    async handleInitVideoErr(err) {
      loggerService.error('[videoMixin] [handleInitVideoErr] error code', err.code)
      loggerService.error('[videoMixin] [handleInitVideoErr] error name', err.name)
      loggerService.error('[videoMixin] [handleInitVideoErr] error message', err.message)
      loggerService.error('[videoMixin] [handleInitVideoErr] _micPermissionState', this._micPermissionState)
      loggerService.error('[videoMixin] [handleInitVideoErr] _cameraPermissionState', this._cameraPermissionState)

      switch (err.code) {
        case 0: {
          if (err.name === 'NotReadableError') {
            loggerService.error('[videoMixin] [handleInitVideoErr] Could not start video source', { err })
            this.addVideoError(videoErrorMap.CAMERA_BUSY)
          } else if (err.name === 'NotAllowedError') {
            if (err.message === 'Permission denied by system') {
              loggerService.error('[videoMixin] [handleInitVideoErr] Permission denied by system', { err })
              this.addVideoError(videoErrorMap.MEDIA_DENIED_BY_SYSTEM)
            } else {
              loggerService.error('[videoMixin] [handleInitVideoErr] Permission denied', { err })

              if (this._micPermissionState !== 'granted') this.addVideoError(videoErrorMap.DENIED_MIC_ACCESS)
              if (this._cameraPermissionState !== 'granted') this.addVideoError(videoErrorMap.DENIED_CAM_ACCESS)
            }
          }
          break
        }
        case 8: {
          try {
            await navigator.mediaDevices.getUserMedia({ video: this.selectedDevices.video })
          } catch (err) {
            if (this.isFaceReady) this.isFaceReady = false
            loggerService.error('[videoMixin] [handleInitVideoErr] Camera not found', { err })
            this.addVideoError(videoErrorMap.CAMERA_NOT_FOUND)
          }
          try {
            await navigator.mediaDevices.getUserMedia({ audio: this.selectedDevices.audio })
          } catch (err) {
            if (this.isAudioReady) this.isAudioReady = false
            loggerService.error('[videoMixin] [handleInitVideoErr] Microphone not found', { err })
            this.addVideoError(videoErrorMap.MIC_NOT_FOUND)
          }
          break
        }
        case 20: {
          if (err.name === 'AbortError') {
            loggerService.error('[videoMixin] [handleInitVideoErr] Camera busy', { err })
            this.addVideoError(videoErrorMap.CAMERA_BUSY)
          }
          break
        }
      }
    },

    addVideoError(err) {
      if (this.videoErrors.includes(err)) return
      this.videoErrors.push(err)
      loggerService.info('[videoMixin] [addVideoError] Video error added', { err })
    },

    removeVideoError(errorToRemove) {
      if (this.videoErrors.some((err) => err.type === errorToRemove.type)) {
        this.videoErrors = this.videoErrors.filter((error) => error.type !== errorToRemove.type)
        loggerService.info('[videoMixin] [removeVideoError] Video error removed', { errorToRemove })
        if (this.selectedError?.type === errorToRemove.type) this.selectedError = null
      }
    },

    stopVideoStream() {
      this.isStreaming = false
      if (!this.videoStream) return
      this.videoStream.getTracks().forEach((t) => t.stop())
      loggerService.info('[videoMixin] [stopVideoStream]')
    },

    setVideoPreview() {
      if (!this.elVideo) return
      const elVideo = this.getElVideo()
      if (!elVideo) return
      elVideo.srcObject = this.videoStream
      elVideo.play()
      elVideo.muted = true
      loggerService.info('[videoMixin] [setVideoPreview]')
    },

    onSelectDevice(device) {
      this.isAudioReady = false
      this.isVideoReady = false
      this.stopVideoStream()
      if (device.type === 'audioinput') this.selectedDevices.audio.deviceId = device.id
      else this.selectedDevices.video.deviceId = device.id
      this.initVideoMixin()
      loggerService.info('[videoMixin] [onSelectDevice]', { device })
    },

    startVideoRecording() {
      try {
        if (!this.videoStream) return
        this.prepareVideoRecorder()
        this._mediaRecorder.start()
        loggerService.info('[videoMixin] [startVideoRecording]')
      } catch (e) {
        loggerService.error('[videoMixin] [startVideoRecording] Could not start video media recorder', e)
      }
    },

    prepareVideoRecorder() {
      this._mediaRecorder = new MediaRecorder(this.videoStream, {
        mimeType: this.mimeType,
      })
      window.mediaRec = this._mediaRecorder
      this._mediaRecorder.ignoreMutedMedia = true
      this.addListeners()
      loggerService.info('[videoMixin] [prepareVideoRecorder]')
    },

    stopMediaRecorder() {
      if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
        this._mediaRecorder.stop()
        loggerService.info('[videoMixin] [stopMediaRecorder]')
      }
    },

    stopVideoRecording(jobId, questId) {
      if (!this.isVideoRecording) return
      return new Promise((res, rej) => {
        const createVideoBlob = () => {
          const blob = new Blob(this.chunks, { type: this.mimeType })
          if (blob.size > 0) {
            blob.interviewData = { questId, interviewId: jobId }
            res(blob)
          }
          this.chunks = []
          this.isPaused = false
          this._mediaRecorder.onstop = null
          this.isVideoRecording = false
        }
        if (this._mediaRecorder.state !== 'inactive') {
          this._mediaRecorder.addEventListener('stop', createVideoBlob, { once: true })
          this._mediaRecorder.stop()
        } else {
          createVideoBlob()
        }

        loggerService.info('[videoMixin] [stopVideoRecording]', { jobId }, { questId })
      })
    },
  },
}
