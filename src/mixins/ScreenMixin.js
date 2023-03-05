import {screenErrorMap} from '@/services/errorService'
import {loggerService} from '@/services/loggerService'
import {screenService} from '@/services/screenService.js'

export default {
  _screenRecorder: null,
  // cmps:
  // 1 = InterviewIndex
  // 2 = MediaCheck
  data() {
    return {
      // internal, one use outside for checking if it exists, 2
      screenStream: null,
      // internal + external, 1 + 2
      screenErrors: [],
      // internal
      _screenChunks: [],
      // internal
      _isRecordingScreen: false,
    }
  },

  methods: {
    // external, 1 + 2
    async initScreenMixin() {
      loggerService.info('[ScreenMixin] [initScreenMixin]')
      try {
        this.screenStream = await screenService.getScreenStream()
        console.log('🚀 ~ file: ScreenMixin.js:29 ~ initScreenMixin ~ this.screenStream:', this.screenStream)
        const elScreenVideo = this._getElScreenVideo()
        if (elScreenVideo) {
          elScreenVideo.srcObject = this.screenStream
          elScreenVideo.play()
        }
        this._screenRecorder = await screenService.getScreenRecorder()
        this._screenRecorder.ondataavailable = ({data}) => {
          this.screenChunks.push(data)
        }
        this.removeScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
        const browserName = this.$store.getters['app/browser'].name
        if (browserName === 'safari') {
          this._addScreenError(screenErrorMap.SAFARI_SCREEN_SHARE)
          loggerService.info('[ScreenMixin] [initScreenMixin] Safari screen share alert added')
        }
      } catch (err) {
        loggerService.error('[ScreenMixin] [initScreenMixin] Denied screen access', {err})
        this._addScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
      }

      // this._addStreamStopListener().then((ev) => {
      //   loggerService.error('[ScreenMixin] [initScreenMixin] Candidate denied screen access - event: ', {ev})
      //   this._addScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
      // })
    },
    // external, 1
    startScreenRecording() {
      this.isRecordingScreen = true
      this._screenRecorder.start(1000)
      loggerService.info('[ScreenMixin] [startScreenRecording]')
    },
    // external, 1
    stopScreenRecorder() {
      if (this._screenRecorder && this._screenRecorder.state !== 'inactive') {
        this._screenRecorder.stop()
        loggerService.info('[ScreenMixin] [stopScreenRecorder]')
      }
    },
    // external, 1
    stopScreenRecording(interviewId, questId) {
      return new Promise((res) => {
        const createScreenBlob = () => {
          const blob = new Blob(this.screenChunks, {
            type: this.screenChunks[0].type,
          })
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
          this._screenRecorder.addEventListener('stop', createScreenBlob, {
            once: true,
          })
          this._screenRecorder.stop()
        } else {
          createScreenBlob()
        }
        loggerService.info('[ScreenMixin] [stopScreenRecording]', {interviewId}, {questId})
      })
    },
    // external, 1
    disposeScreenStream() {
      if (!this.screenStream) return
      this.screenStream = screenService.disposeScreenStream()
      loggerService.info('[ScreenMixin] [disposeScreenStream]')
    },
    // ineternal + external, 1 + 2
    removeScreenError(errorToRemove) {
      if (this.screenErrors.some((err) => err.type === errorToRemove.type)) {
        this.screenErrors = this.screenErrors.filter((error) => error.type !== errorToRemove.type)
        loggerService.info('[ScreenMixin] [removeScreenError] Screen error removed', {errorToRemove})
      }
    },
    // internal
    _getElScreenVideo() {
      // why the actual fuck
      return this.$refs.vidRecorder?.$refs.screenVideo
    },
    // internal
    _addStreamStopListener() {
      // Adds stop stream events -> In order to get the event everytime the stream stops.
      loggerService.info('[ScreenMixin] [addStreamStopListener]')
      return new Promise((resolve, reject) => {
        try {
          const events = ['ended', 'inactive']
          let callback = resolve

          const listenerFunc = (e) => {
            callback(e)
            callback = function () {}
          }

          if (this.screenStream) {
            events.forEach((event) => {
              this.screenStream.addEventListener(event, listenerFunc, {
                once: true,
              })
              this.screenStream.getTracks().forEach((track) => {
                track.addEventListener(event, listenerFunc, {once: true})
              })
            })
          }
        } catch (e) {
          reject(e)
        }
      })
    },
    // internal
    _addScreenError(err) {
      if (this.screenErrors.includes(err)) return
      this.screenErrors.push(err)
      loggerService.info('[ScreenMixin] [addScreenError] Screen error added', {
        err,
      })
    },
  },
}
