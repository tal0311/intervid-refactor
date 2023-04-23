<template>
  <section class="record-overview overview">
    <div class="overview-header">
      <RecordFilter :filter-by="filterBy" @set-filter="onSetFilterByKey" />

      <ListActions
        :selected-item-count="selectedItems.length"
        :filter-by="filterBy"
        :item-count="totalRecordCount"
        :page-count="pageCount"
        :curr-page="filterBy.currPage || 0"
        :items-per-page="filterBy.itemsPerPage"
        @change-page="onChangePage"
      />
    </div>

    <TableList
      :items="records"
      :items-per-page="filterBy.itemsPerPage"
      :total-item-count="totalRecordCount"
      :sort="sort"
      :is-fetching="isFetching"
      :is-selected="isSelected"
      @sort="onSort"
    />
  </section>
</template>

<script>
// cmps
import RecordFilter from '@/cmps/backoffice/admin/RecordFilter.vue'
import TableList from '@/cmps/backoffice/TableList.vue'
import ListActions from '@/cmps/backoffice/ListActions.vue'
// composables
import {useFilter} from '@/composables/overview/useFilter'
import {useSort} from '@/composables/overview/useSort'
import {useSelection} from '@/composables/overview/useSelection'
import {usePagination} from '@/composables/overview/usePagination'

export default {
  components: {
    RecordFilter,
    TableList,
    ListActions,
  },
  setup() {
    const {filterBy, onSetFilterByKey, setFilterFromRoute} = useFilter()
    const {onChangePage} = usePagination({filterBy, onSetFilterByKey})
    const {sort, onSort} = useSort()
    const {selectedItems, isSelected} = useSelection()

    return {
      filterBy,
      onSetFilterByKey,
      setFilterFromRoute,
      sort,
      selectedItems,
      isSelected,
      onChangePage,
      onSort,
    }
  },

  computed: {
    records() {
      return this.$store.getters['record/records']
    },

    // recordsToShow() {
    //   // return this.records.slice().sort(getSortFunc(this.sort))

    //   return this.records.slice()
    // },

    totalRecordCount() {
      return this.$store.getters['record/totalRecordCount']
    },

    isFetching() {
      return this.$store.getters['record/isFetching']
    },

    pageCount() {
      return Math.ceil(this.totalRecordCount / this.filterBy.itemsPerPage)
    },
  },

  watch: {
    $route() {
      this.setFilterFromRoute()
      this.loadRecords()
    },
    sort: {
      handler() {
        this.loadRecords()
      },
      deep: true,
    },
  },
  async created() {
    await this.loadRecords()
  },

  methods: {
    loadRecords() {
      return this.$store.dispatch('record/loadRecords', {
        filterBy: {...this.filterBy},
        sort: this.sort,
      })
    },
  },
}
</script>
