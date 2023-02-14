<template>
  <section class="filter-box">
    <button
      class="mobile-btn"
      :class="{ selected: isFiltering }"
      @click="toggleModal('MobileFilter')"
    >
      <img
        loading="lazy"
        src="https://res.cloudinary.com/intervid/image/upload/v1661182219/Frontend/sliders_fwgagw.svg"
        alt="sliders"
      />
    </button>

    <div class="filter-btn" :class="{ selected: isFilterModalOpen }">
      <button @click="toggleModal('Filter')">
        <!-- <div v-html="svgs.filter"></div> -->
        <i class="material-icons">tune</i>
        {{ getTrans("filter-btn") }}
      </button>

      <div
        class="filter-modal"
        :class="{ open: isFilterModalOpen }"
        v-clickOutside="onResetFilter"
      >
        <div v-if="isApplicantOverview" class="filter-container status-filter">
          <h3 class="filter-title">{{ getTrans("by-status") }}</h3>
          <div class="filter-list">
            <label
              v-for="(status, idx) in statuses"
              :key="status.label"
              @input="onSelectStatus(idx)"
            >
              <input type="checkbox" :checked="isStatusSelected(idx)" />
              <span>{{ getTrans(`${status.label}`) }}</span>
            </label>
          </div>
        </div>

        <div class="filter-container date-filter">
          <h3 class="filter-title">{{ getTrans("by-date") }}</h3>
          <div class="filter-list">
            <label :class="{ selected: !updatedFilterBy.daysAgo }">
              <input
                type="radio"
                value=""
                :checked="!updatedFilterBy.daysAgo"
                v-model="updatedFilterBy.daysAgo"
              />
              {{ getTrans("all") }}
            </label>
            <label
              v-for="date in filterDates"
              :class="{ selected: updatedFilterBy.daysAgo == date.daysAgo }"
              :key="date.id"
            >
              <input
                type="radio"
                :value="date.daysAgo"
                :checked="updatedFilterBy.daysAgo == date.daysAgo"
                v-model="updatedFilterBy.daysAgo"
              />
              {{ getTrans(date.label) }}
            </label>
          </div>
        </div>

        <div class="filter-container view-filter" v-if="isApplicantOverview">
          <h3 class="filter-title">{{ getTrans("view-only") }}</h3>
          <div class="filter-list">
            <label
              :class="{ selected: updatedFilterBy.incomplete === undefined }"
            >
              <input
                type="radio"
                :checked="updatedFilterBy.incomplete === undefined"
                :value="undefined"
                v-model="updatedFilterBy.incomplete"
              />
              {{ `${getTrans("show-all")}` }}
            </label>

            <label :class="{ selected: updatedFilterBy.incomplete }">
              <input
                type="radio"
                :value="true"
                :checked="updatedFilterBy.incomplete === false"
                v-model="updatedFilterBy.incomplete"
              />
              {{ getTrans("show-incomplete") }}
            </label>
            <label :class="{ selected: updatedFilterBy.incomplete === false }">
              <input
                type="radio"
                :value="false"
                :checked="updatedFilterBy.incomplete"
                v-model="updatedFilterBy.incomplete"
              />
              {{ getTrans("show-complete") }}
            </label>
          </div>
        </div>
        <div class="filter-container archive-filter">
          <h3 class="filter-title">{{ getTrans("show-archived") }}</h3>
          <div class="toggle-option">
            <div class="main-toggle">
              <label for="show-archived">
                <input
                  type="checkbox"
                  id="show-archived"
                  name="show-archived"
                  :checked="updatedFilterBy.showArchived"
                  v-model="updatedFilterBy.showArchived"
                />
                <div class="outer">
                  <div class="inner"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="filter-footer">
          <a
            class="clear-filters-btn"
            :class="{ bold: isFiltering }"
            :disabled="!isFiltering"
            @click="onClearFilter"
          >
            {{ getTrans("clear-filters") }}
          </a>
          <button class="set-filter-btn" @click="onSetFilter">
            {{ showCount }}
          </button>
        </div>
      </div>
    </div>

    <mobile-modal
      v-if="isMobile && modal.type === 'MobileFilter'"
      cmpName="filter"
      :filterBy="filterBy"
      @edit-filter="(key, term) => (updatedFilterBy[key] = term)"
      @set-filter="onSetFilter"
      @reset-filter="onClearFilter"
      @select-status="onSelectStatus"
      @on-close="toggleModal('MobileFilter')"
      :expectedEntityCount="expectedEntityCount"
      :filteredJobCount="filteredJobCount"
      :entity="entity"
      :updatedFilterBy="updatedFilterBy"
    />
  </section>
