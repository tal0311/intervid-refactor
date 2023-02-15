import { screenErrorMap } from '@/services/errorService'
import { loggerService } from '@/services/loggerService'
import { screenService } from '@/services/screenService.js'

export default {
  _screenRecorder: null,

  data() {
    return {
      screenStream: null,
      screenChunks: [],
      isRecordingScreen: false,
      screenErrors: [],
    }
  },

  methods: {
    async initScreenMixin() {
      loggerService.info('[ScreenMixin] [initScreenMixin]')
      try {
        this.screenStream = await screenService.getScreenStream()
        const elScreenVideo = this.getElScreenVideo()
        if (elScreenVideo) {
          elScreenVideo.srcObject = this.screenStream
          elScreenVideo.play()
        }
        this._screenRecorder = await screenService.getScreenRecorder()
        this._screenRecorder.ondataavailable = ({ data }) => {
          this.screenChunks.push(data)
        }
        this.removeScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
        const browserName = this.$store.getters['app/browser'].name
        if (browserName === 'safari') {
          this.addScreenError(screenErrorMap.SAFARI_SCREEN_SHARE)
          loggerService.info('[ScreenMixin] [initScreenMixin] Safari screen share alert added')
        }
      } catch (err) {
        loggerService.error('[ScreenMixin] [initScreenMixin] Denied screen access', { err })
        this.addScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
      }

      this.addStreamStopListener().then((ev) => {
        loggerService.error('[ScreenMixin] [initScreenMixin] Candidate denied screen access - event: ', { ev })
        this.addScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
      })
    },

    getElScreenVideo() {
      return this.$refs.vidRecorder?.$refs.screenVideo
    },

    startScreenRecording() {
      this.isRecordingScreen = true
      this._screenRecorder.start(1000)
      loggerService.info('[ScreenMixin] [startScreenRecording]')
    },

    stopScreenRecorder() {
      if (this._screenRecorder && this._screenRecorder.state !== 'inactive') {
        this._screenRecorder.stop()
        loggerService.info('[ScreenMixin] [stopScreenRecorder]')
      }
    },

    stopScreenRecording(interviewId, questId) {
      return new Promise((res) => {
        const createScreenBlob = () => {
          const blob = new Blob(this.screenChunks, { type: this.screenChunks[0].type })
          blob.interviewData = {
            interviewId,
            questId,
            isScreen: true,
          }
          res(blob)
          this.screenChunks = []
          this._screenRecorder.onstop = null
          this.isRecordingScreen = false
        }

        if (this._screenRecorder.state !== 'inactive') {
          this._screenRecorder.addEventListener('stop', createScreenBlob, { once: true })
          this._screenRecorder.stop()
        } else {
          createScreenBlob()
        }
        loggerService.info('[ScreenMixin] [stopScreenRecording]', { interviewId }, { questId })
      })
    },

    disposeScreenStream() {
      if (!this.screenStream) return
      this.screenStream = screenService.disposeScreenStream()
      loggerService.info('[ScreenMixin] [disposeScreenStream]')
    },

    addStreamStopListener() {
      // Adds stop stream events -> In order to get the event everytime the stream stops.
      loggerService.info('[ScreenMixin] [addStreamStopListener]')
      return new Promise((resolve, reject) => {
        try {
          const events = ['ended', 'inactive']
          let callback = resolve

          const listenerFunc = (e) => {
            callback(e)
            callback = function () { }
          }

          if (this.screenStream) {
            events.forEach((event) => {
              this.screenStream.addEventListener(event, listenerFunc, { once: true })
              this.screenStream.getTracks().forEach((track) => {
                track.addEventListener(event, listenerFunc, { once: true })
              })
            })
          }
        } catch (e) {
          reject(e)
        }
      })
    },

    addScreenError(err) {
      if (this.screenErrors.includes(err)) return
      this.screenErrors.push(err)
      loggerService.info('[ScreenMixin] [addScreenError] Screen error added', { err })
    },

    removeScreenError(errorToRemove) {
      if (this.screenErrors.some((err) => err.type === errorToRemove.type)) {
        this.screenErrors = this.screenErrors.filter((error) => error.type !== errorToRemove.type)
        loggerService.info('[ScreenMixin] [removeScreenError] Screen error removed', { errorToRemove })
      }
    },
  },
}
