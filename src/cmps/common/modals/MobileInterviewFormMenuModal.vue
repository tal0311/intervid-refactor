<template>
  <div class="mobile-interview-form-menu-modal mobile-modal-content">
    <button @click="$emit('emit-action', 'add-quest')">
      <i class="material-icons">add</i>
      {{getTrans('add-question')}}
    </button>
    <button v-if="isRemoveShown" @click="$emit('emit-action', 'remove-quest', quest.id)">
      <i class="material-icons">remove</i>
      {{getTrans('remove-question')}}
    </button>
  </div>
</template>

<script>
export default {
  props: ['quest', 'isRemoveShown'],

  methods: {},
}
</script>
