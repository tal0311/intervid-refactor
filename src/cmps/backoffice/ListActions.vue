<template>
  <section class="list-actions">
    <div class="actions" v-if="selectedItemCount">
      <i
        class="material-icons bottom-tooltip"
        @click="$emit('archive')"
        :data-tooltip="filterBy.showArchived ? getTrans('restore') : getTrans('archive')"
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

    <app-pagination
      v-if="pageCount > 1"
      :itemCount="itemCount"
      :pageCount="pageCount"
      :currPage="currPage"
      :itemsPerPage="itemsPerPage"
      @change-page="$emit('change-page', $event)"
    />
  </section>
</template>

<script>
import AppPagination from '@/cmps/common/AppPagination.vue'

export default {
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

  components: {AppPagination},
}
</script>
