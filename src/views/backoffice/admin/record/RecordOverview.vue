<template>
  <section class="record-overview overview">
    <div class="overview-header">
      <record-filter :filterBy="filterBy" @set-filter="onSetFilterByKey" />

      <list-actions
        :selectedItemCount="selectedItems.length"
        :filterBy="filterBy"
        :itemCount="totalRecordCount"
        :pageCount="pageCount"
        :currPage="filterBy.currPage || 0"
        :itemsPerPage="filterBy.itemsPerPage"
        @change-page="onChangePage"
      />
    </div>

    <table-list
      :items="records"
      :itemsPerPage="filterBy.itemsPerPage"
      :totalItemCount="totalRecordCount"
      :sort="sort"
      :isFetching="isFetching"
      :isSelected="isSelected"
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
  async created() {
    await this.loadRecords()
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

  methods: {
    loadRecords() {
      return this.$store.dispatch('record/loadRecords', {
        filterBy: {...this.filterBy},
        sort: this.sort,
      })
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

  components: {
    RecordFilter,
    TableList,
    ListActions,
  },
}
</script>
