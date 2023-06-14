import production from './production'
import staging from './staging'
import development from './development'

var config

console.log('special env:', import.meta.env.VITE_SPECIAL_TAL)
console.log('import.meta.env.PROD:', import.meta.env.PROD)
console.log('import.meta.env.VUE_APP_ENV:', import.meta.env.VUE_APP_ENV)

if (import.meta.env.PROD) {
  // TODO: find the vite equivalent of import.meta.env.VUE_APP_ENV
  if (import.meta.env.VUE_APP_ENV === 'staging') {
    config = staging
  } else {
    config = production
  }
} else {
  config = development
}

export default config
