<template>
  <section v-if="!isFetching" class="template-edit">
    <h2>{{ $getTrans('create-new-template') }}</h2>
    <form novalidate class="template-container" @submit.prevent="onSaveTemplate">
      <MainInput
        v-if="templateToEdit"
        v-model.trim="templateToEdit.title"
        input-name="title"
        placeholder="Enter title"
        validate="required"
        :on-blur="validateField"
        :errors="errors"
        styled="main"
      />

      <div class="template-content">
        <div class="quest-list">
          <QuestEdit
            v-for="(quest, idx) in quests"
            :key="quest.id"
            :idx="idx"
            :quest="quest"
            :errors="errors"
            @remove-quest="onRemoveQuest"
            @update-quest="onUpdateQuest"
            @validate-field="validateField"
          />
        </div>

        <div class="action-container">
          <button class="save-btn">{{ $getTrans('save') }}</button>
          <button type="button" class="add-quest" @click="onAddQuest">
            {{ $getTrans('add-question') }}
          </button>
        </div>
      </div>
    </form>

    <div v-if="isDialogOpen" class="confirmation-modal">
      <p>{{ $getTrans('confirmation-modal') }}</p>
      <div>
        <button data-ans="yes" @click="onDialogAns">
          {{ $getTrans('confirmation-modal-ans-yes') }}
        </button>
        <button data-ans="no" @click="onDialogAns">
          {{ $getTrans('confirmation-modal-ans-no') }}
        </button>
      </div>
    </div>
  </section>
  <AppLoader v-else />
</template>

<script>
import {templateService} from '@/services/templateService'
import {validate} from '@/services/errorService.js'

import QuestEdit from '@/cmps/backoffice/template/QuestEdit.vue'
import AppLoader from '@/cmps/common/AppLoader.vue'

export default {
  components: {
    QuestEdit,
    AppLoader,
  },

  async beforeRouteLeave(to, from, next) {
    const confirmation = await new Promise((res) => {
      this.dialogResolve = res
      this.isDialogOpen = true
    })
    if (confirmation === 'yes') next()
    else if (confirmation === 'no') next(false)
  },
  data() {
    return {
      templateToEdit: null,
      errors: null,
      isDialogOpen: false,
      dialogResolve: null,
    }
  },

  computed: {
    template() {
      return this.$store.getters['template/template']
    },

    quests() {
      return this.templateToEdit?.quests
    },

    isFetching() {
      return this.$store.getters['template/isFetching']
    },
  },

  async created() {
    const {templateId} = this.$route.params
    await this.loadTemplate(templateId)
  },

  methods: {
    async loadTemplate(templateId) {
      if (templateId) {
        await this.$store.dispatch('template/loadTemplate', {templateId})
        this.templateToEdit = this.$utilService.cloneDeep(this.template)
      } else {
        this.templateToEdit = templateService.getDefaultTemplate()
      }
    },

    onRemoveQuest(questId) {
      this.templateToEdit.quests = this.quests.filter((quest) => quest.id !== questId)
    },

    onUpdateQuest(quest) {
      this.templateToEdit.quests = this.quests.map((_quest) => (_quest.id === quest.id ? quest : _quest))
    },

    onAddQuest() {
      const quest = templateService.createQuest()
      this.templateToEdit.quests.push(quest)
      this.errors = []
    },

    async onSaveTemplate({target}) {
      this.errors = validate(target)
      if (this.errors?.length) return
      await this.$store.dispatch('template/saveTemplate', {
        template: {...this.templateToEdit},
      })
      this.$router.push({path: '/backoffice/template'})
      this.dialogResolve('yes')
    },

    validateField({target}) {
      if (!target.form) return
      if (!this.errors) return
      this.errors = validate(target.form)
    },

    onDialogAns({target}) {
      const ans = target.dataset.ans
      this.dialogResolve(ans)
      this.isDialogOpen = false
    },
  },
}
</script>
