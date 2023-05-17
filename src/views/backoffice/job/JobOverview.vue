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

    <TemplatePicker v-if="viewType === 'cards'" />

    <h2 v-if="viewType === 'cards'" class="overview-subtitle">
      {{ $getTrans('my-jobs') }}
    </h2>
    <div class="overview-header">
      <div class="search-filter-container">
        <SearchBox :value="filterBy.txt" placeholder="search-jobs" @input="onSetFilterByKey" />
        <FilterBox
          :filter-by="filterBy"
          :filtered-job-count="filteredJobCount"
          @set-filter="onSetFilter"
          @reset-filters="resetFilters"
        />
      </div>
      <AppPagination
        :item-count="filteredJobCount || 0"
        :page-count="pageCount || 0"
        :curr-page="filterBy.currPage || 0"
        :items-per-page="filterBy.itemsPerPage"
        @change-page="onChangePage"
      />
    </div>
    <div v-if="selectedItems.length" class="actions-container grid">
      <div class="flex-center items-count">{{ selectedItems.length }}</div>
      <section class="inner-actions-container grid">
        <div class="flex justify-content-center">
          <h4>items Selected</h4>
          <ItemsIndicator :selected-items="selectedItems" />
        </div>
        <ActionsList
          :selected-item-count="selectedItems.length"
          :filter-by="filterBy"
          @archive="onArchiveSelected"
          @remove="onRemoveSelected"
          @change-page="onChangePage"
        />
      </section>
      <div class="pointer flex-center close-btn" @click="clearSelectedItems" v-html="$getSvg('close')"></div>
    </div>

    <div class="filter-count" :class="{shown: tagList.length || filterBy.txt}">
      <span>{{ tagList.length || filterBy.txt ? filterCount : '' }}</span>

      <div class="tag-list">
        <div v-for="tag in tagList" :key="tag.name" class="tag-preview">
          <span>{{ tag.name }}</span>
          <i class="material-icons" @click="onRemoveTag(tag)"> close </i>
        </div>
      </div>
    </div>

    <TableList
      :items="jobs"
      :selected-item-count="selectedItems.length"
      :total-item-count="totalJobCount"
      :should-gather="shouldGather"
      :items-per-page="filterBy.itemsPerPage"
      :max-item-count="totalJobCount"
      :filter-by="filterBy"
      :sort="sort"
      :is-fetching="isFetching"
      :is-selected="isSelected"
      :filtered-item-count="filteredJobCount"
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
// core
// import {watch} from 'vue'
// lib
// import {useRoute} from 'vue-router'
// cmps
import TableList from '@/cmps/backoffice/TableList.vue'
import SearchBox from '@/cmps/common/SearchBox.vue'
import ActionsList from '@/cmps/common/ActionsList.vue'
import TemplatePicker from '@/cmps/backoffice/job/TemplatePicker.vue'
import FilterBox from '@/cmps/common/FilterBox.vue'
import ItemsIndicator from '@/cmps/backoffice/ItemsIndicator.vue'
import AppPagination from '@/cmps/common/AppPagination.vue'

// composables
import {useFilter} from '@/composables/overview/useFilter'
import {useSort} from '@/composables/overview/useSort'
import {useSelection} from '@/composables/overview/useSelection'
import {useShouldGather} from '@/composables/overview/useShouldGather'
import {useTags} from '@/composables/overview/useTags'
import {usePagination} from '@/composables/overview/usePagination'
import {useAlert} from '@/composables/overview/useAlert'
import {useLoadItems} from '@/composables/overview/useLoadItems'
// services
import {msgService} from '@/services/msgService'

// import

export default {
  components: {
    TableList,
    SearchBox,
    ActionsList,
    TemplatePicker,
    FilterBox,
    ItemsIndicator,
    AppPagination,
  },
  setup() {
    // const route = useRoute()
    const {filterBy, onSetFilter, onSetFilterByKey, resetFilters, setFilterFromRoute} = useFilter('job/loadJobs')
    const {sort, onSort} = useSort()
    const {selectedItems, onSelectAll, onSelectItem, isSelected, clearSelectedItems} = useSelection()
    const {shouldGather, setShouldGather} = useShouldGather()
    const {tagList, onRemoveTag} = useTags({filterBy, onSetFilterByKey})
    const {onChangePage} = usePagination({filterBy, onSetFilterByKey})
    const {sendAlert} = useAlert()
    const {loadItems: loadJobs} = useLoadItems({
      dispatchName: 'job/loadJobs',
      filterBy,
      sort,
      shouldGather,
      setShouldGather,
    })
    // watch(route, () => {
    //   clearSelectedItems()
    //   // this.setFilterFromRoute()
    //   loadJobs()
    // })

    // async function  loadJobs() {

    // }
    return {
      filterBy,
      onSetFilter,
      onSetFilterByKey,
      resetFilters,
      setFilterFromRoute,
      sort,
      onSort,
      selectedItems,
      onSelectAll,
      onSelectItem,
      clearSelectedItems,
      isSelected,
      shouldGather,
      setShouldGather,
      tagList,
      onRemoveTag,
      onChangePage,
      sendAlert,
      loadJobs,
      // setSelectedItems,
    }
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
  async created() {
    this.setPreferredView()
    await this.loadJobs()
    await this.$store.dispatch('template/loadDefaultTemplates')
  },

  methods: {
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
      sessionStorage.setItem('jobViewType', viewType)
    },

    setPreferredView() {
      const preferredViewType = sessionStorage.getItem('jobViewType')
      if (!preferredViewType) return
      this.$store.commit('job/setViewType', {viewType: preferredViewType})
    },
  },
}
</script>
