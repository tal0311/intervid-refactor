// THIS IS v0 FOR THIS COMPOSABLE, IT IS MENT TO BE UGLY SO WE CAN MERGE TO MASTER
// TODO: Redo this composable to be more readable and maintainable, consider overhauling the whole component structure that is using it
// core
import {ref} from 'vue'
// lib
import {useStore} from 'vuex'
// services
import {loggerService} from '@/services/loggerService'
import {screenService} from '@/services/screenService.js'
import {screenErrorMap} from '@/services/errorService'

export function useScreen({vidRecorder} = {vidRecorder: null}) {
  // Data

  // #public
  const screenStream = ref(null)
  const screenErrors = ref([])

  // #private
  let _screenChunks = []
  let _screenRecorder = null

  const store = useStore()

  // #unused
  let isRecordingScreen = false

  // Methods
  // #public
  const init = async () => {
    loggerService.info('[ScreenMixin] [initScreenMixin]')
    try {
      screenStream.value = await screenService.getScreenStream()
      const elScreenVideo = _getElScreenVideo()
      if (elScreenVideo) {
        elScreenVideo.srcObject = screenStream.value
        elScreenVideo.play()
      }
      _screenRecorder = await screenService.getScreenRecorder()
      _screenRecorder.ondataavailable = ({data}) => {
        _screenChunks.push(data)
      }
      removeScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
      const browserName = store.getters['app/browser'].name
      if (browserName === 'safari') {
        _addScreenError(screenErrorMap.SAFARI_SCREEN_SHARE)
        loggerService.info('[ScreenMixin] [initScreenMixin] Safari screen share alert added')
      }
    } catch (err) {
      loggerService.error('[ScreenMixin] [initScreenMixin] Denied screen access', {err})
      _addScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
    }
  }

  const startScreenRecording = () => {
    isRecordingScreen = true
    _screenRecorder.start(1000)
    loggerService.info('[ScreenMixin] [startScreenRecording]')
  }

  const stopScreenRecorder = () => {
    if (_screenRecorder && _screenRecorder.state !== 'inactive') {
      _screenRecorder.stop()
      loggerService.info('[ScreenMixin] [stopScreenRecorder]')
    }
  }

  const stopScreenRecording = (interviewId, questId) => {
    return new Promise((res) => {
      const createScreenBlob = () => {
        const blob = new Blob(_screenChunks, {
          type: _screenChunks[0].type,
        })
        blob.interviewData = {
          interviewId,
          questId,
          isScreen: true,
        }
        res(blob)
        _screenChunks = []
        _screenRecorder.onstop = null
        isRecordingScreen = false
      }

      if (_screenRecorder.state !== 'inactive') {
        _screenRecorder.addEventListener('stop', createScreenBlob, {
          once: true,
        })
        _screenRecorder.stop()
      } else {
        createScreenBlob()
      }
      loggerService.info('[ScreenMixin] [stopScreenRecording]', {interviewId}, {questId})
    })
  }

  const disposeScreenStream = () => {
    if (!screenStream.value) return
    screenStream.value = screenService.disposeScreenStream()
    loggerService.info('[ScreenMixin] [disposeScreenStream]')
  }

  const removeScreenError = (errorToRemove) => {
    if (screenErrors.value.some((err) => err.type === errorToRemove.type)) {
      screenErrors.value = screenErrors.value.filter((error) => error.type !== errorToRemove.type)
      loggerService.info('[ScreenMixin] [removeScreenError] Screen error removed', {errorToRemove})
    }
  }

  // #private
  const _getElScreenVideo = () => {
    // why the actual fuck
    return vidRecorder?.value?.$refs?.screenVideo
  }

  const _addScreenError = (err) => {
    if (screenErrors.value.includes(err)) return
    screenErrors.value.push(err)
    loggerService.info('[ScreenMixin] [addScreenError] Screen error added', {
      err,
    })
  }

  // #unused
  // Left this as an es-lint error so we can remember to use /remove it later
  const _addStreamStopListener = () => {
    // Adds stop stream events -> In order to get the event everytime the stream stops.
    loggerService.info('[ScreenMixin] [addStreamStopListener]')
    return new Promise((resolve, reject) => {
      try {
        const events = ['ended', 'inactive']
        let callback = resolve

        const listenerFunc = (e) => {
          callback(e)
          callback = () => {}
        }

        if (screenStream.value) {
          events.forEach((event) => {
            screenStream.value.addEventListener(event, listenerFunc, {
              once: true,
            })
            screenStream.value.getTracks().forEach((track) => {
              track.addEventListener(event, listenerFunc, {once: true})
            })
          })
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  return {
    screenStream,
    screenErrors,
    isRecordingScreen,
    initScreen: init,
    startScreenRecording,
    stopScreenRecorder,
    stopScreenRecording,
    disposeScreenStream,
    removeScreenError,
  }
}

// Keeping this here for future refrence
// import {screenErrorMap} from '@/services/errorService'
// import {loggerService} from '@/services/loggerService'
// import {screenService} from '@/services/screenService.js'

// export default {
//   _screenRecorder: null,
//   // cmps:
//   // 1 = InterviewIndex
//   // 2 = MediaCheck
//   data() {
//     return {
//       // internal, one use outside for checking if it exists, 2
//       screenStream: null,
//       // internal + external, 1 + 2
//       screenErrors: [],
//       // internal
//       _screenChunks: [],
//       // internal
//       _isRecordingScreen: false,
//     }
//   },

//   methods: {
//     // external, 1 + 2
//     async initScreenMixin() {
//       loggerService.info('[ScreenMixin] [initScreenMixin]')
//       try {
//         this.screenStream = await screenService.getScreenStream()
//         console.log('🚀 ~ file: ScreenMixin.js:29 ~ initScreenMixin ~ this.screenStream:', this.screenStream)
//         const elScreenVideo = this._getElScreenVideo()
//         if (elScreenVideo) {
//           elScreenVideo.srcObject = this.screenStream
//           elScreenVideo.play()
//         }
//         this._screenRecorder = await screenService.getScreenRecorder()
//         this._screenRecorder.ondataavailable = ({data}) => {
//           this._screenChunks.push(data)
//         }
//         this.removeScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
//         const browserName = this.$store.getters['app/browser'].name
//         if (browserName === 'safari') {
//           this._addScreenError(screenErrorMap.SAFARI_SCREEN_SHARE)
//           loggerService.info('[ScreenMixin] [initScreenMixin] Safari screen share alert added')
//         }
//       } catch (err) {
//         // console.log(err)
//         loggerService.error('[ScreenMixin] [initScreenMixin] Denied screen access', {err})
//         this._addScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
//       }

//       // this._addStreamStopListener().then((ev) => {
//       //   loggerService.error('[ScreenMixin] [initScreenMixin] Candidate denied screen access - event: ', {ev})
//       //   this._addScreenError(screenErrorMap.DENIED_SCREEN_ACCESS)
//       // })
//     },
//     // external, 1
//     startScreenRecording() {
//       this._isRecordingScreen = true
//       this._screenRecorder.start(1000)
//       loggerService.info('[ScreenMixin] [startScreenRecording]')
//     },
//     // external, 1
//     stopScreenRecorder() {
//       if (this._screenRecorder && this._screenRecorder.state !== 'inactive') {
//         this._screenRecorder.stop()
//         loggerService.info('[ScreenMixin] [stopScreenRecorder]')
//       }
//     },
//     // external, 1
//     stopScreenRecording(interviewId, questId) {
//       return new Promise((res) => {
//         const createScreenBlob = () => {
//           const blob = new Blob(this._screenChunks, {
//             type: this._screenChunks[0].type,
//           })
//           blob.interviewData = {
//             interviewId,
//             questId,
//             isScreen: true,
//           }
//           res(blob)
//           this._screenChunks = []
//           this._screenRecorder.onstop = null
//           this._isRecordingScreen = false
//         }

//         if (this._screenRecorder.state !== 'inactive') {
//           this._screenRecorder.addEventListener('stop', createScreenBlob, {
//             once: true,
//           })
//           this._screenRecorder.stop()
//         } else {
//           createScreenBlob()
//         }
//         loggerService.info('[ScreenMixin] [stopScreenRecording]', {interviewId}, {questId})
//       })
//     },
//     // external, 1
//     disposeScreenStream() {
//       if (!this.screenStream) return
//       this.screenStream = screenService.disposeScreenStream()
//       loggerService.info('[ScreenMixin] [disposeScreenStream]')
//     },
//     // ineternal + external, 1 + 2
//     removeScreenError(errorToRemove) {
//       if (this.screenErrors.some((err) => err.type === errorToRemove.type)) {
//         this.screenErrors = this.screenErrors.filter((error) => error.type !== errorToRemove.type)
//         loggerService.info('[ScreenMixin] [removeScreenError] Screen error removed', {errorToRemove})
//       }
//     },
//     // internal
//     _getElScreenVideo() {
//       // why the actual fuck
//       return this.$refs.vidRecorder?.$refs.screenVideo
//     },
//     // internal
//     _addStreamStopListener() {
//       // Adds stop stream events -> In order to get the event everytime the stream stops.
//       loggerService.info('[ScreenMixin] [addStreamStopListener]')
//       return new Promise((resolve, reject) => {
//         try {
//           const events = ['ended', 'inactive']
//           let callback = resolve

//           const listenerFunc = (e) => {
//             callback(e)
//             callback = function () {}
//           }

//           if (this.screenStream) {
//             events.forEach((event) => {
//               this.screenStream.addEventListener(event, listenerFunc, {
//                 once: true,
//               })
//               this.screenStream.getTracks().forEach((track) => {
//                 track.addEventListener(event, listenerFunc, {once: true})
//               })
//             })
//           }
//         } catch (e) {
//           reject(e)
//         }
//       })
//     },
//     // internal
//     _addScreenError(err) {
//       if (this.screenErrors.includes(err)) return
//       this.screenErrors.push(err)
//       loggerService.info('[ScreenMixin] [addScreenError] Screen error added', {
//         err,
//       })
//     },
//   },
// }
