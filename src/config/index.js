import production from './production'
import staging from './staging'
import development from './development'

var config;

if (process.env.NODE_ENV === 'production') {
   if (process.env.VUE_APP_ENV === 'staging') {
      config = staging
   } else {
      config = production
   }
} else {
   config = development
}

export default config
