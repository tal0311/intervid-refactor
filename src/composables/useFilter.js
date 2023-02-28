// core
import {ref, computed, onMounted} from 'vue'
// composables
import {useQuery} from '@/composables/useQuery.js'
// services & data
import {getDefaultFilter} from '@/services/constData.js'

export function useFilter() {
  const {route, onSetQuery} = useQuery()
  const filterBy = ref(getDefaultFilter(route.name))

  const _shouldParseFilter = computed(() => {
    return !!Object.values(route.query).length
  })
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

  const _setDefaultFilter = () => {
    _setFilter(getDefaultFilter(route.name))
  }
  const _setFilter = (filter) => {
    filterBy.value = {...filter}
  }
  const onSetFilter = (filter) => {
    console.log('onSetFilter', filter)
    _setFilter(filter)
    onSetQuery(filterBy.value, _archiveBy.value)
  }
  const onSetFilterByKey = (key, value) => {
    const filterValue = value === filterBy.value[key] && key !== 'currPage' ? '' : value
    const newFilterBy = {...filterBy.value, [key]: filterValue}
    if (key !== 'currPage') newFilterBy.currPage = 0
    onSetFilter(newFilterBy)
    // filterBy.value = newFilterBy
    // onSetQuery(newFilterBy, _archiveBy.value)
  }
  const resetFilters = () => {
    _setDefaultFilter()
    onSetQuery({})
  }
  // TODO: find a better name for this func
  const setFilterFromRoute = () => {
    if (!_shouldParseFilter.value) return _setDefaultFilter()
    // TODO: Check if _parseFilter can somehow use JSON.parse and avoid the horryfying ternary statement and assignments
    const parsedFilterBy = _parseFilter(route.query)
    parsedFilterBy.showArchived = parsedFilterBy.showArchived === 'true'
    parsedFilterBy.incomplete =
      parsedFilterBy.incomplete !== 'undefined' && parsedFilterBy.incomplete !== undefined
        ? JSON.parse(parsedFilterBy.incomplete)
        : undefined
    parsedFilterBy.daysAgo = parsedFilterBy.daysAgo || ''
    _setFilter(parsedFilterBy)
  }

  onMounted(() => {
    setFilterFromRoute()
  })

  return {
    filterBy,
    resetFilters,
    onSetFilter,
    onSetFilterByKey,
    setFilterFromRoute,
  }
}

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
  console.log('filterBy', filterBy)
  return filterBy
}
