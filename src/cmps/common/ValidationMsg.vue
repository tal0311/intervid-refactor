<template>
  <span class="validation" v-if="error"> {{getTrans(error)}} </span>
</template>

<script>
export default {
  props: ['error'],

  methods: {},
}
</script>
