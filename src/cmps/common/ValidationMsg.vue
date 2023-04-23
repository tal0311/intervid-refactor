<template>
  <span v-if="error" class="validation"> {{ $getTrans(error) }} </span>
</template>

<script>
export default {
  props: ['error'],

  methods: {},
}
</script>
