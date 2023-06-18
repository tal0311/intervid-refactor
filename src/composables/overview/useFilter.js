// core
import {ref, computed, onMounted, watch} from 'vue'
// composables
import {useQuery} from '@/composables/util/useQuery.js'
// services & data
import {getDefaultFilter} from '@/services/constData.js'
/**
 * A composable for managing filters in the application.
 *
 * @param {Object} initialValue - The initial value of the filter.
 * @returns {Object} An object with filter-related functions and reactive values.
 * @property {Ref<Object>} filterBy - The reactive filter object.
 * @property {Function} onSetFilter - A function to set the filter and update the query parameters in the route.
 * @property {Function} onSetFilterByKey - A function to set a specific key-value pair in the filter object and update the query parameters in the route.
 * @property {Function} resetFilters - A function to reset the filter to its default value and clear the query parameters in the route.
 * @property {Function} setFilterFromRoute - A function to set the filter from the query parameters in the route.
 *
 *
 * @example
 * import { useFilter } from '@/composables/overview/useFilter.js'
 *
 * // set up the filter
 * const { filterBy, resetFilters, onSetFilter, onSetFilterByKey, setFilterFromRoute } = useFilter({})
 *
 * // use the filterBy reactive value in a component template
 * <template>
 *   <div>
 *     <input v-model="filterBy.keyword" type="text" placeholder="Search..." />
 *     <button @click="onSetFilter()">Apply Filter</button>
 *     <button @click="resetFilters()">Reset Filter</button>
 *   </div>
 * </template>
 */
export function useFilter(initialValue) {
  const {route, onSetQuery} = useQuery()
  /**
   * The reactive filter object.
   *
   * @type {Ref<Object>}

   */
  const filterBy = ref(initialValue ?? getDefaultFilter(route.name))

  /**
   * A computed property that returns true if there are any query parameters in the current route.
   *
   * @type {ComputedRef<boolean>}
   */
  const _shouldParseFilter = computed(() => {
    return !!Object.values(route.query).length
  })

  /**
   * A computed property that returns the archive type based on the current route.
   *
   * @type {ComputedRef<string>}
   */
  const _archiveBy = computed(() => {
    switch (route.name) {
      case 'ApplicantOverview':
        return 'applicant'
      case 'JobOverview':
        return 'job'
      case 'TemplateOverview':
        return 'template'
      default:
        return ''
    }
  })

  /**
   * Sets the filter and updates the query parameters in the route.
   *
   * @param {Object} filter - The filter object to apply.
   */
  function onSetFilter(filter) {
    _setFilter(filter)
    onSetQuery(filterBy.value, _archiveBy.value)
  }

  /**
   * Sets a specific key-value pair in the filter object and updates the query parameters in the route.
   *
   * @param {string} key - The key to update in the filter object.
   * @param {*} value - The value to assign to the key in the filter object.
   */
  function onSetFilterByKey(key, value) {
    const filterValue = value === filterBy.value[key] && key !== 'currPage' ? '' : value
    const newFilterBy = {...filterBy.value, [key]: filterValue}
    if (key !== 'currPage') newFilterBy.currPage = 0
    onSetFilter(newFilterBy)
  }

  /**
   * Resets the filter to its default value and clears the query parameters in the route.
   */
  function resetFilters() {
    _setDefaultFilter()
    onSetQuery({})
  }

  /**
   * Deletes a filter by key
   * @param {string} key
   */
  function onDeleteFilterByKey(key) {
    // I hate this, but I left it here as to not break anything and change too much logic atm
    const newFilterBy = {...filterBy.value}
    console.log(newFilterBy)
    delete newFilterBy[key]
    onSetFilter(newFilterBy)
  }
  /**
   *  Sets the filter based on the query parameters in the route, or sets the default filter if there are no query parameters.
   */
  // TODO: find a better name for this func
  function setFilterFromRoute() {
    if (!_shouldParseFilter.value) return _setDefaultFilter()
    // // TODO: Check if _parseFilter can somehow use better parsing and avoid the horryfying ternary statement and assignments
    const parsedFilterBy = _parseFilter(route.query)
    parsedFilterBy.showArchived = parsedFilterBy.showArchived === 'true'
    parsedFilterBy.incomplete =
      parsedFilterBy.incomplete !== 'undefined' && parsedFilterBy.incomplete !== undefined
        ? JSON.parse(parsedFilterBy.incomplete)
        : undefined
    parsedFilterBy.daysAgo = parsedFilterBy.daysAgo || ''
    _setFilter(parsedFilterBy)
  }

  const _setDefaultFilter = () => _setFilter(getDefaultFilter(route.name))
  /**
   *  Sets the filter object.
   * @param {Object} filter - The filter object to apply.
   */
  const _setFilter = (filter) => (filterBy.value = {...filter})

  onMounted(() => {
    setFilterFromRoute()
  })

  watch(route, () => {
    setFilterFromRoute()
  })
  return {
    filterBy,
    resetFilters,
    onSetFilter,
    onSetFilterByKey,
    setFilterFromRoute,
    onDeleteFilterByKey,
  }
}

/**
 * Parses the query parameters in the route and returns a filter object.
 * @param {Object} query - The query parameters in the route.
 * @returns {Object} The filter object.
 * @example
 * // returns { keyword: 'test', currPage: 0, statuses: ['new', 'in-progress'] }
 * _parseFilter({ keyword: 'test', currPage: 0, statuses: 'new,in-progress' })
 */
function _parseFilter(query) {
  const filterBy = {}
  const searchParams = new URLSearchParams(query)
  for (let [key, value] of searchParams) {
    if (value) {
      if (key === 'statuses') value = value.split(',')
      filterBy[key] = value
    }
  }
  if (filterBy.currPage) filterBy.currPage = +filterBy.currPage
  return filterBy
}
