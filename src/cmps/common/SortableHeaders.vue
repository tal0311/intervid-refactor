<template>
  <div class="list-header">
    <div class="list-item checkbox" v-if="itemCount >= 0">
      <checkbox
        :checked="allChecked"
        :partial="partialChecked"
        @input="$emit('select-all')"
        class="checkbox"
      />
    </div>
    <div
      v-for="(header, idx) in headers"
      :key="idx"
      @click="!isFreeUser && $emit('sort', header.key)"
      class="header-item"
      :class="{ [header.class]: header.class }"
    >
      <div :class="getSortableClass(header)">
        <span v-if="header.txt"> {{ getTrans(header.txt) }}</span>
        <span v-if="header.txt && !isFreeUser" class="sort-arrows"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { advancedPermsMap, getSortableHeaders } from "@/services/constData.js";
import { userService } from "@/services/userService";

export default {
  props: ["sort", "filterBy", "selectedItemCount", "itemCount", "itemsPerPage"],

  data() {
    return {
      headers: [],
    };
  },

  mounted() {
    this.headers = getSortableHeaders(this.$route.path, this.filterBy);
  },

  computed: {
    isFreeUser() {
      return !userService.verifyPerm(advancedPermsMap.UNLIMITED_INTERVIEWS);
    },

    allChecked() {
      const maxItemCount =
        this.itemCount < this.itemsPerPage ? this.itemCount : this.itemsPerPage;
      return this.selectedItemCount && this.selectedItemCount === +maxItemCount;
    },

    partialChecked() {
      return (
        !!this.selectedItemCount && this.selectedItemCount !== this.itemCount
      );
    },
  },

  methods: {
    getSortableClass(header) {
      return `${header.key ? "sortable" : ""} ${
        this.isFreeUser ? "disabled" : ""
      } ${this.sort.by === header.key ? this.sort.dir : ""}`;
    },
  },
};
</script>
