<template>
  <section class="account-overview overview">
    <div class="overview-header">

      <i @click="onAddUser" class="material-icons add-btn">add</i>
      <AppPagination :item-count="usersToShow.length" :curr-page="filterBy.currPage || 0"
        :items-per-page="filterBy.itemsPerPage || 10" @change-page="onChangePage" />
    </div>

    <TableList :items="usersToShow" :curr-page="filterBy.currPage" :items-per-page="filterBy.itemsPerPage"
      :total-item-count="usersToShow.length" :sort="sort" :is-fetching="isFetching" :is-selected="isSelected"
      @change-page="onChangePage" @sort="onSort" />
  </section>
</template>

<script>
// cmps
import TableList from '@/cmps/backoffice/TableList.vue'
import AppPagination from '@/cmps/common/AppPagination.vue'
// composables
import { useFilter } from '@/composables/overview/useFilter'
import { useSort } from '@/composables/overview/useSort'
import { useSelection } from '@/composables/overview/useSelection'
import { usePagination } from '@/composables/overview/usePagination'

export default {
  components: { TableList, },
  setup() {
    const { filterBy, onSetFilterByKey } = useFilter()
    const { sort, onSort, sortFunc } = useSort()
    const { selectedItems, isSelected } = useSelection()
    const { onChangePage } = usePagination({ filterBy, onSetFilterByKey })

    return { filterBy, onChangePage, sort, onSort, sortFunc, selectedItems, isSelected }
  },

  computed: {
    users() {
      return this.$store.getters['user/users']
    },

    usersToShow() {
      return this.users && this.users.slice().sort(this.sortFunc)
    },

    isFetching() {
      return this.$store.getters['user/isFetching']
    },
  },
  async created() {
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      await this.$store.dispatch('user/loadUsers')
    },
    onAddUser() {
      this.$store.dispatch('app/toggleModal', {
        type: 'AccountEdit',
        data: null,
      })
    },
  },
  components: { TableList, AppPagination },
}
</script>
