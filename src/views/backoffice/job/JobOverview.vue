<template>
  <section class="overview job-overview">
    <div class="title-container">
      <h2 class="overview-title">
        {{ $getTrans('jobs') }}
        <div class="view-btns">
          <i
            class="material-icons info-tooltip"
            :data-tooltip="$getTrans('list-view')"
            :class="{selected: viewType === 'list'}"
            @click="setView('list')"
            >view_list</i
          >
          <i
            class="material-icons info-tooltip"
            :data-tooltip="$getTrans('card-view')"
            :class="{selected: viewType === 'cards'}"
            @click="setView('cards')"
            >view_module</i
          >
        </div>
      </h2>

      <button class="create-job-btn" @click="$router.push({name: 'JobEdit'})">
        <i class="material-icons">add</i>
        <span>{{ $getTrans('create-new-job') }}</span>
      </button>
    </div>

    <template-picker v-if="viewType === 'cards'" />

    <h2 v-if="viewType === 'cards'" class="overview-subtitle">
      {{ $getTrans('my-jobs') }}
    </h2>
    <div class="overview-header">
      <div class="search-filter-container">
        <search-box :value="filterBy.txt" @input="onSetFilterByKey" placeholder="search-jobs" />
        <filter-box
          @set-filter="onSetFilter"
          @reset-filters="resetFilters"
          :filterBy="filterBy"
          :filteredJobCount="filteredJobCount"
        />
      </div>

      <list-actions
        :selectedItemCount="selectedItems.length"
        :filterBy="filterBy"
        :itemCount="filteredJobCount || 0"
        :currPage="filterBy.currPage || 0"
        :pageCount="pageCount || 0"
        :itemsPerPage="filterBy.itemsPerPage"
        @archive="onArchiveSelected"
        @remove="onRemoveSelected"
        @change-page="onChangePage"
      />
    </div>

    <div class="filter-count" :class="{shown: tagList.length || filterBy.txt}">
      <span>{{ tagList.length || filterBy.txt ? filterCount : '' }}</span>

      <div class="tag-list">
        <div class="tag-preview" v-for="tag in tagList" :key="tag.name">
          <span>{{ tag.name }}</span>
          <i class="material-icons" @click="onRemoveTag(tag)"> close </i>
        </div>
      </div>
    </div>

    <table-list
      :items="jobs"
      :selectedItemCount="selectedItems.length"
      :totalItemCount="totalJobCount"
      :shouldGather="shouldGather"
      :itemsPerPage="filterBy.itemsPerPage"
      :maxItemCount="totalJobCount"
      :filterBy="filterBy"
      :sort="sort"
      :isFetching="isFetching"
      :isSelected="isSelected"
      :filteredItemCount="filteredJobCount"
      @select-all="onSelectAll"
      @sort="onSort"
      @select="onSelectItem"
      @load-next-items="onLoadNextJobs"
      @load-items="loadJobs"
      @remove="onRemoveSelected"
    />
  </section>
</template>

<script>
// cmps
import TableList from '@/cmps/backoffice/TableList.vue'
import SearchBox from '@/cmps/common/SearchBox.vue'
import ListActions from '@/cmps/backoffice/ListActions.vue'
import TemplatePicker from '@/cmps/backoffice/job/TemplatePicker.vue'
import FilterBox from '@/cmps/common/FilterBox.vue'
// composables
import {useFilter} from '@/composables/useFilter.js'
import {useSort} from '@/composables/useSort.js'
import {useSelection} from '@/composables/useSelection.js'
import {useShouldGather} from '@/composables/overview/useShouldGather.js'
import {useTags} from '@/composables/useTags.js'
import {usePagination} from '@/composables/usePagination.js'
import {useAlert} from '@/composables/overview/useAlert'

// services
import {msgService} from '@/services/msgService'

