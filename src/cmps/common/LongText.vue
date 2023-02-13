<template>
  <div>
    {{ textToDisplay }}
    <a class="read-more-btn" @click.stop="toggleReadMore()">{{ btnText }}</a>
  </div>
</template>

<script>
export default {
  props: ["text"],

  data() {
    return {
      readMoreActivated: false,
    };
  },

  computed: {
    btnText() {
      return this.readMoreActivated ? "Read Less" : "Read More...";
    },

    textToDisplay() {
      return this.readMoreActivated ? this.text : this.text.slice(0, 100);
    },
  },

  methods: {
    toggleReadMore() {
      this.readMoreActivated = !this.readMoreActivated;
    },
  },
};
</script>
