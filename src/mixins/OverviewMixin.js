import { parseFilter, debounce, isEmpty } from '@/services/utilService.js'
import { getDefaultFilter, getDefaultSort } from '../services/constData.js'

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
    // this.filterBy.showArchived = showArchived
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
        if (key === 'daysAgo' && queries[key]) tags.push({ name: this.getTrans('date'), type: 'daysAgo' })
        if (key === 'incomplete' && queries[key] !== undefined) {
          const tag =
            queries[key] === 'false'
              ? { name: this.getTrans('complete-interviews'), type: 'incomplete' }
              : { name: this.getTrans('incomplete-interviews'), type: 'incomplete' }
          tags.push(tag)
        }
        if (key === 'showArchived' && queries[key] === 'true') {
          tags.push({ name: this.getTrans('archive'), type: 'showArchived' })
        }
        if (key === 'statuses' && queries[key].length) tags.push({ name: this.getTrans('status'), type: 'statuses' })
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
        this.filterBy = getDefaultFilter(this.$route.name)
        return
      }
      const filterBy = parseFilter(this.query)
      filterBy.showArchived = filterBy.showArchived === 'true'
      filterBy.incomplete =
        filterBy.incomplete !== 'undefined' && filterBy.incomplete !== undefined
          ? JSON.parse(filterBy.incomplete)
          : undefined
      filterBy.daysAgo = filterBy.daysAgo ? filterBy.daysAgo : ''
      this.filterBy = filterBy
    },

    resetFilters() {
      this.filterBy = getDefaultFilter(this.$route.name)
      this.onSetQuery({})
    },

    onChangePage({ to, diff }) {
      let { currPage } = this.filterBy
      currPage = !currPage ? 0 : currPage
      currPage = +currPage + diff >= 0 ? +currPage + diff : currPage
      currPage = to !== undefined ? to : currPage
      this.onSetFilterByKey('currPage', currPage)
    },

    onSetFilterByKey(key, value) {
      const filterValue = value === this.filterBy[key] && key !== 'currPage' ? '' : value
      const filterBy = { ...this.filterBy, [key]: filterValue }
      if (key !== 'currPage') filterBy.currPage = 0
      this.filterBy = filterBy
      this.onSetQuery(filterBy, this.archiveBy)
    },

    onSetFilter(updatedFilterBy) {
      this.filterBy = { ...updatedFilterBy }
      this.onSetQuery(this.filterBy, this.archiveBy)
    },

    onSetQuery: debounce(function (query, path) {
      const { params } = this.$route || null

      const route = { query }
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
