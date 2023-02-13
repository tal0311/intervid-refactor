<template>
  <textarea
    :value="txt"
    @input="onChangeTxt"
    class="text-ans grow"
    cols="55"
    rows="20"
    spellcheck="false"
    placeholder="Write answer here"
  />
</template>

<script>
export default {
  props: {
    txt: String,
  },

  methods: {
    onChangeTxt(ev) {
      this.$emit("save-ans", { key: "txt", value: ev.target.value });
    },
  },
};
</script>
