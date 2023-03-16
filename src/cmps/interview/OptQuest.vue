<template>
  <div class="opt-quest-preview">
    <CheckboxInput
      color="blue"
      v-for="(opt, idx) in opts"
      :key="idx"
      :checked="optIdxs.includes(idx)"
      @input="onChoseOpt(idx)"
      :txt="opt.txt"
    />
  </div>
</template>

<script>
export default {
  props: ['opts', 'optIdxs'],

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
