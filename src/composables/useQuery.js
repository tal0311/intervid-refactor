// lib
import {useRoute, useRouter} from 'vue-router'
// services & data
import {debounce, isEmpty} from '@/services/utilService.js'

export function useQuery() {
  const route = useRoute()
  const router = useRouter()

  //   const query = computed(() => {
  //     return route.query
  //   })

  const onSetQuery = debounce((query, path) => {
    // TODO: Check if this is the best way to get the params
    const {params} = route || null

    const newRoute = {query}
    if (!isEmpty(params)) newRoute.params = params
    else if (path) newRoute.path = path
    // if (!isEmpty(params)) newRoute.params = params
    // if (path && isEmpty(params)) newRoute.path = path
    router.push(newRoute)
  }, 200)

  return {
    route,
    onSetQuery,
  }
}
