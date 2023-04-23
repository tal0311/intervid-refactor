<template>
  <div class="choice-quest-edit">
    <div ref="elOpts" class="choice-container">
      <div v-for="(opt, idx) in opts" :key="idx" :class="{correct: opt.isCorrect}">
        <input
          title="Set as Correct Option"
          :checked="opt.isCorrect"
          type="checkbox"
          @input="onSetCorrectIdx(idx, $event.target.checked)"
        />
        <input class="opt-input" type="text" :value="opt.txt" @blur="onEditOpt(idx, $event.target.value)" />
        <i class="material-icons" @click="onRemoveOpt(idx)">clear</i>
      </div>
    </div>
    <div class="add-opt">
      <input disabled type="checkbox" />
      <span @click="onAddOpt">Add Option</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['optsToEdit'],

  data: () => ({
    opts: [],
  }),

  watch: {
    optsToEdit() {
      if (this.optsToEdit) {
        this.opts = structuredClone(this.optsToEdit)
      }
    },
  },

  created() {
    this.opts = structuredClone(this.optsToEdit)
  },

  methods: {
    onAddOpt() {
      this.opts.push({
        txt: `Option ${this.opts.length + 1}`,
        isCorrect: false,
      })
      this.focusLastOpt()
    },

    onEditOpt(optIdx, txt) {
      const opt = {...this.opts[optIdx]}
      opt.txt = txt || 'Option' + (optIdx + 1)
      this.saveOpt(opt, optIdx)
    },

    onRemoveOpt(optIdx) {
      this.opts.splice(optIdx, 1)
      this.$emit('edit-opts', [...this.opts])
    },

    onSetCorrectIdx(optIdx, isCorrect) {
      const opt = {...this.opts[optIdx]}
      opt.isCorrect = isCorrect
      this.saveOpt(opt, optIdx)
    },

    saveOpt(opt, optIdx) {
      this.opts.splice(optIdx, 1, opt)
      this.$emit('edit-opts', [...this.opts])
    },

    focusLastOpt() {
      this.$nextTick(() => {
        const elInput = this.$refs.elOpts.lastElementChild.children[1]
        elInput.focus()
        elInput.select()
      })
    },
  },
}
</script>
