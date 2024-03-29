import {createStore} from 'vuex'
import {app} from './modules/appStore.js'
import {user} from './modules/userStore.js'
import {record} from './modules/recordStore.js'
import {auth} from './modules/authStore.js'
import {template} from './modules/templateStore'
import {job} from './modules/jobStore'
import {applicant} from './modules/applicantStore'
import {player} from './modules/playerStore'
import {activity} from './modules/activityStore'
import {initialState} from '@/services/constData.js'
// import {mutationHistory} from './mutationHistory.js'

const initialStoreModules = {
  app,
  user,
  auth,
  job,
  template,
  applicant,
  player,
  record,
  activity,
}

// only for development
// const undoRedoPlugin = (store) => {
//   // initialize and save the starting stage
//   mutationHistory.init(store)
//   // let firstState = cloneDeep(store.state);
//   // mutationHistory.addMutation(firstState);

//   store.subscribe((mutation) => {
//     // is called AFTER every mutation
//     mutationHistory.addMutation(cloneDeep(mutation))
//   })
// }

const store = createStore({
  strict: true,
  modules: initialStoreModules,
  mutations: {
    /* eslint-disable no-unused-vars */
    resetState(state) {
      state = initialState
    },
  },
})

export default store

// export default new Vuex.Store({
//   strict: true,
//   modules: cloneDeep(initialStoreModules),
//   mutations: {
//     emptyState(state) {
//       state = {};
//     },
//     resetState(state) {
//       Object.keys(initialStoreModules).forEach((key) => {
//         state[key] = cloneDeep(initialStoreModules[key].state);
//       });
//     },
//   },
//   plugins: [undoRedoPlugin],
// });
