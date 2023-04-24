<template>
  <div class="basic-select">
    <label v-if="label" :for="'select' + id">{{ label }}</label>

    <div class="select-container" :tabindex="tabindex" @blur="open = false">
      <div v-if="selected" :id="'select' + id" class="selected" :class="{open: open}" @click="open = !open">
        {{ selected.txt }}

        <!-- Note: We can't use $getTrans here! - rendering user emails on ActivityFilter -->
        <!-- {{  $getTrans(selected.txt)  }} -->

        <i class="material-icons">expand_more</i>
      </div>

      <div class="items" :class="{selectHide: !open}">
        <div v-for="(option, i) of options" :key="i" @click="onSelect(option)">
          {{ option.txt }}

          <!-- Note: We can't use $getTrans here! - rendering user emails on ActivityFilter -->
          <!-- {{  $getTrans(option.txt)  }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: [String, Number, Boolean],
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['change', 'input'],

  data() {
    return {
      selected: null,
      open: false,
    }
  },

  created() {
    this.id = this.$utilsService.makeCmpId()
  },

  mounted() {
    const selected = this.options.find((opt) => opt.value === this.defaultValue)
    if (selected) this.selected = selected
    else this.selected = this.options[0]
  },

  methods: {
    onSelect(option) {
      this.selected = option
      this.open = false
      this.$emit('input', option.value)
      this.$emit('change', {
        target: {value: option.value, name: this.name},
      })
    },
  },
}
</script>
