import {parseFilter, debounce, isEmpty} from '@/services/utilService.js'
import {reactive, ref} from 'vue'
import {useRoute} from 'vue-router'
import {getDefaultFilter, getDefaultSort} from '../services/constData.js'

export default {
  data() {
    return {
      shouldGather: false,
      selectedItems: [],
      sort: getDefaultSort(this.$route.name),
      filterBy: getDefaultFilter(this.$route.name),
    }
  },

  created() {
    this.setFilter()
    // const showArchived = this.$route.path.includes('archive')
    // filterBy.value.showArchived = showArchived
  },

  computed: {
    query() {
      return this.$route.query
    },

    cmpName() {
      return this.$route.name
    },

    showArchived() {
      return this.$route.path.includes('archive')
    },

    shouldParseFilter() {
      return !!Object.values(this.query).length
    },

    archiveBy() {
      switch (this.cmpName) {
        case 'ApplicantOverview':
          return 'applicant'
        case 'JobOverview':
          return 'job'
        case 'TemplateOverview':
          return 'template'
        default:
          return ''
      }
    },

    tagList() {
      const queries = this.$route.query
      const tags = []
      for (const key in queries) {
        if (key === 'daysAgo' && queries[key]) tags.push({name: this.getTrans('date'), type: 'daysAgo'})
        if (key === 'incomplete' && queries[key] !== undefined) {
          const tag =
            queries[key] === 'false'
              ? {name: this.getTrans('complete-interviews'), type: 'incomplete'}
              : {name: this.getTrans('incomplete-interviews'), type: 'incomplete'}
          tags.push(tag)
        }
        if (key === 'showArchived' && queries[key] === 'true') {
          tags.push({name: this.getTrans('archive'), type: 'showArchived'})
        }
        if (key === 'statuses' && queries[key].length) tags.push({name: this.getTrans('status'), type: 'statuses'})
      }
      return tags
    },
  },

  methods: {
    onSort(sortProp) {
      if (!sortProp) return
      if (sortProp === this.sort.by) {
        this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'
      }
      this.sort.by = sortProp
    },

    setFilter() {
      if (!this.shouldParseFilter) {
        filterBy.value = getDefaultFilter(this.$route.name)
        return
      }
      const filterBy = parseFilter(query.value)
      filterBy.showArchived = filterBy.showArchived === 'true'
      filterBy.incomplete =
        filterBy.incomplete !== 'undefined' && filterBy.incomplete !== undefined
          ? JSON.parse(filterBy.incomplete)
          : undefined
      filterBy.daysAgo = filterBy.daysAgo ? filterBy.daysAgo : ''
      filterBy.value = filterBy
    },

    resetFilters() {
      filterBy.value = getDefaultFilter(this.$route.name)
      this.onSetQuery({})
    },

    onChangePage({to, diff}) {
      let {currPage} = filterBy.value
      currPage = !currPage ? 0 : currPage
      currPage = +currPage + diff >= 0 ? +currPage + diff : currPage
      currPage = to !== undefined ? to : currPage
      this.onSetFilterByKey('currPage', currPage)
    },

    onSetFilterByKey(key, value) {
      const filterValue = value === filterBy.value[key] && key !== 'currPage' ? '' : value
      const filterBy = {...filterBy.value, [key]: filterValue}
      if (key !== 'currPage') filterBy.currPage = 0
      filterBy.value = filterBy
      this.onSetQuery(filterBy, this.archiveBy)
    },

    onSetFilter(updatedFilterBy) {
      filterBy.value = {...updatedFilterBy}
      this.onSetQuery(filterBy.value, this.archiveBy)
    },

    onSetQuery: debounce(function (query, path) {
      const {params} = this.$route || null

      const route = {query}
      if (!isEmpty(params)) route.params = params
      if (path && isEmpty(params)) route.path = path
      this.$router.push(route)
    }, 200),

    onSelectAll(items) {
      if (this.selectedItems.length) return this.selectedItems.splice(0)
      this.selectedItems = items.slice()
    },

    isSelected(selectedItem) {
      const idKey = selectedItem.id ? 'id' : '_id'
      return !!this.selectedItems.find((item) => item[idKey] === selectedItem[idKey])
    },

    onSelectItem(item) {
      const idKey = item.id ? 'id' : '_id'
      const itemIdx = this.selectedItems.findIndex((i) => i[idKey] === item[idKey])
      if (itemIdx !== -1) this.selectedItems.splice(itemIdx, 1)
      else this.selectedItems.push(item)
    },

    onRemoveTag(tag) {
      if (tag.type === 'incomplete') this.onSetFilterByKey(tag.type, undefined)
      else if (tag.type === 'statuses') this.onSetFilterByKey(tag.type, [])
      else {
        this.onSetFilterByKey(tag.type, '')
      }
    },

    clearSelectedItems() {
      this.selectedItems = []
    },

    sendAlert(alertData) {
      this.$store.commit({
        type: 'app/setAlertData',
        alertData,
      })
    },
  },
}

export function useOverview({}) {
  const {name} = useRoute()

  const shouldGather = ref(false)
  const selectedItems = reactive([])
  const filterBy = reactive(getDefaultFilter(name))
  const sort = reactive(getDefaultSort(name))

  const query = computed(() => {
    return useRoute().value.query
  })

  const shouldParseFilter = computed(() => {
    return !!Object.values(query.value).length
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
      filterBy.value = getDefaultFilter(name)
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

  return {
    shouldGather,
    selectedItems,
    sort,
    filterBy,
    setShouldGather,
    setSelectedItems,
    onSort,
    setFilter,
  }
  // const { query } = useRouter()
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
