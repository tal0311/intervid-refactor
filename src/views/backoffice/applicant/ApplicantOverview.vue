<template>
  <section class="overview applicant-overview">
    <h2 class="overview-title">
      <RouterLink v-if="job" class="material-icons" to="/backoffice/job">chevron_left</RouterLink>
      {{ overviewTitle }}
    </h2>
    <div class="overview-header">
      <div class="search-filter-container">
        <!-- second option, need to check with tal -->
        <!-- <search-box v-model="filterByTxt" placeholder="search-applicants" /> -->
        <!-- In script: -->
        <!-- const filterByTxt = computed({
          get: () => filterBy.value.txt,
          set:  onSetFilterByKey,
        }) -->
        <SearchBox :value="filterBy.txt" @input="onSetFilterByKey" placeholder="search-applicants" />
        <FilterBox
          @set-filter="onSetFilter"
          @reset-filters="resetFilters"
          :filter-by="filterBy"
          :is-applicant-overview="true"
          :filtered-applicant-count="filteredApplicantCount"
        />
      </div>
      <div class="overview-actions">
        <AppPagination
          v-if="pageCount > 1"
          :item-count="filteredApplicantCount"
          :page-count="pageCount || 0"
          :curr-page="filterBy.currPage || 0"
          :items-per-page="filterBy.itemsPerPage"
          @change-page="onChangePage"
        />
     
        <share-job v-if="job && job.applicantSummary.applicantCount" :job="job" />
      </div>
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

    <TableList
      :items="applicants"
      :selected-item-count="selectedItems && selectedItems.length"
      :total-item-count="applicants && applicants.length"
      :max-item-count="applicantCount"
      :filtered-item-count="filteredApplicantCount"
      :items-per-page="filterBy.itemsPerPage"
      :sort="sort"
      :filter-by="filterBy"
      :is-fetching="isFetching"
      :should-gather="shouldGather"
      :is-selected="isSelected"
      @select-all="onSelectAll"
      @sort="onSort"
      @select="onSelectItem"
      @load-next-items="onLoadNextApplicants"
    />

    <div v-if="selectedItems.length" class="actions-container grid">
      <div class="flex-center iteams-count">{{ selectedItems.length }}</div>
      <section class="inner-actions-container grid">
        <div class="flex justify-content-center">
          <h4>Iteams Selected</h4>
          <ItemsIndicator :selectedItems="selectedItems" />
        </div>
        <ActionsList
          :items="applicants"
          :selected-item-count="selectedItems && selectedItems.length"
          :filter-by="filterBy"
          :is-locked-item-selected="isLockedItemSelected"
          @select-all="onSelectAll"
          @archive="onArchiveSelected"
          @toggle-read="toggleIsRead"
          @remove="onRemoveSelected"
          @select="onSelectItem"
        />
      </section>
      <div @click="clearSelectedItems" class="pointer flex-center close-btn" v-html="$getSvg('close')"></div>
    </div>
  </section>
</template>

<script>
// core
import {watch} from 'vue'
// lib
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
// cmps
import AppPagination from '@/cmps/common/AppPagination.vue'
import ActionsList from '@/cmps/common/ActionsList.vue'
import TableList from '@/cmps/backoffice/TableList.vue'
import SearchBox from '@/cmps/common/SearchBox.vue'
import FilterBox from '@/cmps/common/FilterBox.vue'
// import ListActions from '@/cmps/backoffice/ListActions.vue'
import ItemsIndicator from '@/cmps/backoffice/ItemsIndicator.vue'
import ShareJob from '@/cmps/common/ShareJob.vue'
// composables
import {useFilter} from '@/composables/overview/useFilter'
import {useSort} from '@/composables/overview/useSort'
import {useTags} from '@/composables/overview/useTags'
import {useSelection} from '@/composables/overview/useSelection'
import {useShouldGather} from '@/composables/overview/useShouldGather'
import {usePagination} from '@/composables/overview/usePagination'
// services
// import {userService} from '@/services/userService'
// misc
import {advancedPermsMap} from '@/services/constData'
// import {useLoadItems} from '@/composables/overview/useLoadItems'

