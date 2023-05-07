<template>
  <div class="activity-overview overview">
    <div class="overview-header">
      <ActivityFilter :filter-by="filterBy" :users="users" @set-filter="onSetFilterByKey" />

      <ListActions
        :filter-by="filterBy"
        :item-count="totalActivityCount"
        :curr-page="filterBy.currPage || 0"
        :items-per-page="filterBy.itemsPerPage"
        @change-page="onChangePage"
      />
    </div>

    <TableList
      :items="activities"
      :items-per-page="filterBy.itemsPerPage"
      :total-item-count="totalActivityCount"
      :sort="sort"
      :is-fetching="isFetching"
      :is-selected="isSelected"
      @change-page="onChangePage"
      @sort="onSort"
    />
  </div>
</template>

<script>
// cmps
import ActivityFilter from '@/cmps/backoffice/admin/ActivityFilter.vue'
import TableList from '@/cmps/backoffice/TableList.vue'
import ListActions from '@/cmps/backoffice/ListActions.vue'
// composables
import {useFilter} from '@/composables/overview/useFilter'
import {useSort} from '@/composables/overview/useSort'
import {useSelection} from '@/composables/overview/useSelection'
import {usePagination} from '@/composables/overview/usePagination'
// services

export default {
  components: {ActivityFilter, TableList, ListActions},
  setup() {
    const {filterBy, onSetFilterByKey, setFilterFromRoute} = useFilter()
    const {sort, onSort} = useSort()
    const {selectedItems, isSelected} = useSelection()
    const {onChangePage} = usePagination({filterBy, onSetFilterByKey})

    return {
      filterBy,
      onSetFilterByKey,
      setFilterFromRoute,
      onChangePage,
      sort,
      onSort,
      selectedItems,
      isSelected,
    }
  },

  computed: {
    users() {
      return this.$store.getters['user/users']
    },

    activities() {
      return this.$store.getters['activity/activities']
        .map((activity) => ({...activity, start: new Date(activity.start)}))
        .sort(this.$utilService.getSortFunc(this.sort))
    },

    totalActivityCount() {
      return this.$store.getters['activity/totalActivityCount']
    },

    isFetching() {
      return this.$store.getters['activity/isFetching']
    },
  },

  watch: {
    $route() {
      this.setFilterFromRoute()
      this.loadActivities()
    },
  },

  created() {
    this.loadActivities()
    this.loadUsers()
  },

  methods: {
    loadActivities() {
      this.$store.dispatch('activity/loadActivities', {
        filterBy: {...this.filterBy},
      })
    },

    loadUsers() {
      this.$store.dispatch('user/loadUsers')
    },
  },
}
</script>