</template>

<script>
import { statusMap, filterDates } from "@/services/constData";
import MobileModal from "@/cmps/common/modals/MobileModal.vue";
// convert to utilService.deepEqual
import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";

export default {
  props: ["filterBy", "isApplicantOverview", "filteredJobCount"],

  data() {
    return {
      updatedFilterBy: { ...this.filterBy },
      isFilterEdited: false,
      svgs: {filter: ''},
    };
  },

  created() {
    // this.resetFilter()
    this.svgs.filter = this.getSvg('filter')
  },

  computed: {
    statuses() {
      return statusMap;
    },

    console() {
      return console;
    },

    filterDates() {
      return filterDates;
    },

    // isFilterByDate() {
    //   return !!this.filterBy.daysAgo
    // },

    // isFilterByStatus() {
    //   return !!this.filterBy.statuses?.length
    // },

    isShowArchived() {
      return !!this.filterBy.showArchived;
    },

    isShowIncomplete() {
      return this.updatedFilterBy.incomplete;
    },

    paramsDaysAgo() {
      return this.$route.query.daysAgo;
    },

    isFiltering() {
      return (
        !!this.filterBy.daysAgo ||
        !!this.filterBy.statuses?.length ||
        !!this.filterBy.showArchived ||
        !!this.filterBy.incomplete ||
        !!this.filterBy.txt
      );
    },

    isFilterModalOpen() {
      return this.modal.type === "Filter";
    },

    isFilterChanged() {
      return !isEqual(this.updatedFilterBy, this.filterBy);
    },

    entity() {
      const route = this.$route.path;
      let entity;
      if (route.includes("applicant")) entity = "Applicant";
      else if (route.includes("job")) entity = "Job";
      else if (route.includes("template")) entity = "Template";
      return entity;
    },

    expectedEntityCount() {
      return this.$store.getters[`job/expected${this.entity}Count`];
    },

    modal() {
      return this.$store.getters["app/modal"];
    },

    isMobile() {
      return this.$store.getters["app/isMobile"];
    },

    showCount() {
      const { getTrans } = this;
      if (this.expectedEntityCount > 1)
        return `${getTrans("show")} ${this.expectedEntityCount} 
          ${getTrans(`${this.entity}s`.toLowerCase()).toLowerCase()}`;
      else if (this.expectedEntityCount === 1) {
        return this.lng === "en"
          ? `${getTrans("show")} ${this.expectedEntityCount} ${getTrans(
              `${this.entity}`.toLowerCase()
            ).toLowerCase()}`
          : `${getTrans("show")} ${getTrans(
              `${this.entity}`.toLowerCase()
            ).toLowerCase()} ${this.expectedEntityCount}`;
      } else return getTrans("no-exact-matches");
    },

    lng() {
      return this.$store.getters["app/lang"];
    },
  },

  methods: {
    toggleModal(type) {
      this.$store.dispatch("app/toggleModal", { type });
    },

    onSetFilter() {
      this.$emit("set-filter", this.updatedFilterBy);
      this.toggleModal(null);
    },

    onSelectStatus(statusCode) {
      if (!this.updatedFilterBy.statuses) this.updatedFilterBy.statuses = [];
      if (this.isStatusSelected(statusCode)) {
        this.updatedFilterBy.statuses = this.updatedFilterBy?.statuses.filter(
          (status) => status !== statusCode
        );
      } else
        this.updatedFilterBy.statuses = [
          ...this.updatedFilterBy.statuses,
          statusCode,
        ];
    },

    isStatusSelected(statusCode) {
      return this.updatedFilterBy?.statuses
        ? this.updatedFilterBy.statuses.includes(statusCode)
        : false;
    },

    // onClearStatuses() {
    //   this.selectedStatuses = []
    //   this.onSetFilter('statuses', [])
    // },
    onResetFilter() {
      if (!this.isFilterModalOpen) return;
      if (!this.isFilterChanged) return;
      this.resetFilter();
    },
    resetFilter() {
      this.updatedFilterBy = cloneDeep(this.filterBy);
    },

    async getExpectedEntityCount(filterBy) {
      this.$store.dispatch(`job/getExpected${this.entity}Count`, { filterBy });
    },
    async onClearFilter() {
      this.$emit("reset-filters");
      this.$nextTick(() => {
        this.resetFilter();
      });
    },
  },

  watch: {
    updatedFilterBy: {
      handler(newFilter) {
        this.getExpectedEntityCount(newFilter);
      },
      deep: true,
      immediate: true,
    },
  },

  components: {
    MobileModal,
  },
};
</script>
