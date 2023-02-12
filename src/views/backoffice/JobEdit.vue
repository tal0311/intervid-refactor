<template>
  <section class="job-edit" v-if="job">
    <form @input="handleChange" ref="jobForm" novalidate class="form" v-if="!isFetching" @submit.prevent="">
      <job-form :job="job" :errors="jobEditErrors" @update-job="validateForm" @validate-field="validateField" />

      <div class="quest-list">
        <draggable
          v-model="job.quests"
          @end="onDragEnd"
          v-bind="dragOptions"
          handle=".drag-indicator"
          ghost-class="ghost"
        >
          <quest-edit
            v-for="(quest, idx) in job.quests"
            :key="quest.id"
            :idx="idx"
            :quest="quest"
            :questsCount="job.quests.length"
            :errors="jobEditErrors"
            @remove-quest="onRemoveQuest"
            @update-quest="onUpdateQuest"
            @duplicate-quest="onDuplicateQuest"
            @validate-field="validateField"
            :isOneTry="job.rule.isOneTry"
          />
          <!-- TODO: Delete isOneTry prop on V2 -->
        </draggable>
      </div>

      <div class="add add-quest" @click="onAddQuest">
        <i class="material-icons">add_circle_outline</i>
        {{getTrans('add-question')}}
      </div>

      <button
        class="send-btn"
        :class="[{disabled: !jobToEdit._id || (jobEditErrors && jobEditErrors.length)},{selected:onShare}]"
        @click.prevent="onShare"
      >
        {{getTrans('send')}}
      </button>
    </form>

    <loader v-else />
  </section>
</template>

<script>
import {debounce} from '@/services/utilService'
import {msgService} from '@/services/msgService'
import {validate} from '@/services/errorService.js'
import {templateService} from '@/services/templateService'

import cloneDeep from 'lodash.clonedeep'
import draggable from 'vuedraggable'

import QuestEdit from '@/cmps/JobEdit/QuestEdit.vue'
import JobForm from '@/cmps/JobEdit/JobForm.vue'
import Loader from '@/cmps/common/Loader.vue'
import config from '@/config'

export default {
  data() {
    return {
      job: null,
    }
  },

  async created() {
    await this.loadJob()
    this.job = cloneDeep(this.jobToEdit)
    if (this.$route.query.templateId) await this.loadTemplateQuests()
  },

  mounted() {
    this.$root.$on('share-job', this.onShare)
    this.$nextTick(this.validateForm)
  },

  beforeDestroy() {
    this.$root.$off('share-job', this.onShare)
  },

  destroyed() {
    this.$store.commit('job/setIsFirstChange', true)
  },

  computed: {
    jobToEdit() {
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
      this.$store.commit('job/setJobEditErrors', {jobEditErrors: validate(target.form)})
    },

    async validateForm() {
      const target = this.$refs.jobForm
      if (!target) return
      this.$store.commit('job/setJobEditErrors', {jobEditErrors: validate(target)})
      if (this.jobEditErrors.length) return
      if (this.isFirstChange) this.$store.commit('job/setIsFirstChange', false)
      await this.saveJob()
    },

    handleChange: debounce(async function ({target}) {
      if (target.name && (target.name === 'search' || target.name.includes('upload'))) return
      await this.validateForm()
    }, 1500),

    onDragEnd(ev) {
      if (ev.oldIndex === ev.newIndex) return
      this.handleChange({target: ev.target})
    },

    async loadTemplateQuests() {
      const template = await templateService.getById(this.$route.query.templateId)
      this.job = {
        ...this.job,
        info: {...this.job.info, title: template.title, coverUrl: template.coverUrl},
        quests: template.quests,
      }
    },

    onShare() {
      if (!this.jobToEdit._id || (this.jobEditErrors && this.jobEditErrors.length)) return
      if (this.isMobile && navigator.share) {
        navigator.share({
          title: 'Interview invitation via Intervid',
          text: `${this.jobToEdit.company.name} is seeking for ${this.jobToEdit.info.title}. Click the link to start your interview`,
          url: this.invitationUrl,
        })
      } else {
        this.$store.dispatch('app/toggleModal', {type: 'share', isDarkScreen: true})
      }
    },

    setDefaultValue(inputName) {
      if (inputName === 'title') {
        this.job.info.title = this.getTrans('untitled-job')
      } else if (inputName === 'company') {
        this.job.company.name = this.getTrans('company')
      } else if (inputName.startsWith('quest-title-')) {
        this.job.quests.forEach((quest) => {
          if (quest.txt) return
          quest.txt = this.getTrans('question')
        })
      }
    },
  },

  watch: {
    jobToEdit() {
      this.job = cloneDeep(this.jobToEdit)
    },
  },

  components: {JobForm, QuestEdit, Loader, draggable},
}
</script>
