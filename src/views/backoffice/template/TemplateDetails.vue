<template>
  <section class="template-details" v-if="!isFetching">
    <div class="template-nav" @click="onGoBack">
      <i class="material-icons">chevron_left</i>
      <span>{{ getTrans('go-back') }}</span>
    </div>
    <div class="template-header">
      <h3>{{ template.title }}</h3>
      <div class="btn-container">
        <button class="use-template-btn">{{ getTrans('use-template') }}</button>
        <template-menu :template="template" @archive="onToggleArchive" @default="onToggleIsDefault" />
      </div>
    </div>

    <div class="quest-list">
      <quest-preview v-for="(quest, idx) in template.quests" :key="quest.id" :quest="quest" :idx="idx" />
    </div>
  </section>
  <app-loader v-else />
</template>

<script>
import {sessionService} from '@/services/sessionService'

import QuestPreview from '@/cmps/backoffice/template/QuestPreview.vue'
import TemplateMenu from '@/cmps/backoffice/template/TemplateMenu.vue'
import AppLoader from '@/cmps/common/AppLoader.vue'

export default {
  data() {
    return {
      isMenuOpen: false,
    }
  },

  async created() {
    this.loadTemplate()
  },

  computed: {
    template() {
      return this.$store.getters['template/template']
    },

    isFetching() {
      return this.$store.getters['template/isFetching']
    },
  },

  methods: {
    onCloseMenu() {
      this.isMenuOpen = false
    },

    async loadTemplate() {
      const {templateId} = this.$route.params
      await this.$store.dispatch('template/loadTemplate', {templateId})
    },

    onToggleIsDefault() {
      const template = {
        ...this.template,
        isDefault: !this.template.isDefault,
      }
      this.$store.dispatch('template/toggleIsDefault', {template})
      this.onCloseMenu()
    },

    async onToggleArchive() {
      await this.$store.dispatch('template/toggleArchiveTemplate', {
        template: {...this.template},
      })
      this.backToBackoffice()
    },

    onGoBack() {
      const filterBy = sessionService.getFilter()
      this.$router.push({
        path: '/backoffice/template',
        query: filterBy || {},
      })
    },
  },

  components: {
    QuestPreview,
    TemplateMenu,
    AppLoader,
  },
}
</script>
