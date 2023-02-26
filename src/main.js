import {createApp} from 'vue'

// import VueHotjar from 'vue-hotjar-next'
// import VueAnalytics from "vue-analytics";
// import VueMeta from "vue-meta";
// import { directive as onclickOutside } from "vue-clickOutside2";
// import { clickOutside } from './directivs'

// TODO CHECK IF NEEDED
import {ObserveVisibility} from 'vue3-observe-visibility'
import Vue3TouchEvents from 'vue3-touch-events'
import vue3GoogleLogin from 'vue3-google-login'
import VueSocialSharing from 'vue-social-sharing'

// import './registerServiceWorker'

import {tokenService} from './services/tokenService'
import {isMobile} from './services/utilService'
import {loggerService} from './services/loggerService'

import MainInput from '@/cmps/common/MainInput.vue'
import CheckBox from '@/cmps/common/CheckBox.vue'
import BasicSelect from '@/cmps/common/BasicSelect.vue'
import {clickOutside} from './directivs'

import './assets/scss/global.scss'
// import {getTrans} from './services/i18nService'
// import {getSvg} from './services/svgService'
import config from './config'

import App from './App.vue'
import router from './router'
import store from './store'

// NOTE: remove this func, set it as guard in the router index. see:
// ;(async function () {
//   console.log('router.get', router)
//   const isInInterview = router.history._startLocation.startsWith('/interview')
//   if (isInInterview) return
//   if (tokenService.getToken()) {
//     store.dispatch('user/loadLoggedUser')
//   }
// })()

// Accessibillty helper:
import {i18nPlugin} from './plugins/i18n.plugin'
;(function () {
  window.interdeal = {
    sitekey: 'eb985e13938463d3b349126ea36d814e',
    Position: 'Start',
    Menulang: 'EN',
    domains: {
      js: 'https://cdn.equalweb.com/',
      acc: 'https://access.equalweb.com/',
    },
    btnStyle: {
      vPosition: ['80%', null],
      scale: ['0.5', '0.5'],
      color: {
        main: '#6e7577',
        second: '',
      },
      icon: {
        type: 11,
        shape: 'semicircle',
        outline: false,
      },
    },
  }
  ;(function (doc, head, body) {
    var coreCall = doc.createElement('script')
    coreCall.src = 'https://cdn.equalweb.com/core/4.3.7/accessibility.js'
    coreCall.defer = true
    coreCall.integrity =
      'sha512-hGa5HZtFkT1M7+tUDtU/cbw6AG0ORz3oblztCoTZ/z2qPyr7dgwH3zoT8qpgj21MgcRsMFLD6NNKePGvVks3Ig=='
    coreCall.crossOrigin = 'anonymous'
    coreCall.setAttribute('data-cfasync', true)
    body ? body.appendChild(coreCall) : head.appendChild(coreCall)
  })(document, document.head, document.body)
})()

window.addEventListener('resize', () => {
  store.commit({type: 'app/setIsMobile', isMobile: isMobile()})
})

window.onerror = function (message) {
  // source, lineno, colno, error
  loggerService.error('Uncaught Error', message)
}

if (config.httpProtocol && window.location.protocol !== 'https:') {
  window.location.protocol = config.httpProtocol
}

let userLang = localStorage.getItem('userLang')
if (!userLang) {
  userLang = navigator.language === 'he' ? 'he' : 'en'
}
store.dispatch('app/setLang', {lang: userLang})

const app = createApp(App)

app.component('main-input', MainInput)
app.component('basic-select', BasicSelect)
app.component('check-box', CheckBox)

app.directive('click-outside', clickOutside)
app.directive('observe-visibility', ObserveVisibility)

// ?delete
// app.mixin({
//   methods: {
//     getTrans,
//     getSvg
//   },
// })
app.use(i18nPlugin, {
  getLang: () => store.getters['app/lang'],
})

app.use(VueSocialSharing)
app.use(Vue3TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400,
  namespace: 'touch',
})
// app.use(VueHotjar, {
//   // id: '2047969',
//   id: '3214500',
//   isProduction: import.meta.env.PROD,
//   snippetVersion: 6,
// })
app.use(vue3GoogleLogin, {
  clientId: '459352034354-5afbe95ab9e5ffu3dg5s974qm1qf0aia.apps.googleusercontent.com',
})
// app.use(VueAnalytics, {
//   id: 'UA-189794399-1',
//   router,
// })
// app.use(VueMeta, {
//   keyName: "metaInfo",
//   attribute: "data-vue-meta",
//   // ssrAttribute: 'data-vue-meta-server-rendered',
//   // tagIDKeyName: 'vmid',
//   refreshOnceOnNavigation: true,
// });
app.use(store)
app.use(router)
// app.use(router)
app.mount('#app')
