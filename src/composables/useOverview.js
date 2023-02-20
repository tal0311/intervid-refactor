// core
import {ref, reactive, computed, onMounted} from 'vue'
// lib
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'
// services & data
import {getDefaultFilter, getDefaultSort} from '@/services/constData.js'
import {getTrans} from '@/services/i18nService.js'
import {parseFilter, debounce, isEmpty} from '@/services/utilService.js'

export function useOverview({}) {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const shouldGather = ref(false)
  const selectedItems = reactive([])
  const filterBy = reactive(getDefaultFilter(route.name))
  const sort = reactive(getDefaultSort(route.name))

  const query = computed(() => {
    return route.query
  })

  const cmpName = computed(() => {
    return route.name
  })
  const showArchived = computed(() => {
    return route.path.includes('archive')
  })

  const shouldParseFilter = computed(() => {
    return !!Object.values(query.value).length
  })

  const archiveBy = computed(() => {
    switch (cmpName.value) {
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

  const tagList = computed(() => {
    const queries = query.value

    const tags = []
    for (const key in queries) {
      if (key === 'daysAgo' && queries[key]) tags.push({name: getTrans('date'), type: 'daysAgo'})
      if (key === 'incomplete' && queries[key] !== undefined) {
        const tag =
          queries[key] === 'false'
            ? {name: getTrans('complete-interviews'), type: 'incomplete'}
            : {name: getTrans('incomplete-interviews'), type: 'incomplete'}
        tags.push(tag)
      }
      if (key === 'showArchived' && queries[key] === 'true')
        tags.push({name: getTrans('archived'), type: 'showArchived'})
      if (key === 'tag' && queries[key]) {
        const tag = queries[key].split(',')
        tag.forEach((t) => {
          tags.push({name: t, type: 'tag'})
        })
      }
    }
    return tags
  })
  const setShouldGather = (val) => {
    shouldGather.value = val
  }

  const setSelectedItems = (val) => {
    selectedItems.value = val
  }

  // const query = computed(() => {
  //   return useRoute().value.query
  // })
  const onSort = (sortProp) => {
    if (!sortProp) return
    if (sortProp === sort.value.by) {
      sort.value.dir = sort.value.dir === 'asc' ? 'desc' : 'asc'
    }
    sort.value.by = sortProp
  }

  const setFilter = () => {
    if (!shouldParseFilter.value) {
      filterBy.value = getDefaultFilter(route.name)
      return
    }
    const parsedFilterBy = parseFilter(query.value)
    parsedFilterBy.showArchived = parsedFilterBy.showArchived === 'true'
    parsedFilterBy.incomplete =
      parsedFilterBy.incomplete !== 'undefined' && parsedFilterBy.incomplete !== undefined
        ? JSON.parse(parsedFilterBy.incomplete)
        : undefined
    parsedFilterBy.daysAgo = parsedFilterBy.daysAgo || ''
    filterBy.value = parsedFilterBy
  }

  const onSetFilterByKey = (key, value) => {
    const filterValue = value === filterBy.value[key] && key !== 'currPage' ? '' : value
    const newFilterBy = {...filterBy.value, [key]: filterValue}
    if (key !== 'currPage') newFilterBy.currPage = 0
    filterBy.value = newFilterBy
    this.onSetQuery(newFilterBy, archiveBy.value)
  }

  const onSetFilter = (filter) => {
    filterBy.value = {...filter}
    onSetQuery(filterBy.value, archiveBy.value)
  }

  const onSetQuery = debounce(function (query, path) {
    const {params} = route || null

    const newRoute = {query}
    if (!isEmpty(params)) newRoute.params = params
    if (path && isEmpty(params)) newRoute.path = path
    router.push(newRoute)
  }, 200)

  const resetFilters = () => {
    filterBy.value = getDefaultFilter(route.name)
    onSetQuery({})
  }

  const onChangePage = ({to, diff}) => {
    let {currPage} = filterBy.value
    currPage = !currPage ? 0 : currPage
    currPage = +currPage + diff >= 0 ? +currPage + diff : currPage
    currPage = to !== undefined ? to : currPage
    onSetFilterByKey('currPage', currPage)
  }

  const onSelectAll = (items) => {
    if (selectedItems.value.length) return selectedItems.value.splice(0)
    selectedItems.value = items.slice()
  }

  const isSelected = (item) => {
    const idKey = item.id ? 'id' : '_id'
    return selectedItems.value.some((item) => item[idKey] === item[idKey])
  }

  const onSelectItem = (item) => {
    const idKey = item.id ? 'id' : '_id'
    const itemIdx = selectedItems.value.findIndex((i) => i[idKey] === item[idKey])
    if (itemIdx !== -1) selectedItems.value.splice(itemIdx, 1)
    else selectedItems.value.push(item)
  }

  const clearSelectedItems = () => {
    selectedItems.value = []
  }

  const onRemoveTag = (tag) => {
    if (tag.type === 'incomplete') onSetFilterByKey(tag.type, undefined)
    else if (tag.type === 'statuses') onSetFilterByKey(tag.type, [])
    else {
      onSetFilterByKey(tag.type, '')
    }
  }

  const sendAlert = (alertData) => {
    store.commit({
      type: 'app/setAlertData',
      alertData,
    })
  }

  onMounted(() => {
    this.setFilter()
  })

  return {
    shouldGather,
    selectedItems,
    sort,
    filterBy,
    setShouldGather,
    setSelectedItems,
    onSort,
    setFilter,
    onSetFilterByKey,
    onSetQuery,
    resetFilters,
    onSetFilter,
    onChangePage,
    onSelectAll,
    isSelected,
    onSelectItem,
    clearSelectedItems,
    onRemoveTag,
    sendAlert,
    showArchived,
    query,
    tagList,
    archiveBy,
    cmpName,
    shouldParseFilter,
  }
  // const { query,name } = useRouter()
  // const { cmpName } = useRoute()
  // const { filterBy, setFilter, onSetFilter, onSetFilterByKey, onSetQuery, resetFilters, onRemoveTag, clearSelectedItems, sendAlert } = useFilter({ query, cmpName })
  // const { sort, onSort } = useSort({ cmpName })
  // const { selectedItems, onSelectAll, isSelected, onSelectItem } = useSelection()
  // const { tagList, archiveBy } = useTags({ query, cmpName })
  // const { showArchived } = useShowArchived({ query })
  // const { onChangePage } = usePagination({ filterBy })

  // return {
  //   filterBy,
  //   setFilter,
  //   onSetFilter,
  //   onSetFilterByKey,
  //   onSetQuery,
  //   resetFilters,
  //   onRemoveTag,
  //   clearSelectedItems,
  //   sendAlert,
  //   sort,
  //   onSort,
  //   selectedItems,
  //   onSelectAll,
  //   isSelected,
  //   onSelectItem,
  //   tagList,
  //   archiveBy,
  //   showArchived,
  //   onChangePage,
  // }
}
