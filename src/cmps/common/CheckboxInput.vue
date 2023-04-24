<template>
  <div class="md-checkbox" :class="{'md-checkbox-inline': inline}" @click="onChange" @input="onChange">
    <input
      :id="id"
      type="checkbox"
      :class="{partial: partial, [color]: color}"
      :checked="value || checked"
      :disabled="disabled"
    />
    <label class="check-label" :for="id">
      {{ txt }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    label: {
      type: String,
      default: '',
    },
    checked: {
      type: Number,
      default: 0,
    },
    partial: Boolean,
    color: {
      type: String,
      default: 'primary',
    },
    inline: Boolean,
    disabled: Boolean,
    txt: {
      type: String,
      default: '',
    },
  },
  emits: ['input'],

  created() {
    this.id = this.$utilService.makeId(20)
    // Evan you claims this is a bad practice, and it is, especially since this._uid returns undefined.
    // console.log(this._uid) // logs undefined
    // this.id = this._uid
  },

  methods: {
    onChange(ev) {
      this.$emit('input', ev.target.checked)
    },
  },
}
</script>
