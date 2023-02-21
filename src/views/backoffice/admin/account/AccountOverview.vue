<template>
  <section class="account-overview overview">
    <div class="overview-header">
      <i @click="onAddUser" class="material-icons add-btn">add</i>

      <list-actions :selectedItemCount="selectedItems.length" :filterBy="filterBy" :itemCount="usersToShow.length"
        :currPage="filterBy.currPage || 0" :itemsPerPage="filterBy.itemsPerPage" @change-page="onChangePage" />
    </div>

    <table-list :items="usersToShow" :currPage="filterBy.currPage" :itemsPerPage="filterBy.itemsPerPage"
      :totalItemCount="usersToShow.length" :sort="sort" :isFetching="isFetching" :isSelected="isSelected"
      @change-page="onChangePage" @sort="onSort" />
  </section>
</template>

<script>
import { getSortFunc } from "@/services/utilService"
// import OverviewMixin from "@/mixins/OverviewMixin.js";
import TableList from "@/cmps/backoffice/TableList.vue"
import ListActions from "@/cmps/backoffice/ListActions.vue"

export default {
  // mixins: [OverviewMixin],

  async created() {
    await this.loadUsers()
  },

  computed: {
    users() {
      return this.$store.getters["user/users"]
    },

    usersToShow() {
      return this.users && this.users.slice().sort(getSortFunc(this.sort))
    },

    isFetching() {
      return this.$store.getters["user/isFetching"]
    },
  },

  methods: {
    async loadUsers() {
      await this.$store.dispatch("user/loadUsers")
    },

    onAddUser() {
      this.$store.dispatch("app/toggleModal", {
        type: "AccountEdit",
        data: null,
      })
    },
  },
  components: { TableList, ListActions },
}
</script>
