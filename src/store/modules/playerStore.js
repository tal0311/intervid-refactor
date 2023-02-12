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
  },
  getters: {
    playerState(state) {
      return state.playerState
    },
  },
  mutations: {
    setPlayerState(state, { playerState }) {
      state.playerState = playerState
    },
  },
}
