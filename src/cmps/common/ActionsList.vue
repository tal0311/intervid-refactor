<template>
  <section class="action-list">
    <div v-if="selectedItemCount" class="actions">
      <section>
        <div
          class="pointer"
          @click="$emit('archive')"
          v-html="filterBy.showArchived ? $getSvg('unArchive') : $getSvg('archive')"
        ></div>
        <p>{{ filterBy.showArchived ? 'Unarchive' : 'Archive' }}</p>
      </section>
      <section v-if="$route.name === 'ApplicantOverview' && !filterBy.showArchived && !isLockedItemSelected">
        <div
          class="pointer"
          @click="$emit(filterBy.showArchived ? 'remove' : 'toggleRead')"
          v-html="filterBy.showArchived ? $getSvg('delete') : $getSvg('visability')"
        ></div>
        <p>{{ filterBy.showArchived ? 'Delete' : 'Read' }}</p>
      </section>
      <!-- <i
        v-if="filterBy.showArchived"
        class="material-icons bottom-tooltip"
        :data-tooltip="getTrans('delete-permanently')"
        @click="$emit('remove')"
      >
        delete_forever
      </i> -->

      <!-- <i
        v-if="$route.name === 'ApplicantOverview' && !filterBy.showArchived && !isLockedItemSelected"
        class="material-icons bottom-tooltip"
        :data-tooltip="`Mark as ${isRead ? 'unread' : 'read'}`"
        @click="$emit('toggle-read')"
      >
        {{ isRead ? 'mail' : 'drafts' }}
      </i> -->
    </div>
  </section>
</template>

<script>
export default {
  props: {
    selectedItemCount: {
      type: Number,
      required: true,
    },
    isLockedItemSelected: {
      type: Boolean,
    },
    filterBy: {
      type: Object,
      required: true,
    },
    isRead: {
      type: Boolean,
    },
    itemCount: {
      type: Number,
      required: true,
    },
  },
  emits: ['archive'],
}
</script>
