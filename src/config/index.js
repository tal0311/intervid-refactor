import production from './production'
import staging from './staging'
import development from './development'

var config

if (import.meta.env.PROD) {
  // TODO: find the vite equivalent of import.meta.env.VUE_APP_ENV
  if (import.meta.env.VITE_APP_ENV === 'staging') {
    config = staging
  } else {
    config = production
  }
} else {
  config = development
}

export default config
