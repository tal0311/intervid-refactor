<template>
  <loader v-if="isFetching && !shouldGather" isLocal="true" />
  <section v-else-if="isItemsToShow" class="table-list" :class="{ cards: viewType === 'cards' && itemName === 'job' }">
    <sortable-headers
      :sort="sort"
      :filterBy="filterBy"
      :selectedItemCount="selectedItemCount"
      :itemCount="totalItemCount"
      :itemsPerPage="itemsPerPage"
      @select-all="$emit('select-all', items)"
      @sort="$emit('sort', $event)"
    />

    <div class="list-content">
      <component
        v-for="item in items"
        :key="item._id"
        :is="componentToShow"
        :filterBy="filterBy"
        ref="preview"
        v-bind="getNamedProp(item)"
        :isSelected="isSelected(item)"
        @select="$emit('select', item)"
        @load-items="$emit('load-items')"
        @remove="$emit('remove', $event)"
      />

      <component v-if="isInfiniteScroll && !isAllItems" :is="skeletonToShow" v-observe-visibility="onScrollToBottom">
      </component>
    </div>
  </section>
  <empty-list v-else :itemName="itemName" />
</template>

<script>
import { isTabletScreen } from '@/services/utilService'

import TemplatePreview from '@/cmps/backoffice/template/TemplatePreview.vue'
import JobPreview from '@/cmps/backoffice/job/JobPreview.vue'
import ApplicantPreview from '@/cmps/backoffice/applicant/ApplicantPreview.vue'
import AccountPreview from '@/cmps/backoffice/admin/AccountPreview.vue'
import RecordPreview from '@/cmps/backoffice/admin/RecordPreview.vue'
import ActivityPreview from '@/cmps/backoffice/admin/ActivityPreview.vue'
import SortableHeaders from '@/cmps/common/SortableHeaders.vue'
import ListActions from '@/cmps/backoffice/ListActions.vue'
import Loader from '@/cmps/common/Loader.vue'
import EmptyList from '@/cmps/backoffice/EmptyList.vue'
import JobSkeleton from './job/JobSkeleton.vue'
import ApplicantSkeleton from './applicant/ApplicantSkeleton.vue'

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
      cmps: {
        template: TemplatePreview,
        job: JobPreview,
        applicant: ApplicantPreview,
        account: AccountPreview,
        record: RecordPreview,
        activity: ActivityPreview,
      },
      skeletons: {
        job: JobSkeleton,
        applicant: ApplicantSkeleton,
      },
    }
  },

  computed: {
    itemName() {
      const itemNames = Object.keys(this.cmps)
      return itemNames.find((itemName) => this.$route.path.includes(itemName))
    },

    isItemsToShow() {
      return this.items?.length
    },

    componentToShow() {
      return this.cmps[this.itemName]
    },

    skeletonToShow() {
      return this.skeletons[this.itemName]
    },

    isInfiniteScroll() {
      return isTabletScreen()
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

  components: {
    TemplatePreview,
    JobPreview,
    ApplicantPreview,
    ListActions,
    Loader,
    SortableHeaders,
    EmptyList,
    AccountPreview,
    ActivityPreview,
    JobSkeleton,
  },
}
</script>
