<template>
  <metainfo>
    <template v-slot:title="{content}">{{ content ? `${content} | Intervid` : `Intervid` }}</template>
  </metainfo>
  <RouterView />
</template>
