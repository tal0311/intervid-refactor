<template>
  <div class="activity-filter">
    <basic-select
      v-if="users.length"
      :label="$getTrans('account')"
      :default-value="filterBy.userId"
      :options="userOpts"
      @input="onSetFilterByKey('userId', $event)"
    />
    <div class="date-container">
      <label for="fromDate">
        <p>{{ $getTrans('from-date') }}</p>
        <input
          id="fromDate"
          type="date"
          name="fromDate"
          :value="filterBy.fromDate"
          @change="onSetFilterByKey('fromDate', $event.target.value)"
        />
      </label>
      <label for="toDate">
        <p>{{ $getTrans('to-date') }}</p>
        <input
          id="toDate"
          type="date"
          name="toDate"
          :value="filterBy.toDate"
          @change="onSetFilterByKey('toDate', $event.target.value)"
        />
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filterBy: {
      type: Object,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },
  emits: ['set-filter'],

  computed: {
    userOpts() {
      const userOpts = this.users.map((user) => ({
        txt: user.email,
        value: user._id,
      }))
      userOpts.unshift({txt: this.$getTrans('choose-account'), value: ''})
      return userOpts
    },
  },

  methods: {
    onSetFilterByKey(key, value) {
      this.$emit('set-filter', key, value)
    },
  },
}
</script>
