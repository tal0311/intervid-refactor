<template>
  <div class="pagination">
    <i
      class="material-icons circle"
      :class="{disabled: !currPage}"
      @click="currPage && $emit('change-page', {diff: -1, cmpName: $route.name})"
      >keyboard_arrow_left</i
    >
    <div v-if="currPage > gap + 1" class="edge-num-container">
      <span class="circle" @click="currPage !== 0 && $emit('change-page', {to: 0, cmpName: $route.name})">{{ 1 }}</span>

      ...
    </div>

    <div class="page-numbers-container">
      <span
        v-for="index in pageNumbersForDisplay"
        :key="index"
        :class="{on: index - 1 === currPage}"
        class="circle"
        @click="currPage !== index - 1 && $emit('change-page', {to: index - 1, cmpName: $route.name})"
        >{{ formatNum(index) }}</span
      >
    </div>

    <div v-if="currPage < pageCount - gap - 2" class="edge-num-container">
      ...
      <span
        class="circle"
        @click="currPage !== pageCount - 1 && $emit('change-page', {to: pageCount - 1, cmpName: $route.name})"
        >{{ formatNum(pageCount) }}</span
      >
    </div>

    <i
      class="material-icons circle"
      :class="{disabled: isLastPage}"
      @click="!isLastPage && $emit('change-page', {diff: 1, cmpName: $route.name})"
      >keyboard_arrow_right</i
    >
  </div>
</template>

<script>
export default {
  props: {
    itemCount: {
      type: Number,
      required: true,
    },
    currPage: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ['change-page'],

  data() {
    return {
      gap: 1,
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.itemCount / this.itemsPerPage)
    },

    isLastPage() {
      return this.currPage === this.pageCount - 1
    },

    pageNumbersForDisplay() {
      let {currPage, pageCount, gap, fillArr} = this
      currPage++
      if (pageCount <= gap * 2 + 1) return fillArr(1, pageCount)
      if (currPage <= gap + 1) return fillArr(1, gap * 2 + 1)
      if (currPage === gap + 2) return fillArr(1, gap * 2 + 2)
      if (currPage >= pageCount - gap) return fillArr(pageCount - gap * 2, pageCount)
      if (currPage === pageCount - gap - 1) return fillArr(pageCount - gap * 2 - 1, pageCount)
      return fillArr(currPage - gap, currPage + gap)
    },
  },

  methods: {
    fillArr(from, to) {
      const arr = []
      for (let i = from; i < to + 1; i++) {
        arr.push(i)
      }
      return arr
    },

    formatNum(num) {
      return this.$formatNum(num)
    },
  },
}
</script>
