<template>
  <section class="mobile-filter-modal">
    <div class="content">
      <div v-if="isApplicantOverview" class="filter-container status-filter">
        <h3 class="filter-title">{{getTrans('by-status')}}</h3>
        <div class="filter-list">
          <label v-for="(status, idx) in statuses" :key="status.label" @input="$emit('select-status', idx)">
            <input type="checkbox" :checked="isStatusSelected(idx)" />
            <span>{{getTrans(`${status.label}`)}}</span>
          </label>
        </div>
      </div>

      <div class="filter-container date-filter">
        <h3 class="filter-title">{{getTrans('by-date')}}</h3>
        <div class="filter-list">
          <label :class="{ selected: !updatedFilterBy.daysAgo }" @input="$emit('edit-filter', 'daysAgo', '')">
            <input type="radio" value="" :checked="!updatedFilterBy.daysAgo" v-model="updatedFilterBy.daysAgo" />
            {{getTrans('all')}}
          </label>
          <label
            v-for="date in filterDates"
            :class="{ selected: updatedFilterBy.daysAgo == date.daysAgo }"
            :key="date.id"
            @input="$emit('edit-filter', 'daysAgo', date.daysAgo)"
          >
            <input
              type="radio"
              :value="date.daysAgo"
              :checked="updatedFilterBy.daysAgo == date.daysAgo"
              v-model="updatedFilterBy.daysAgo"
            />
            {{getTrans(date.label)}}
          </label>
        </div>
      </div>

      <div class="filter-container view-filter">
        <h3 class="filter-title">{{getTrans('view-only')}}</h3>
        <div class="filter-list">
          <label
            :class="{ selected: updatedFilterBy.incomplete === undefined }"
            @input="
              () => {
                $emit('edit-filter', 'incomplete', undefined)
                $emit('edit-filter', 'showArchived', false)
              }
            "
          >
            <input
              type="radio"
              :checked="updatedFilterBy.incomplete === undefined"
              :value="undefined"
              v-model="updatedFilterBy.incomplete"
            />
            {{getTrans('show-all')}}
          </label>

          <label
            v-if="isApplicantOverview"
            :class="{ selected: updatedFilterBy.incomplete }"
            @input="$emit('edit-filter', 'incomplete', $event.target.checked)"
          >
            <input
              type="radio"
              :value="true"
              :checked="updatedFilterBy.incomplete === false"
              v-model="updatedFilterBy.incomplete"
            />
            {{getTrans('show-incomplete')}}
          </label>
          <label
            v-if="isApplicantOverview"
            :class="{ selected: updatedFilterBy.incomplete }"
            @input="$emit('edit-filter', 'incomplete', !$event.target.checked)"
          >
            <input
              type="radio"
              :value="false"
              :checked="updatedFilterBy.incomplete"
              v-model="updatedFilterBy.incomplete"
            />
            {{getTrans('show-complete')}}
          </label>

          <!-- <label :class="{ selected: isShowArchived }"
            @input="$emit('edit-filter', 'showArchived', $event.target.checked)">
            <input type="radio" :checked="isShowArchived" />
            {{ getTrans('show-archived') }}
          </label> -->
        </div>
      </div>
      <div class="filter-container archive-filter">
        <h3 class="filter-title">{{getTrans('show-archived')}}</h3>
        <div class="toggle-option">
          <div class="main-toggle">
            <label for="show-archived">
              <input
                type="checkbox"
                id="show-archived"
                name="show-archived"
                :checked="updatedFilterBy.showArchived"
                v-model="updatedFilterBy.showArchived"
                @input="$emit('edit-filter', 'showArchived', $event.target.checked)"
              />
              <div class="outer">
                <div class="inner"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <p @click="onClearFilter">Clear all</p>
      <button class="set-filter-btn" @click="onSetFilter">
        {{showCount}}
      </button>
      <!-- <button @click="onSetFilter">Filter</button> -->
    </div>
  </section>
</template>

<script>
import { statusMap, filterDates } from '@/services/constData'

export default {
  props: ['filterBy', 'expectedEntityCount', 'filteredJobCount', 'entity', 'updatedFilterBy'],

  data() {
    return {
      // selectedDaysAgo: this.filterBy?.daysAgo || '',
      // selectedStatuses: this.filterBy?.statuses ? [...this.filterBy?.statuses] : [],
    }
  },

  computed: {
    statuses() {
      return statusMap
    },

    filterDates() {
      return filterDates
    },

    selectedStatuses() {
      return this.filterBy.statuses
    },

    isShowArchived() {
      return !!this.filterBy.showArchived
    },

    isShowIncomplete() {
      return this.filterBy.incomplete
    },

    selectedDaysAgo() {
      return this.filterBy.daysAgo
    },

    isApplicantOverview() {
      return this.$route.name === 'ApplicantOverview'
    },

    showCount() {
      const { getTrans } = this
      if (this.expectedEntityCount > 1)
        return `${getTrans('show')} ${this.expectedEntityCount} 
          ${getTrans(`${this.entity}s`.toLowerCase()).toLowerCase()}`
      else if (this.expectedEntityCount === 1) {
        return this.lng === 'en'
          ? `${getTrans('show')} ${this.expectedEntityCount} ${getTrans(`${this.entity}`.toLowerCase()).toLowerCase()}`
          : `${getTrans('show')} ${getTrans(`${this.entity}`.toLowerCase()).toLowerCase()} ${this.expectedEntityCount}`
      } else return getTrans('no-exact-matches')
    },

    lng() {
      return this.$store.getters['app/lang']
    },
  },

  methods: {
    onSelectStatus(statusCode) {
      if (this.isStatusSelected(statusCode)) {
        this.selectedStatuses = this.selectedStatuses.filter((status) => status !== statusCode)
      } else this.selectedStatuses.push(statusCode)
      this.$emit('set-filter', 'statuses', this.selectedStatuses)
    },

    isStatusSelected(statusCode) {
      return this.selectedStatuses?.includes(statusCode)
    },

    onClearFilter() {
      this.$emit('reset-filter')
    },

    onSetFilter() {
      this.$emit('set-filter')
    },
  },
}
</script>
