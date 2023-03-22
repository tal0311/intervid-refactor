<template>
  <section class="record-filter">
    <div class="top">
      <search-box :value="filterBy.txt" @input="onSetFilterByKey" debounce="true" placeholder="search-logs" />

      <basic-select
        label="Source"
        @input="onSetFilterByKey('source', $event)"
        :default-value="filterBy.source"
        :options="[
          {txt: 'All', value: ''},
          {txt: 'Frontend', value: 'frontend'},
          {txt: 'Backend', value: 'backend'},
        ]"
      />
    </div>

    <div class="bottom">
      <div class="searches">
        <label for="traceID" class="trace-id">
          Trace ID
          <input type="text" name="traceID" @change="handleChange" :value="filterBy.traceID" id="traceID" />
        </label>

        <div class="date-container">
          <label for="fromDate">
            <p>From Date</p>
            <input type="date" id="fromDate" name="fromDate" :value="filterBy.fromDate" @change="handleChange" />
          </label>

          <label for="toDate">
            <p>To Date</p>
            <input type="date" id="toDate" name="toDate" :value="filterBy.toDate" @change="handleChange" />
          </label>
        </div>
      </div>

      <label class="user-txt">
        Applicant/User
        <input type="text" name="userTxt" @change="handleChange" :value="filterBy.userTxt" placeholder="Id" />
      </label>

      <div class="status-code">
        <label for="statusCode">
          Status Code
          <input type="text" :value="filterBy.statusCode" name="statusCode" @change="handleChange" id="statusCode" />
        </label>

        <basic-select
          :default-value="filterBy.exclude === 'true'"
          name="exclude"
          @change="handleChange"
          :options="[
            {txt: 'Include', value: false},
            {txt: 'Exclude', value: true},
          ]"
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
  props: ['filterBy'],

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

  components: {SearchBox},
}
</script>
