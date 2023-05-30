<template>
  <section class="filter-box">
    <button class="mobile-btn" :class="{selected: isFiltering}" @click="toggleModal('MobileFilter')">
      <img
        loading="lazy"
        src="https://res.cloudinary.com/intervid/image/upload/v1661182219/Frontend/sliders_fwgagw.svg"
        alt="sliders"
      />
    </button>

    <div class="filter-btn" :class="{selected: isFilterModalOpen}">
      <button @click="toggleModal('Filter')">
        <!-- <div v-html="svgs.filter"></div> -->
        <i class="material-icons">tune</i>
        {{ $getTrans('filter-btn') }}
      </button>

      <div v-click-outside-calc="onResetFilter" class="filter-modal" :class="{open: isFilterModalOpen}">
        <div v-if="isApplicantOverview" class="filter-container status-filter">
          <h3 class="filter-title">{{ $getTrans('by-status') }}</h3>
          <div class="filter-list">
            <label v-for="(status, idx) in statuses" :key="status.label" @input="onSelectStatus(idx)">
              <input type="checkbox" :checked="isStatusSelected(idx)" />
              <span>{{ $getTrans(`${status.label}`) }}</span>
            </label>
          </div>
        </div>

        <div class="filter-container date-filter">
          <h3 class="filter-title">{{ $getTrans('by-date') }}</h3>
          <div class="filter-list">
            <label :class="{selected: !updatedFilterBy.daysAgo}" @input="() => {getExpectedEntityCount('daysAgo', null)}">
              <input v-model="updatedFilterBy.daysAgo" name="date" type="radio" value="" :checked="!updatedFilterBy.daysAgo" />
              {{ $getTrans('all') }}
            </label>
            <label
              v-for="date in filterDates"
              :key="date.id"
              :class="{selected: updatedFilterBy.daysAgo == date.daysAgo}"
              @input="() => {getExpectedEntityCount('daysAgo', date.daysAgo)}"
            >
              <input
                v-model="updatedFilterBy.daysAgo"
                name="date"
                type="radio"
                :value="date.daysAgo"
                :checked="updatedFilterBy.daysAgo == date.daysAgo"
              />
              {{ $getTrans(date.label) }}
            </label>
          </div>
        </div>

        <div v-if="isApplicantOverview" class="filter-container view-filter">
          <h3 class="filter-title">{{ $getTrans('view-only') }}</h3>
          <div class="filter-list">
            <label :class="{selected: updatedFilterBy.incomplete === undefined}" @input="() => {getExpectedEntityCount('incomplete', undefined)}">
              <input
                v-model="updatedFilterBy.incomplete"
                name="view"
                type="radio"
                :checked="updatedFilterBy.incomplete === undefined"
                :value="undefined"
              />
              {{ `${$getTrans('show-all')}` }}
            </label>

            <label :class="{selected: updatedFilterBy.incomplete}" @input="() => {getExpectedEntityCount('incomplete', true)}">
              <input
                v-model="updatedFilterBy.incomplete"
                name="view"
                type="radio"
                :value="true"
                :checked="updatedFilterBy.incomplete"
              />
              {{ $getTrans('show-incomplete') }}
            </label>
            <label :class="{selected: updatedFilterBy.incomplete === false}" @input="() => {getExpectedEntityCount('incomplete', false)}">
              <input
                v-model="updatedFilterBy.incomplete"
                name="view"
                type="radio"
                :value="false"
                :checked="updatedFilterBy.incomplete === false"
              />
              {{ $getTrans('show-complete') }}
            </label>
          </div>
        </div>
        <div class="filter-container archive-filter">
          <h3 class="filter-title">{{ $getTrans('show-archived') }}</h3>
          <div class="toggle-option">
            <div class="main-toggle">
              <label for="show-archived" @input="() => {getExpectedEntityCount('showArchived', true)}">
              <!-- <label for="show-archived"> -->
                <input
                  id="show-archived"
                  v-model="updatedFilterBy.showArchived"
                  type="checkbox"
                  name="show-archived"
                  :checked="updatedFilterBy.showArchived"
                />
                <div class="outer">
                  <div class="inner"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="filter-footer">
          <a class="clear-filters-btn" :class="{bold: isFiltering}" :disabled="!isFiltering" @click="onClearFilter">
            {{ $getTrans('clear-filters') }}
          </a>
          <button class="set-filter-btn" :disabled="isDisabled" @click="onSetFilter">
            <div v-if="isloading" class="loading"></div>
            <p v-else>{{ showCount }}</p>
          </button>
        </div>
      </div>
    </div>

    <MobileModal
      v-if="isMobile && modal.type === 'MobileFilter'"
      cmp-name="filter"
      :filter-by="filterBy"
      :expected-entity-count="expectedEntityCount"
      :filtered-job-count="filteredJobCount"
      :entity="entity"
      :updated-filter-by="updatedFilterBy"
      @edit-filter="(key, term) => (updatedFilterBy[key] = term)"
      @set-filter="onSetFilter"
      @reset-filter="onClearFilter"
      @select-status="onSelectStatus"
      @on-close="toggleModal('MobileFilter')"
    />
  </section>
</template>

<script>
import {statusMap, filterDates} from '@/services/constData'
import MobileModal from '@/cmps/common/modals/MobileModal.vue'

