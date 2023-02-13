<template>
  <div class="mobile-time-event-menu mobile-modal-content">
    <button @click="$emit('on-remove-note-event')">
      {{ getTrans("delete") }}
    </button>
  </div>
</template>

<script>
export default {};
</script>
