<template>
  <div class="activity-overview overview">
    <div class="overview-header">
      <activity-filter :filterBy="filterBy" @set-filter="onSetFilterByKey" :users="users" />

      <list-actions
        :filterBy="filterBy"
        :itemCount="totalActivityCount"
        :currPage="filterBy.currPage || 0"
        :itemsPerPage="filterBy.itemsPerPage"
        @change-page="onChangePage"
      />
    </div>

    <table-list
      :items="activities"
      :itemsPerPage="filterBy.itemsPerPage"
      :totalItemCount="totalActivityCount"
      :sort="sort"
      :isFetching="isFetching"
      :isSelected="isSelected"
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
import {useOverview} from '@/composables/useOverview'
// services

export default {
  setup() {
    const {filterBy, sort, selectedItems, isSelected, onChangePage, onSort} = useOverview()
    return {filterBy, sort, selectedItems, isSelected, onChangePage, onSort}
  },

  created() {
    this.loadActivities()
    this.loadUsers()
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

  watch: {
    $route() {
      this.setFilterFromRoute()
      this.loadActivities()
    },
  },

  components: {ActivityFilter, TableList, ListActions},
}
</script>
