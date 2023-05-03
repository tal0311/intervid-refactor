<template>
  <AppLoader v-if="isFetching && !shouldGather" :is-local="true" />
  <section v-else-if="isItemsToShow" class="table-list" :class="{ cards: viewType === 'cards' && itemName === 'job' }">
    <SortableHeaders :sort="sort" :filter-by="filterBy" :selected-item-count="selectedItemCount"
      :item-count="totalItemCount" :items-per-page="itemsPerPage" @select-all="$emit('select-all', items)"
      @sort="$emit('sort', $event)" />

    <div class="list-content">
      <component :is="itemName" v-for="item in items" :key="item._id" ref="preview" :filter-by="filterBy"
        v-bind="getNamedProp(item)" :is-selected="isSelected(item)" @select="$emit('select', item)"
        @load-items="$emit('load-items')" @remove="$emit('remove', $event)" />

      <component :is="skeletonToShow" v-if="isInfiniteScroll && !isAllItems" v-observe-visibility="onScrollToBottom">
      </component>
    </div>
  </section>
  <EmptyList v-else :item-name="itemName" />
</template>

<script>
import TemplatePreview from '@/cmps/backoffice/template/TemplatePreview.vue'
import JobPreview from '@/cmps/backoffice/job/JobPreview.vue'
import ApplicantPreview from '@/cmps/backoffice/applicant/ApplicantPreview.vue'
import AccountPreview from '@/cmps/backoffice/admin/AccountPreview.vue'
import RecordPreview from '@/cmps/backoffice/admin/RecordPreview.vue'
import ActivityPreview from '@/cmps/backoffice/admin/ActivityPreview.vue'
import SortableHeaders from '@/cmps/common/SortableHeaders.vue'
import ListActions from '@/cmps/backoffice/ListActions.vue'
import AppLoader from '@/cmps/common/AppLoader.vue'
import EmptyList from '@/cmps/backoffice/EmptyList.vue'
import JobSkeleton from './job/JobSkeleton.vue'
import ApplicantSkeleton from './applicant/ApplicantSkeleton.vue'

// const cmps = {
//   template: TemplatePreview,
//   job: JobPreview,
//   applicant: ApplicantPreview,
//   account: AccountPreview,
//   record: RecordPreview,
//   activity: ActivityPreview,
// }
export default {
  components: {
    //   template: TemplatePreview,
    job: JobPreview,
    applicant: ApplicantPreview,
    account: AccountPreview,
    record: RecordPreview,
    activity: ActivityPreview,
    TemplatePreview,
    ListActions,
    AppLoader,
    SortableHeaders,
    EmptyList,
    jobSkeleton: JobSkeleton,
    applicantSkeleton: ApplicantSkeleton,
  },
  // TODO: I disabled the lint rule here because the props are very complex, so I wanted to leave it for when we look the at this cmp more thoroughly.
  /* eslint-disable vue/require-prop-types */
  props: [
    'items',
    'selectedItemCount',
    'filteredItemCount',
    'totalItemCount',
    'maxItemCount',
    'shouldGather',
    'itemsPerPage',
    'sort',
    'filterBy',
    'isFetching',
    'isSelected',
  ],
  /* eslint-enable vue/require-prop-types */
  emits: ['select', 'select-all', 'remove', 'sort', 'load-items', 'load-next-items'],

  data() {
    return {
      // skeletons: {
      //   job: JobSkeleton,
      //   applicant: ApplicantSkeleton,
      // },
    }
  },

  computed: {
    itemName() {
      const itemNames = ['job', 'applicant', 'account', 'record', 'activity']
      return itemNames.find((itemName) => this.$route.path.includes(itemName))
    },

    isItemsToShow() {
      return this.items?.length
    },

    componentToShow() {
      return this.itemName
    },

    skeletonToShow() {
      return ApplicantSkeleton
    },

    isInfiniteScroll() {
      return this.$utilService.isTabletScreen()
    },

    isAllItems() {
      return this.items.length >= this.filteredItemCount
    },

    viewType() {
      return this.$store.getters['job/viewType']
    },
  },

  methods: {
    getNamedProp(item) {
      return { [this.itemName]: item }
    },

    onScrollToBottom(isVisible) {
      if (!isVisible || !this.isInfiniteScroll || this.isAllItems) return
      this.$emit('load-next-items')
    },
  },
}
</script>
