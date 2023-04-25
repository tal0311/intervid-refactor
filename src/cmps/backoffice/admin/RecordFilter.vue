<template>
  <section class="record-filter">
    <div class="top">
      <SearchBox :value="filterBy.txt" debounce="true" placeholder="search-logs" @input="onSetFilterByKey" />

      <basic-select
        label="Source"
        :default-value="filterBy.source"
        :options="[
          {txt: 'All', value: ''},
          {txt: 'Frontend', value: 'frontend'},
          {txt: 'Backend', value: 'backend'},
        ]"
        @input="onSetFilterByKey('source', $event)"
      />
    </div>

    <div class="bottom">
      <div class="searches">
        <label for="traceID" class="trace-id">
          Trace ID
          <input id="traceID" type="text" name="traceID" :value="filterBy.traceID" @change="handleChange" />
        </label>

        <div class="date-container">
          <label for="fromDate">
            <p>From Date</p>
            <input id="fromDate" type="date" name="fromDate" :value="filterBy.fromDate" @change="handleChange" />
          </label>

          <label for="toDate">
            <p>To Date</p>
            <input id="toDate" type="date" name="toDate" :value="filterBy.toDate" @change="handleChange" />
          </label>
        </div>
      </div>

      <label class="user-txt">
        Applicant/User
        <input type="text" name="userTxt" :value="filterBy.userTxt" placeholder="Id" @change="handleChange" />
      </label>

      <div class="status-code">
        <label for="statusCode">
          Status Code
          <input id="statusCode" type="text" :value="filterBy.statusCode" name="statusCode" @change="handleChange" />
        </label>

        <basic-select
          :default-value="filterBy.exclude === 'true'"
          name="exclude"
          :options="[
            {txt: 'Include', value: false},
            {txt: 'Exclude', value: true},
          ]"
          @change="handleChange"
        />
      </div>

      <div class="timeline">
        <p>Levels:</p>
        <button
          v-for="(level, idx) in levels"
          :key="idx"
          :class="{
            selected: filterBy.levels && filterBy.levels.includes(level),
            [level]: true,
          }"
          @click="onLevelChange(level)"
        >
          {{ level.toUpperCase() }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import SearchBox from '@/cmps/common/SearchBox.vue'

export default {
  components: {SearchBox},
  props: {
    filterBy: {
      type: Object,
      required: true,
    },
  },
  emits: ['set-filter'],

  data() {
    return {
      levels: ['debug', 'http', 'info', 'warn', 'error'],
    }
  },
  methods: {
    onSetFilterByKey(key, value) {
      this.$emit('set-filter', key, value)
    },

    onLevelChange(level) {
      const levels = this.filterBy.levels?.split(',') || []
      const levelIdx = levels.findIndex((_level) => _level === level)
      if (levelIdx > -1) levels.splice(levelIdx, 1)
      else levels.push(level)
      this.onSetFilterByKey('levels', levels.join(','))
    },

    // handleChange: this.$utilService['debounce'](function (ev) {
    //   this.onSetFilterByKey(ev.target.name, ev.target.value)
    // }, 0),
  },
}
</script>
