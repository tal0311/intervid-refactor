<template>
  <section class="list-actions">
    <div v-if="selectedItemCount" class="actions">
      <i
        class="material-icons bottom-tooltip"
        :data-tooltip="filterBy.showArchived ? $getTrans('restore') : $getTrans('archive')"
        @click="$emit('archive')"
      >
        {{ filterBy.showArchived ? 'unarchive' : 'archive' }}
      </i>

      <i
        v-if="filterBy.showArchived"
        class="material-icons bottom-tooltip"
        :data-tooltip="getTrans('delete-permanently')"
        @click="$emit('remove')"
      >
        delete_forever
      </i>

      <i
        v-if="$route.name === 'ApplicantOverview' && !filterBy.showArchived && !isLockedItemSelected"
        class="material-icons bottom-tooltip"
        :data-tooltip="`Mark as ${isRead ? 'unread' : 'read'}`"
        @click="$emit('toggle-read')"
      >
        {{ isRead ? 'mail' : 'drafts' }}
      </i>
    </div>

    <AppPagination
      v-if="pageCount > 1"
      :item-count="itemCount"
      :page-count="pageCount"
      :curr-page="currPage"
      :items-per-page="itemsPerPage"
      @change-page="$emit('change-page', $event)"
    />
  </section>
</template>

<script>
import AppPagination from '@/cmps/common/AppPagination.vue'

export default {
  components: {AppPagination},
  props: [
    'selectedItemCount',
    'isLockedItemSelected',
    'itemCount',
    'filterBy',
    'currPage',
    'itemsPerPage',
    'isRead',
    'pageCount',
  ],
}
</script>
