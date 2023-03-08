import {useStore} from 'vuex'
/**
 * @description A composable to send an alert to the app through the store
 * @returns {Object} The object containing the sendAlert function
 */
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
