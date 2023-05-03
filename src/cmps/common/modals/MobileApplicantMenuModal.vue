<template>
  <div class="mobile-applicant-menu-modal mobile-modal-content">
    <button @click="$emit('on-archive-applicant')">
      <i class="archive-btn material-icons">archive</i>
      {{ $getTrans('archive') }}
    </button>
    <button @click="$emit('on-edit-applicant')">
      <i class="archive-btn material-icons">edit</i>{{ $getTrans('edit-applicant') }}
    </button>
  </div>
</template>

<script>
export default {
  emits: ['on-archive-applicant', 'on-edit-applicant'],
}
</script>
