import { createApp } from 'vue'
import Vue from 'vue'
import Hotjar from 'vue-hotjar'
import VueAnalytics from 'vue-analytics'
import VueMeta from 'vue-meta'
import { directive as onClickaway } from 'vue-clickaway2'
import { ObserveVisibility } from 'vue-observe-visibility'
import Vue2TouchEvents from 'vue2-touch-events'

// import './registerServiceWorker'

import { tokenService } from './services/tokenService'
import { isMobile } from './services/utilService'
import { loggerService } from './services/loggerService'

import MainInput from '@/cmps/common/MainInput.vue'
import Checkbox from '@/cmps/common/Checkbox'
import BasicSelect from '@/cmps/common/BasicSelect'

import './assets/scss/global.scss'
import { getTrans } from './services/i18nService'
import config from './config'

import App from './App.vue'
import router from './router'
import store from './store'


 ; (async function () {
  const isInInterview = router.history._startLocation.startsWith('/interview')
  if (isInInterview) return
  if (tokenService.getToken()) {
   store.dispatch('user/loadLoggedUser')
  }
 })()

 // Accessibillty helper:
 ; (function () {
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
   ; (function (doc, head, body) {
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
 store.commit({ type: 'app/setIsMobile', isMobile: isMobile() })
})

window.onerror = function (message, source, lineno, colno, error) {
 loggerService.error('Uncaught Error', message)
}

if (config.httpProtocol && window.location.protocol !== 'https:') {
 window.location.protocol = config.httpProtocol
}

let userLang = localStorage.getItem('userLang')
if (!userLang) {
 userLang = navigator.language === 'he' ? 'he' : 'en'
}
store.dispatch('app/setLang', { lang: userLang })

Vue.component('main-input', MainInput)
Vue.component('basic-select', BasicSelect)
Vue.component('checkbox', Checkbox)

Vue.directive('clickaway', onClickaway)
Vue.directive('observe-visibility', ObserveVisibility)

Vue.mixin({
 methods: {
  getTrans,
 },
})

Vue.use(Vue2TouchEvents, {
 disableClick: false,
 touchClass: '',
 tapTolerance: 10,
 touchHoldTolerance: 400,
 swipeTolerance: 30,
 longTapTimeInterval: 400,
 namespace: 'touch',
})
Vue.use(Hotjar, {
 // id: '2047969',
 id: '3214500',
 isProduction: process.env.NODE_ENV === 'production',
 snippetVersion: 6,
})

Vue.use(VueAnalytics, {
 id: 'UA-189794399-1',
 router,
})
Vue.use(VueMeta, {
 keyName: 'metaInfo',
 attribute: 'data-vue-meta',
 // ssrAttribute: 'data-vue-meta-server-rendered',
 // tagIDKeyName: 'vmid',
 refreshOnceOnNavigation: true
})




const app = createApp(App)

app.use(router)
app.use(router)
app.mount('#app')
