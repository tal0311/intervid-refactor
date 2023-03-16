<template>
  <div @click="onChange" @input="onChange" class="md-checkbox" :class="{'md-checkbox-inline': inline}">
    <input
      type="checkbox"
      :class="{partial: partial, [color]: color}"
      :checked="value || checked"
      :id="id"
      :disabled="disabled"
    />
    <label class="check-label" :for="id">
      {{ txt }}
    </label>
  </div>
</template>

<script>
export default {
  emits: ['input'],
  props: {
    value: Boolean,
    label: String,
    checked: {},
    partial: Boolean,
    color: String,
    inline: Boolean,
    disabled: Boolean,
    txt: String,
  },

  created() {
    this.id = this.$utilService.makeId(20)
    // Evan you claims this is a bad practice, and it is, especially since this._uid returns undefined.
    // console.log(this._uid) // logs undefined
    // this.id = this._uid
  },

  methods: {
    onClickDiv() {
      console.log('onClickDiv')
      // this.$emit('input', !this.value)
    },
    onChange(ev) {
      // console.log('onChange', ev.target.checked)
      this.$emit('input', ev.target.checked)
    },
  },
}
</script>
