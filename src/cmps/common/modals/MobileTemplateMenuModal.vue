<template>
  <div class="mobile-template-menu-modal mobile-modal-content">
    <button @click="$emit('on-edit-template')">{{ $getTrans('edit') }}</button>
    <button v-if="!isDefault" @click="$emit('emit-action', 'default')">
      {{ $getTrans('make-default') }}
    </button>
    <button @click="$emit('emit-action', 'archive')">
      {{ archivedAt ? $getTrans('restore') : $getTrans('archive') }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    template: {
      type: Object,
      required: true,
    },
  },
  emits: ['emit-action', 'on-edit-template'],

  computed: {
    isDefault() {
      return this.template?.isDefault
    },

    archivedAt() {
      return this.template?.archivedAt
    },
  },

  methods: {},
}
</script>
