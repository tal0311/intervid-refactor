// lib
import {useRoute, useRouter} from 'vue-router'
// services & data
import {utilService} from '@/services/utilService.js'

/**
 * @description A Vue 3 composable that provides a debounced wrapper for the Vue Router route object, along with an easy-to-use `onSetQuery` function.
 *
 * @returns An object containing the current route object and an `onSetQuery` function.
 *
 * @example
 * ```vue
 * <template>
 *   <div>
 *     <!-- Display the current route name -->
 *     <p>Current route: {{ route.name }}</p>
 *
 *     <!-- Allow the user to filter results -->
 *     <input v-model="filterBy" type="text" placeholder="Filter by...">
 *
 *     <!-- Update the route query when the user types in the filter input -->
 *     <button @click="updateQuery">Apply filter</button>
 *   </div>
 * </template>
 *
 * <script>
 * import { useQuery } from '@/composables/useQuery'
 * import { ref, computed } from 'vue'
 *
 * export default {
 *   setup() {
 *     const { route, onSetQuery } = useQuery()
 *     const filterBy = ref(null)
 *
 *     // Determine the initial filter value based on the current route
 *     const initialValue = route.name === 'foo' ? 'abc' : 'def'
 *
 *     // Set up the filter value
 *     filterBy.value = initialValue
 *
 *     // Determine whether to parse the filter value from the route query
 *     const shouldParseFilter = computed(() => {
 *       return !!Object.values(route.query).length
 *     })
 *
 *     // Define the update query function
 *     const updateQuery = () => {
 *       const query = { filterBy: filterBy.value }
 *       onSetQuery(query)
 *     }
 *
 *     return {
 *       route,
 *       filterBy,
 *       shouldParseFilter,
 *       updateQuery,
 *     }
 *   },
 * }
 * </script>
 * ```
 */
export function useQuery() {
  /**
   * The current Vue Router route object.
   *
   * @type {import('vue-router').Route}
   */
  const route = useRoute()

  /**
   * The Vue Router instance.
   *
   * @type {import('vue-router').Router}
   */
  const router = useRouter()

  /**
   * A debounced version of `router.push()` that sets the query parameters for the current route.
   *
   * @param {object} query - The new query parameters to set.
   * @param {string} [path] - The new path to navigate to (if the route has no params).
   */
  const onSetQuery = utilService.debounce((query, path) => {
    const {params} = route

    const newRoute = {query}
    if (!utilService.isEmpty(params)) {
      newRoute.params = params
    }
    if (path) {
      newRoute.path = path
    }
    router.push(newRoute)
  }, 200)

  return {
    route,
    onSetQuery,
  }
}
