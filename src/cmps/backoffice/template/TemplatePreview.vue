<template>
  <section class="template-preview" :class="{selected: isSelected}" @click="goToDetails">
    <div class="checkbox" @click.stop="">
      <CheckboxInput :value="isSelected" @input="$emit('select')" />
    </div>

    <div class="title">
      {{ template.title }}
    </div>

    <div class="owner">
      {{ ownerFullName }}
    </div>

    <div class="created-at">
      {{ templateCreationDate }}
    </div>

    <div class="use-template" @click.stop="">
      <button v-if="!$route.path.includes('archive')" class="use-template-btn" @click="onUseTemplate">
        {{ $getTrans('use') }}
      </button>
    </div>

    <div class="actions" @click.stop="">
      <template-menu :template="template" @archive="onToggleArchive" @default="toggleIsDefault" />
    </div>
  </section>
</template>

<script>
import TemplateMenu from '@/cmps/backoffice/template/TemplateMenu.vue'

export default {
  components: {TemplateMenu},

  props: ['template', 'isSelected'],

  computed: {
    ownerFullName() {
      // return this.$getFullName(this.template.owner)
      return this.$utilService.getFullName(this.template.owner)
    },

    isDefault() {
      return this.template?.isDefault
    },

    templateCreationDate() {
      const date = this.template.createdAt
      if (!date) return 'None'
      return this.$formatDate(date)
    },
  },

  methods: {
    onToggleArchive() {
      const template = this.$utilService.deepClone(this.template)
      this.$store.dispatch('template/toggleArchivedTemplate', {template})
    },

    toggleIsDefault() {
      const template = {
        ...this.template,
        isDefault: this.template.isDefault ? !this.template.isDefault : true,
      }
      this.$store.dispatch('template/toggleIsDefault', {template})
    },

    goToDetails() {
      if (this.$route.path.includes('archive')) return
      this.$router.push({
        name: 'TemplateDetails',
        params: {templateId: this.template._id},
      })
    },

    onUseTemplate() {
      this.$router.push({
        name: 'JobEdit',
        query: {templateId: this.template._id},
      })
    },
  },
}
</script>
