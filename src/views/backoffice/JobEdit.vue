<template>
  <section v-if="job" class="job-edit">
    <form v-if="!isFetching" ref="jobForm" novalidate class="form" @input="handleChange" @submit.prevent="">
      <JobForm :job="job" :errors="jobEditErrors" @update-job="validateForm" @validate-field="validateField" />

      <div class="quest-list">
        <draggable
          v-model="job.quests"
          v-bind="dragOptions"
          handle=".drag-indicator"
          ghost-class="ghost"
          item-key="id"
          @end="onDragEnd"
        >
          <!-- This is destructuring, just like doing someFunc({element:quest,index:idx}) ,
          element is the name provided in the draggable component, and quest is the name of the variable
          see: https://github.com/SortableJS/vue.draggable.next#migrate-from-vue-2-version
        -->
          <template #item="{element: quest, index: idx}">
            <QuestEdit
              :idx="idx"
              :quest="quest"
              :quests-count="job.quests.length"
              :errors="jobEditErrors"
              :is-one-try="job.rule.isOneTry"
              @remove-quest="onRemoveQuest"
              @update-quest="onUpdateQuest"
              @duplicate-quest="onDuplicateQuest"
              @validate-field="validateField"
            />
          </template>
          <!-- TODO: Delete isOneTry prop on V2 -->
        </draggable>
      </div>

      <div class="add add-quest" @click="onAddQuest">
        <i class="material-icons">add_circle_outline</i>
        {{ $getTrans('add-question') }}
      </div>

      <button
        class="send-btn"
        :class="[
          {
            disabled: !jobToEdit._id || (jobEditErrors && jobEditErrors.length),
          },
          {selected: onShare},
        ]"
        @click.prevent="onShare"
      >
        {{ $getTrans('send') }}
      </button>
    </form>

    <AppLoader v-else />
  </section>
</template>

<script>
import {msgService} from '@/services/msgService'
import {validate} from '@/services/errorService.js'
import {templateService} from '@/services/templateService'

import draggable from 'vuedraggable'

import QuestEdit from '@/cmps/JobEdit/QuestEdit.vue'
import JobForm from '@/cmps/JobEdit/JobForm.vue'
import AppLoader from '@/cmps/common/AppLoader.vue'
import config from '@/config'
import {useShareJob} from '@/composables/job/useShareJob'

export default {
  components: {JobForm, QuestEdit, AppLoader, draggable},
  setup() {
    return {
      onShareJob: useShareJob(),
    }
  },
  data() {
    return {
      job: null,
    }
  },

  computed: {
    jobToEdit() {
      console.log('jobToEdit', this.$store.getters['job/jobToEdit'])
      return this.$store.getters['job/jobToEdit']
    },

    dragOptions() {
      return {
        animation: 200,
        // group: "description",
        disabled: false,
        ghostClass: 'ghost',
      }
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    isFetching() {
      return this.$store.getters['job/isFetching']
    },

    isFirstChange() {
      return this.$store.getters['job/isFirstChange']
    },

    jobEditErrors() {
      return this.$store.getters['job/jobEditErrors']
    },

    invitationUrl() {
      return `${config.baseUrl}interview/${this.jobToEdit._id}`
    },
  },

  watch: {
    jobToEdit() {
      this.job = this.$utilService.deepClone(this.jobToEdit)
    },
  },

  async created() {
    await this.loadJob()
    this.job = this.$utilService.deepClone(this.jobToEdit)
    if (this.$route.query.templateId) await this.loadTemplateQuests()
  },

  mounted() {
    // this.$root.$on('share-job', this.onShare)
    this.$nextTick(this.validateForm)
  },

  beforeUnmount() {
    // this.$root.$off('share-job', this.onShare)
  },

  unmounted() {
    this.$store.commit('job/setIsFirstChange', true)
  },

  methods: {
    async loadJob() {
      const {jobId} = this.$route.params
      await this.$store.dispatch('job/loadJobToEdit', {jobId})
    },

    async addJob() {
      await this.$store.dispatch('job/addJob', {job: this.job})
      this.$router.push(`/create/${this.job._id}`)
    },

    async updateJob() {
      await this.$store.dispatch('job/updateJob', {job: this.job})
    },

    async saveJob() {
      if (!this.job._id) await this.addJob()
      else await this.updateJob()
    },

    async onAddQuest() {
      const quest = templateService.createQuest()
      this.job.quests.push(quest)
      this.$nextTick(this.validateForm)
    },

    async onUpdateQuest() {
      await this.validateForm()
    },

    async onDuplicateQuest({txt, desc, ansRule, timeLimit}) {
      const duplicatedQuest = templateService.createQuest(txt, desc, ansRule, timeLimit)
      this.job.quests.push(duplicatedQuest)
      await this.validateForm()
    },

    async onRemoveQuest(questId) {
      this.job.quests = this.job.quests.filter((quest) => quest.id !== questId)
      this.$nextTick(this.validateForm)
      const msg = msgService.remove('question', 1, true)
      this.$store.commit('app/setAlertData', {alertData: msg})
    },

    validateField({target}) {
      if (!target.value) {
        this.setDefaultValue(target.name)
      }
      if (!target.form) return
      if (!this.jobEditErrors.length) return
      this.$store.commit('job/setJobEditErrors', {
        jobEditErrors: validate(target.form),
      })
    },

    async validateForm() {
      const target = this.$refs.jobForm
      if (!target) return
      this.$store.commit('job/setJobEditErrors', {
        jobEditErrors: validate(target),
      })
      if (this.jobEditErrors.length) return
      if (this.isFirstChange) this.$store.commit('job/setIsFirstChange', false)
      await this.saveJob()
    },
    // v model on components

    async handleChange(target) {
      // what this condition means?
      if (target.name && (target.name === 'search' || target.name.includes('upload'))) return
      await this.validateForm()
    },

    onDragEnd(ev) {
      if (ev.oldIndex === ev.newIndex) return
      this.handleChange({target: ev.target})
    },

    async loadTemplateQuests() {
      const template = await templateService.getById(this.$route.query.templateId)
      this.job = {
        ...this.job,
        info: {
          ...this.job.info,
          title: template.title,
          coverUrl: template.coverUrl,
        },
        quests: template.quests,
      }
    },

    onShare() {
      this.onShareJob()
      // if (!this.jobToEdit._id || (this.jobEditErrors && this.jobEditErrors.length)) return
      // if (this.isMobile && navigator.share) {
      //   navigator.share({
      //     title: 'Interview invitation via Intervid',
      //     text: `${this.jobToEdit.company.name} is seeking for ${this.jobToEdit.info.title}. Click the link to start your interview`,
      //     url: this.invitationUrl,
      //   })
      // } else {
      //   this.$store.dispatch('app/toggleModal', {
      //     type: 'share',
      //     isDarkScreen: true,
      //   })
      // }
    },

    setDefaultValue(inputName) {
      if (inputName === 'title') {
        this.job.info.title = this.$getTrans('untitled-job')
      } else if (inputName === 'company') {
        this.job.company.name = this.$getTrans('company')
      } else if (inputName.startsWith('quest-title-')) {
        this.job.quests.forEach((quest) => {
          if (quest.txt) return
          quest.txt = this.$getTrans('question')
        })
      }
    },
  },
}
</script>
