<template>
  <div class="list-header">
    <div v-if="itemCount >= 0" class="list-item checkbox">
      <CheckboxInput :checked="allChecked" :partial="partialChecked" class="checkbox" @input="$emit('select-all')" />
    </div>
    <div
      v-for="(header, idx) in headers"
      :key="idx"
      class="header-item"
      :class="{[header.class]: header.class}"
      @click="!isFreeUser && $emit('sort', header.key)"
    >
      <div :class="getSortableClass(header)">
        <span v-if="header.txt"> {{ $getTrans(header.txt) }}</span>
        <span v-if="header.txt && !isFreeUser" class="sort-arrows"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {advancedPermsMap, getSortableHeaders} from '@/services/constData.js'
// import {userService} from '@/services/userService'

export default {
  props: {
    sort: {
      type: Object,
      required: true,
    },
    filterBy: {
      type: Object,
      required: true,
    },
    selectedItemCount: {
      type: Number,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
  },
  emits: ['sort', 'select-all'],
  data() {
    return {
      headers: [],
    }
  },

  computed: {
    isFreeUser() {
      return !this.$store.getters['auth/verifyPerm'](advancedPermsMap.UNLIMITED_INTERVIEWS)
    },

    allChecked() {
      const maxItemCount = this.itemCount < this.itemsPerPage ? this.itemCount : this.itemsPerPage
      return this.selectedItemCount && this.selectedItemCount === +maxItemCount
    },

    partialChecked() {
      return !!this.selectedItemCount && this.selectedItemCount !== this.itemCount
    },
  },

  mounted() {
    this.headers = getSortableHeaders(this.$route.path)
  },

  methods: {
    getSortableClass(header) {
      return `${header.key ? 'sortable' : ''} ${this.isFreeUser ? 'disabled' : ''} ${
        this.sort.by === header.key ? this.sort.dir : ''
      }`
    },
  },
}
</script>
