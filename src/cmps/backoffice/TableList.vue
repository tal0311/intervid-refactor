<template>
  <AppLoader v-if="isFetching && !shouldGather" is-local="true" />
  <section v-else-if="isItemsToShow" class="table-list" :class="{cards: viewType === 'cards' && itemName === 'job'}">
    <SortableHeaders
      :sort="sort"
      :filter-by="filterBy"
      :selected-item-count="selectedItemCount"
      :item-count="totalItemCount"
      :items-per-page="itemsPerPage"
      @select-all="$emit('select-all', items)"
      @sort="$emit('sort', $event)"
    />

    <div class="list-content">
      <component
        v-for="item in items"
        :key="item._id"
        :is="itemName"
        :filter-by="filterBy"
        ref="preview"
        v-bind="getNamedProp(item)"
        :is-selected="isSelected(item)"
        @select="$emit('select', item)"
        @load-items="$emit('load-items')"
        @remove="$emit('remove', $event)"
      />

      <component v-if="isInfiniteScroll && !isAllItems" :is="skeletonToShow" v-observe-visibility="onScrollToBottom">
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
      // console.log('this.itemName', this.itemName)
      // console.log(cmps)
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
      return {[this.itemName]: item}
    },

    onScrollToBottom(isVisible) {
      if (!isVisible || !this.isInfiniteScroll || this.isAllItems) return
      this.$emit('load-next-items')
    },
  },

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
}
</script>
