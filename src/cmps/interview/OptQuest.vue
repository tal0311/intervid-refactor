<template>
  <div class="opt-quest-preview">
    <CheckboxInput
      v-for="(opt, idx) in opts"
      :key="idx"
      color="blue"
      :checked="optIdxs.includes(idx)"
      :txt="opt.txt"
      @input="onChoseOpt(idx)"
    />
  </div>
</template>

<script>
export default {
  props: {
    opts: {
      type: Array,
      required: true,
    },
    optIdxs: {
      type: Array,
      required: true,
    },
  },
  emits: ['set-opt'],

  methods: {
    onChoseOpt(optIdx) {
      const optIdxs = [...this.optIdxs]
      const idx = optIdxs.findIndex((_optIdx) => _optIdx === optIdx)
      if (idx !== -1) optIdxs.splice(idx, 1)
      else optIdxs.push(optIdx)

      this.$emit('set-opt', optIdxs)
    },
  },
}
</script>
