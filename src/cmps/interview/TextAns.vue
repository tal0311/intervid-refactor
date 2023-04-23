<template>
  <textarea
    :value="txt"
    class="text-ans grow"
    cols="55"
    rows="20"
    spellcheck="false"
    placeholder="Write answer here"
    @input="onChangeTxt"
  />
</template>

<script>
export default {
  props: {
    txt: {
      type: String,
      required: true,
    },
  },
  emits: ['save-ans'],
  methods: {
    onChangeTxt(ev) {
      this.$emit('save-ans', {key: 'txt', value: ev.target.value})
    },
  },
}
</script>