export default {
  name: 'ApplicantOverview',
  setup() {
    const store = useStore()
    const route = useRoute()

    const {filterBy, onSetFilterByKey, onSetFilter, setFilterFromRoute, resetFilters, onDeleteFilterByKey} = useFilter()
    const {sort, onSort} = useSort()
    const {selectedItems, setSelectedItems, onSelectAll, isSelected, onSelectItem, clearSelectedItems} = useSelection()
    const {shouldGather, setShouldGather} = useShouldGather()
    const {onChangePage} = usePagination({filterBy, onSetFilterByKey})
    const {tagList, onRemoveTag} = useTags({onSetFilterByKey})
    // const {loadItems: loadApplicants} = useLoadItems({
    //   dispatchName: 'job/loadApplicants',
    //   filterBy,
    //   sort,
    //   shouldGather,
    //   setShouldGather,
    // })

    watch(route, () => {
      clearSelectedItems()
      // this.setFilterFromRoute()
      loadApplicants()
    })
    async function loadApplicants() {
      const {jobId} = route.params
      if (jobId) onSetFilterByKey('jobId', jobId)
      else onDeleteFilterByKey('jobId')
      await store.dispatch('job/loadApplicants', {
        filterBy: filterBy.value,
        sort: sort.value,
        shouldGather: shouldGather.value,
      })
      if (shouldGather.value) setShouldGather(false)
    }
    return {
      filterBy,
      onSetFilterByKey,
      onSetFilter,
      resetFilters,
      setFilterFromRoute,
      onChangePage,
      sort,
      onSort,
      tagList,
      onRemoveTag,
      selectedItems,
      isSelected,
      setSelectedItems,
      onSelectAll,
      onSelectItem,
      clearSelectedItems,
      shouldGather,
      setShouldGather,
      loadApplicants,
    }
  },
  async created() {
    console.log('tagList',this.tagList)
    this.loadApplicants()
    this.loadJob()
    if (this.job) {
      this.$nextTick(() => {
        document.title = 'Intervid | ' + this.job.info.title
      })
    }
  },

  computed: {
    job() {
      return this.$store.getters['job/job']
    },

    pageCount() {
      return this.$store.getters['job/applicantPageCount']
    },

    applicantCount() {
      return this.job?.applicantSummary?.applicantCount || 0
    },

    filteredApplicantCount() {
      return this.$store.getters['job/filteredApplicantCount']
    },

    applicants() {
      return this.$store.getters['job/applicants']
    },

    isFetching() {
      return this.$store.getters['job/isFetching']
    },

    isAllSelectedRead() {
      if (this.selectedItems) return this.selectedItems.every((item) => item.isRead)
      return true
    },

    isLockedItemSelected() {
      return this.isFreeUser && this.selectedItems.some((applicant) => !applicant.isFree)
    },

    overviewTitle() {
      if (this.job) return this.job.info.title
      return this.$getTrans('applications')
    },

    isAllSelected() {
      return this.applicants.length === this.selectedItems.length
    },

    lng() {
      return this.$store.getters['app/lang']
    },

    filterCount() {
      const {$getTrans} = this
      if (this.filteredApplicantCount > 1)
        return `${$getTrans('showing')} ${this.filteredApplicantCount} ${$getTrans('applicants').toLowerCase()}`
      else if (this.filteredApplicantCount === 1) {
        return this.lng === 'en'
          ? `${$getTrans('showing')} ${this.filteredApplicantCount} ${$getTrans('applicant').toLowerCase()}`
          : `${$getTrans('showing')} ${$getTrans('applicant').toLowerCase()} ${this.filteredApplicantCount}`
      } else return ''
    },

    isFreeUser() {
      return !this.$store.getters['auth/verifyPerm'](advancedPermsMap.UNLIMITED_INTERVIEWS)
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },
  },

  methods: {
    async loadJob() {
      const {jobId} = this.$route.params
      if (!jobId) return this.$store.commit('job/setJob', {job: null})
      await this.$store.dispatch('job/loadJob', {
        jobId,
      })
    },

    onLoadNextApplicants() {
      this.filterBy.currPage = this.filterBy.currPage + 1
      this.setShouldGather(true)
      this.loadApplicants()
    },

    async onArchiveSelected() {
      const applicants = [...this.selectedItems]
      await this.$store.dispatch('job/toggleArchiveApplicant', {
        applicants,
        isAllSelected: this.isAllSelected,
      })
      if (!this.applicants.length && this.filterBy?.currPage > 0) {
        this.onChangePage({diff: -1, cmpName: this.$route.name})
      } else if (!this.applicants.length && this.filterBy?.currPage === 0) {
        this.loadApplicants()
      }
      this.clearSelectedItems()
    },

    async onRemoveSelected() {
      const applicants = [...this.selectedItems]
      this.clearSelectedItems()
      await this.$store.dispatch('job/removeApplicants', {applicants})

      if (!this.applicants.length && this.filterBy?.currPage > 0) {
        this.onChangePage({diff: -1, cmpName: this.$route.name})
      } else if (!this.applicants.length && this.filterBy?.currPage === 0) {
        this.loadApplicants()
      }
    },

    async toggleIsRead() {
      const isRead = this.isAllSelectedRead
      const updatedApplicants = this.selectedItems.map((applicant) => {
        return {...applicant, isRead: !isRead}
      })
      this.setSelectedItems(updatedApplicants)
      await this.$store.dispatch('job/updateApplicants', {
        applicants: updatedApplicants,
      })
    },
  },

  watch: {
    // 'this.$route.query': {
    //   handler() {
    //     console.log('route changed')
    //     this.clearSelectedItems()
    //     this.setFilterFromRoute()
    //     this.loadApplicants()
    //   },
    //   deep: true,
    // },
    sort: {
      handler() {
        this.loadApplicants()
      },
      deep: true,
    },
    // applicants: {
    //   handler() {
    //     if (this.selectedItems) {
    //       const updatedApplicants = []
    //       for (const applicant of this.selectedItems) {
    //         const updatedApplicant = this.applicants.find(_applicant => _applicant.id === applicant.id)
    //         updatedApplicants.push(updatedApplicant)
    //       }
    //       this.selectedItems = updatedApplicants
    //     }
    //   },
    //   deep: true,
    // }
  },

  components: {
    TableList,
    SearchBox,
    FilterBox,
    ShareJob,
    AppPagination,
    ActionsList,
    ItemsIndicator,
  },
}
</script>
