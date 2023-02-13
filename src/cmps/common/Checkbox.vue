<template>
  <div class="md-checkbox" :class="{ 'md-checkbox-inline': inline }">
    <input
      type="checkbox"
      :class="{ partial: partial, [color]: color }"
      @input="onChange"
      :checked="value || checked"
      :id="id"
      :disabled="$attrs.disabled"
    />
    <label class="check-label" :for="id">
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    label: String,
    checked: {},
    partial: Boolean,
    color: String,
    inline: Boolean,
  },

  created() {
    this.id = this._uid;
  },

  methods: {
    onChange(ev) {
      this.$emit("input", ev.target.checked);
    },
  },
};
</script>
