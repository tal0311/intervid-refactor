<template>
  <div class="mobile-job-menu-modal mobile-modal-content">
    <template v-if="!job.archivedAt">
      <div @click="$emit('on-copy-url')">
        <i class="material-icons"> link </i>
        {{ $getTrans('copy-invitation-url') }}
      </div>
      <div
        @click="
          $emit('on-go-to-page', {
            name: 'JobEdit',
            params: {jobId: job._id},
          })
        "
      >
        {{ $getTrans('edit-job') }}
      </div>
      <div @click="$emit('on-clone-job')">{{ $getTrans('clone-job') }}</div>
      <div @click="$emit('on-open-preview')">{{ $getTrans('preview-job') }}</div>
      <div @click="$emit('on-share')">{{ $getTrans('share-job') }}</div>
    </template>
    <div @click="$emit('on-toggle-archive')">
      {{ job.archivedAt ? $getTrans('restore') : $getTrans('archive-job') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'on-remove-note-event',
    'on-remove-quest',
    'on-edit-template',
    'on-cv-upload',
    'on-clone-job',
    'on-open-preview',
    'on-share',
    'on-toggle-archive',
    'on-copy-url',
    'on-go-to-page',
    'set-ans-rule',
    'set-timelimit',
  ],
}
</script>
