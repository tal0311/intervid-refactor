export const player = {
  namespaced: true,
  state: {
    playerState: {
      currTime: 0.1,
      autoPlay: true,
      volume: 100,
      isLoading: true,
      isDisabled: false,
      isFullScreen: false,
      totalDuration: 0,
      downloadProgress: 0,
      isPlaying: false,
      speed: 1,
      isPlayingNotes: false,
    },
    jumpToPoint: null
  },
  getters: {
    playerState(state) {
      return state.playerState
    },
    getCurrTime(state) {
      return state.playerState.currTime
    },
    getTotalTime(state) {
      return state.playerState.totalTime
    },
    getJumpToPoint(state) {
      return state.jumpToPoint
    }
  },
  mutations: {
    setPlayerState(state, { playerState }) {
      state.playerState = playerState
    },
    setCurrTime(state, { currTime }) {
      state.playerState.currTime = currTime
    },
    setIsPlaying(state, { isPlaying }) {
      state.playerState.isPlaying = isPlaying
    },
    setJumpToPoint(state, { jumpToPoint }) {
      state.jumpToPoint = jumpToPoint
    }
  },
}
