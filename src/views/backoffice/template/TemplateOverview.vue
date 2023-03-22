<template>
  <section class="overview template-overview">
    <h2 class="overview-title">
      {{ overviewTitle }}
    </h2>
    <div class="overview-header">
      <div class="search-filter-container">
        <search-box :value="filterBy.txt" @input="onSetFilterByKey" placeholder="search-templates" />
        <filter-box @set-filter="onSetFilterByKey" :filter-by="filterBy" />
        <button class="create-template-btn" :class="{empty: !templatesToShow.length}" @click="onCreateTemplate">
          <i class="material-icons">add</i>
        </button>
      </div>

      <list-actions
        :selected-item-count="selectedItems.length"
        :filter-by="filterBy"
        :item-count="filteredTemplates.length"
        :curr-page="filterBy.currPage || 0"
        :items-per-page="filterBy.itemsPerPage"
        @archive="onArchiveSelected"
        @remove="onRemoveSelected"
        @change-page="onChangePage"
      />
    </div>

    <table-list
      :items="templatesToShow"
      :selected-item-count="selectedItems.length"
      :total-item-count="filteredTemplates.length"
      :items-per-page="filterBy.itemsPerPage"
      :filter-by="filterBy"
      :sort="sort"
      :is-fetching="isFetching"
      :is-selected="isSelected"
      @select-all="onSelectAll"
      @sort="onSort"
      @select="onSelectItem"
    />
  </section>
</template>

<script>
// cmps
import SearchBox from '@/cmps/common/SearchBox.vue'
import TableList from '@/cmps/backoffice/TableList.vue'
import ListActions from '@/cmps/backoffice/ListActions.vue'
import FilterBox from '@/cmps/common/FilterBox.vue'
// composables
import {useFilter} from '@/composables/overview/useFilter'
import {useSort} from '@/composables/overview/useSort'
import {useSelection} from '@/composables/overview/useSelection'
import {usePagination} from '@/composables/overview/usePagination'

// services
import {filterTemplates} from '@/services/templateService'
import {msgService} from '@/services/msgService'

export default {
  setup() {
    // TODO: No idea if this works, the route is blocked
    const {filterBy, onSetFilterByKey} = useFilter()
    const {sort, onSort} = useSort()
    const {selectedItems, isSelected, onSelectAll, onSelectItem, clearSelectedItems} = useSelection()
    const {onChangePage} = usePagination({filterBy, onSetFilterByKey})

    return {
      filterBy,
      sort,
      onSort,
      selectedItems,
      clearSelectedItems,
      onSelectAll,
      onSelectItem,
      isSelected,
      onChangePage,
    }
  },
  async created() {
    await this.loadTemplates()
  },

  computed: {
    templates() {
      return this.$store.getters['template/templates']
    },

    filteredTemplates() {
      return filterTemplates(this.templates, this.filterBy)
    },

    templatesToShow() {
      const templates = this.filteredTemplates.slice().sort(this.$utilService.getSortFunc(this.sort))
      return this.$utilService.paginate(templates, this.filterBy.currPage, this.filterBy.itemsPerPage)
    },

    isFetching() {
      return this.$store.getters['template/isFetching']
    },

    overviewTitle() {
      return this.filterBy.showArchived
        ? `${this.$getTrans('templates')} (${this.$getTrans('archive-lowercase')})`
        : this.$getTrans('templates')
    },
  },

  methods: {
    async loadTemplates() {
      await this.$store.dispatch('template/loadTemplates')
    },

    onCreateTemplate() {
      this.$router.push('/backoffice/template/edit')
    },

    async onArchiveSelected() {
      for (const template of this.selectedItems) {
        await this.$store.dispatch('template/toggleArchivedTemplate', {
          template,
        })
      }
      if (!this.templatesToShow.length && this.filterBy.currPage) {
        this.onChangePage({diff: -1, cmpName: this.$route.name})
      }
      this.sendAlert(msgService.archive('template', !this.filterBy.showArchived, this.selectedItems.length))
      this.clearSelectedItems()
    },

    async onRemoveSelected() {
      for (const template of this.selectedItems) {
        await this.$store.dispatch('template/removeTemplate', {
          templateId: template._id,
        })
      }
      if (!this.templatesToShow.length && this.filterBy.currPage) {
        this.onChangePage({diff: -1, cmpName: this.$route.name})
      }
      this.sendAlert(msgService.remove('template', this.selectedItems.length))
      this.clearSelectedItems()
    },
  },

  watch: {
    $route() {
      this.clearSelectedItems()
    },
  },

  components: {
    TableList,
    SearchBox,
    ListActions,
    FilterBox,
  },
}
</script>
