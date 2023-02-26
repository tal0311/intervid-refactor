<template>
  <section class="record-preview">
    <i class="material-icons expand-icon" :class="{selected: selectedRecordId === record._id}" @click="expandDetails"
      >expand_more</i
    >
    <div class="preview-item">
      {{ formattedRecordDate }}
    </div>

    <div class="preview-item">
      {{ record.meta.source }}
    </div>

    <div class="preview-item">
      {{ record.level }}
    </div>

    <div :title="record.message" class="preview-item long">
      {{ clippedMessage }}
    </div>

    <div class="preview-item">
      {{ record.meta.traceID || '-' }}
    </div>
    <record-details v-if="selectedRecordId === record._id" :record="record" />
  </section>
</template>

<script>
import RecordDetails from '@/cmps/backoffice/admin/RecordDetails.vue'

export default {
  props: ['record'],

  computed: {
    clippedMessage() {
      const {message} = this.record
      return message.length > 100 ? message.substr(0, 100) + '...' : message
    },

    selectedRecordId() {
      return this.$store.getters['record/selectedRecordId']
    },

    formattedRecordDate() {
      const date = new Date(this.record.timestamp)
      if (!date) return 'None'
      return $formatDate(date, {
        getFullDate: true,
        includeTime: true,
        includeSeconds: true,
      })
    },
  },

  methods: {
    expandDetails() {
      const recordId = this.selectedRecordId === this.record._id ? null : this.record._id
      this.$store.commit('record/setSelectedRecordId', {recordId})
    },
  },

  components: {RecordDetails},
}
</script>
