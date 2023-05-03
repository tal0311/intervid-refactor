<template>
  <metainfo>
    <template #title="{content}">{{ content ? `${content} | Intervid` : `Intervid` }}</template>
  </metainfo>
  <RouterView />
</template>
