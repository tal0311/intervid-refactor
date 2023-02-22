import {computed, ref} from 'vue'
// composables
import {useRoute} from 'vue-router'
// services & data
import {getDefaultSort} from '@/services/constData.js'

export function useSort(initialValue = getDefaultSort(useRoute().name)) {
  const sort = ref(initialValue)
  const onSort = (sortProp) => {
    if (!sortProp) return
    if (sortProp === sort.value.by) {
      sort.value.dir = sort.value.dir === 'asc' ? 'desc' : 'asc'
    }
    sort.value.by = sortProp
  }
  // we're gonna fuck around and find out
  const sortFunc = computed(() => (a, b) => {
    const modifier = sort.value.dir === 'desc' ? 1 : -1
    const aVal = Object.byString(a, sort.value.by) || ''
    const bVal = Object.byString(b, sort.value.by) || ''
    if (!isNaN(+aVal)) {
      return (+aVal - +bVal) * modifier
    } else {
      if (aVal.toLowerCase() < bVal.toLowerCase()) return -1 * modifier
      if (aVal.toLowerCase() > bVal.toLowerCase()) return 1 * modifier
      return 0
    }
  })
  return {
    sort,
    onSort,
    sortFunc,
  }
}
