import {useStore} from 'vuex'

export function useAlert() {
  const store = useStore()
  const sendAlert = (alertData) => {
    store.commit({
      type: 'app/setAlertData',
      alertData,
    })
  }
  return {
    sendAlert,
  }
}