export default {
  components: {
    MobileModal,
  },
  props: {
    filterBy: {
      type: [Object, String],
      required: true,
    },
    isApplicantOverview: Boolean,
    filteredJobCount: {
      type: Number,
      default: null,
    },
  },
  emits: ['set-filter', 'reset-filter', 'reset-filters'],

  data() {
    return {
      updatedFilterBy: {...this.filterBy},
      isFilterEdited: false,
      svgs: {filter: ''},
      isloading: false,
      isNoResults: false,
    }
  },

  computed: {
    statuses() {
      return statusMap
    },

    console() {
      return console
    },

    filterDates() {
      return filterDates
    },

    isDisabled() {
      if (this.isNoResults || this.isloading) return true
      return false
    },

    // isFilterByDate() {
    //   return !!this.filterBy.daysAgo
    // },

    // isFilterByStatus() {
    //   return !!this.filterBy.statuses?.length
    // },

    isShowArchived() {
      return !!this.filterBy.showArchived
    },

    isShowIncomplete() {
      return this.updatedFilterBy.incomplete
    },

    paramsDaysAgo() {
      return this.$route.query.daysAgo
    },

    isFiltering() {
      return (
        !!this.filterBy.daysAgo ||
        !!this.filterBy.statuses?.length ||
        !!this.filterBy.showArchived ||
        !!this.filterBy.incomplete ||
        !!this.filterBy.txt
      )
    },

    isFilterModalOpen() {
      return this.modal.type === 'Filter'
    },

    isFilterChanged() {
      return !this.$utilService.isEqual(this.updatedFilterBy, this.filterBy)
    },

    entity() {
      const route = this.$route.path
      let entity
      if (route.includes('applicant')) entity = 'Applicant'
      else if (route.includes('job')) entity = 'Job'
      else if (route.includes('template')) entity = 'Template'
      return entity
    },

    expectedEntityCount() {
      return this.$store.getters[`job/expected${this.entity}Count`]
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    showCount() {
      const {$getTrans} = this
      if (this.expectedEntityCount > 1) {
        return `${$getTrans('show')} ${this.expectedEntityCount} 
          ${$getTrans(`${this.entity}s`.toLowerCase()).toLowerCase()}`
      } else if (this.expectedEntityCount === 1) {
        return this.lng === 'en'
          ? `${$getTrans('show')} ${this.expectedEntityCount} ${$getTrans(
              `${this.entity}`.toLowerCase(),
            ).toLowerCase()}`
          : `${$getTrans('show')} ${$getTrans(`${this.entity}`.toLowerCase()).toLowerCase()} ${
              this.expectedEntityCount
            }`
      } else return $getTrans('no-exact-matches')
    },

    lng() {
      return this.$store.getters['app/lang']
    },
  },

  watch: {
    updatedFilterBy: {
      handler() {},
      deep: true,
      immediate: true,
    },
  },

  created() {
    // this.resetFilter()
    // this.svgs.filter = this.$getSvg('filter')
    const filterBy = this.updatedFilterBy
    this.$store.dispatch(`job/getExpected${this.entity}Count`, {filterBy})
  },

  methods: {
    toggleModal(type) {
      this.$store.dispatch('app/toggleModal', {type})
    },

    onSetFilter() {
      this.$emit('set-filter', this.updatedFilterBy)
      this.toggleModal(null)
    },

    async onSelectStatus(statusCode) {
      if (!this.updatedFilterBy.statuses) this.updatedFilterBy.statuses = []
      if (this.isStatusSelected(statusCode)) {
        this.updatedFilterBy.statuses = this.updatedFilterBy?.statuses.filter((status) => status !== statusCode)
      } else this.updatedFilterBy.statuses = [...this.updatedFilterBy.statuses, statusCode]
      const filterBy = this.updatedFilterBy
      this.isloading = true
      await this.$store.dispatch(`job/getExpected${this.entity}Count`, {filterBy})
      if (this.expectedEntityCount === 0) this.isNoResults = true
      else this.isNoResults = false
      this.isloading = false
    },

    isStatusSelected(statusCode) {
      return this.updatedFilterBy?.statuses ? this.updatedFilterBy.statuses.includes(statusCode) : false
    },

    // onClearStatuses() {
    //   this.selectedStatuses = []
    //   this.onSetFilter('statuses', [])
    // },
    onResetFilter() {
      if (!this.isFilterModalOpen) return
      if (!this.isFilterChanged) return
      this.resetFilter()
    },
    resetFilter() {
      this.updatedFilterBy = this.$utilService.cloneDeep(this.filterBy)
    },

    async getExpectedEntityCount(key, value) {
      if (key === 'showArchived') this.updatedFilterBy[key] = !this.updatedFilterBy[key]
      else this.updatedFilterBy[key] = value
      const filterBy = this.updatedFilterBy
      this.isloading = true
      await this.$store.dispatch(`job/getExpected${this.entity}Count`, {filterBy})
      if (this.expectedEntityCount === 0) this.isNoResults = true
      else this.isNoResults = false
      this.isloading = false
    },
    async onClearFilter() {
      this.$emit('reset-filters')
      this.$nextTick(() => {
        this.resetFilter()
      })
    },
  },
}
</script>