export default {
  setup() {
    const {filterBy, onSetFilter, onSetFilterByKey, resetFilters} = useFilter()
    const {sort, onSort} = useSort()
    const {selectedItems, onSelectAll, onSelectItem, isSelected} = useSelection()
    const {shouldGather, setShouldGather} = useShouldGather()
    const {tagList, onRemoveTag} = useTags({filterBy, onSetFilterByKey})
    const {onChangePage} = usePagination({onSetFilterByKey})
    const {sendAlert} = useAlert()

    return {
      filterBy,
      onSetFilter,
      onSetFilterByKey,
      resetFilters,
      sort,
      onSort,
      selectedItems,
      onSelectAll,
      onSelectItem,
      isSelected,
      shouldGather,
      setShouldGather,
      tagList,
      onRemoveTag,
      onChangePage,
      sendAlert,
      // setSelectedItems,
    }
  },
  async created() {
    this.setPreferredView()
    await this.loadJobs()
    await this.$store.dispatch('template/loadDefaultTemplates')
  },

  computed: {
    jobs() {
      return this.$store.getters['job/jobs']
    },

    pageCount() {
      return this.$store.getters['job/pageCount']
    },

    totalJobCount() {
      return this.$store.getters['job/totalJobCount']
    },

    filteredJobCount() {
      return this.$store.getters['job/filteredJobCount']
    },

    isFetching() {
      return this.$store.getters['job/isFetching']
    },

    viewType() {
      return this.$store.getters['job/viewType']
    },

    lng() {
      return this.$store.getters['app/lang']
    },

    filterCount() {
      const {$getTrans} = this
      if (this.filteredJobCount > 1)
        return `${$getTrans('showing')} ${this.filteredJobCount} ${$getTrans('jobs').toLowerCase()}`
      else if (this.filteredJobCount === 1) {
        return this.lng === 'en'
          ? `${$getTrans('showing')} ${this.filteredJobCount} ${$getTrans('job').toLowerCase()}`
          : `${$getTrans('showing')} ${$getTrans('job').toLowerCase()} ${this.filteredJobCount}`
      } else return ''
    },
  },

  methods: {
    async loadJobs() {
      await this.$store.dispatch('job/loadJobs', {
        filterBy: this.filterBy,
        sort: this.sort,
        shouldGather: this.shouldGather,
      })
      if (this.shouldGather) this.setShouldGather(false)
    },

    async onArchiveSelected() {
      await this.$store.dispatch('job/toggleArchiveJob', {
        jobs: this.selectedItems,
      })
      if (!this.jobs.length && this.filterBy.currPage > 0) {
        this.onChangePage({diff: -1, cmpName: this.$route.name})
      } else if (!this.jobs.length && this.filterBy.currPage === 0) {
        this.loadJobs()
      }
      this.clearSelectedItems()
    },

    async onRemoveSelected(selectedJob) {
      if (selectedJob) this.$store.dispatch('job/removeJob', {jobId: selectedJob._id})
      else {
        for (const job of this.selectedItems) {
          await this.$store.dispatch('job/removeJob', {jobId: job._id})
        }
      }
      if (!this.jobs.length && this.filterBy.currPage) {
        this.onChangePage({diff: -1, cmpName: this.$route.name})
      }
      this.sendAlert(msgService.remove('job', this.selectedItems.length))
      this.clearSelectedItems()
    },

    onLoadNextJobs() {
      this.filterBy.currPage = this.filterBy.currPage + 1
      this.setShouldGather(true)
      this.loadJobs()
    },

    setView(viewType) {
      this.$store.commit('job/setViewType', {viewType})
      // GOD NO, PLEASE NO
      sessionStorage.setItem('jobViewType', viewType)
    },

    setPreferredView() {
      const preferredViewType = sessionStorage.getItem('jobViewType')
      if (!preferredViewType) return
      this.$store.commit('job/setViewType', {viewType: preferredViewType})
    },
  },

  watch: {
    $route() {
      this.clearSelectedItems()
      this.setFilterFromRoute()
      this.loadJobs()
    },
    sort: {
      handler() {
        this.loadJobs()
      },
      deep: true,
    },
  },

  components: {
    TableList,
    SearchBox,
    ListActions,
    TemplatePicker,
    FilterBox,
  },
}
</script>
