<template>
  <table class="data-table">
    <thead>
      <tr>
        <th
          v-for="header in headers"
          :key="header.idx"
          :class="{ actions: header.txt === 'Actions' }"
        >
          {{ getTrans(header.txt) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item._id || item.id"
        @click="$emit('item-clicked', item)"
      >
        <td v-for="dataHead in dataHeaders" :key="dataHead.key + item._id">
          {{ item[dataHead.key] }}
        </td>
        <td class="actions">
          <slot v-bind="item" name="actions" />
        </td>
      </tr>
      <tr v-if="!items || !items.length">
        <td class="no-results" :colspan="headers.length">
          {{ getTrans("no-results") }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["items", "headers"],

  computed: {
    dataHeaders() {
      return this.headers.filter((head) => head.txt !== "Actions");
    },
  },
};
</script>
