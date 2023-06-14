<template>
  <section class="quest-edit">
    <i v-if="questsCount > 1" class="material-icons drag-indicator"> drag_indicator </i>
    <div class="quest-header">
      <h4>{{ $getTrans('question') }} {{ idx + 1 }}</h4>
      <div class="quest-rules">
        <TimelimitMenu :quest="mutableQuest" @change-timelimit="onUpdateQuest" />
        <AnsRuleMenu :quest="mutableQuest" :is-one-try="isOneTry" @change-ans="onUpdateQuest" />
      </div>

      <div class="quest-actions-modal" :class="{open: isActionsModalOpen}">
        <button type="button" class="menu-btn" @click="toggleModal">
          <i class="material-icons">more_horiz</i>
        </button>

        <div class="answer-modal">
          <button type="button" class="menu-btn" @click="onDuplicateQuest">
            <i class="material-icons">content_copy</i>
            {{ $getTrans('duplicate') }}
          </button>
          <button v-if="questsCount > 1" type="button" class="menu-btn remove" @click="onRemoveQuest">
            <i class="material-icons"> delete_outline </i>
            {{ $getTrans('remove') }}
          </button>
        </div>
      </div>
    </div>

    <div class="quest-content">
      <div class="quest-title">
        <MainInput
          v-model="mutableQuest.txt"
          :input-name="`quest-title-${mutableQuest.id}`"
          :placeholder="$getTrans('question')"
          validate="required"
          :on-blur="validateField"
          :errors="errors"
          styled="main"
          @update:model-value="onUpdateQuest"
        />
      </div>

      <TextEditor
        v-model="mutableQuest.desc"
        placeholder="Elaborate (optional)"
        :tools="['code', 'link']"
        @update:model-value="onUpdateQuest"
      />
    </div>

    <div class="quest-actions">
      <div class="quest-rules">
        <TimelimitMenu :quest="mutableQuest" @change-timelimit="onUpdateQuest" />
        <AnsRuleMenu :quest="mutableQuest" :is-one-try="isOneTry" @change-ans="onUpdateQuest" />
      </div>

      <div class="actions">
        <i class="icon material-icons duplicate-btn" :title="$getTrans('duplicate')" @click="onDuplicateQuest"
          >content_copy</i
        >
        <i
          v-if="questsCount > 1"
          class="icon material-icons remove-btn"
          :title="$getTrans('remove')"
          @click="onRemoveQuest"
          >delete_outline</i
        >
      </div>
    </div>
  </section>
</template>

<script>
import {getTimeLimits} from '@/services/constData'

import TextEditor from '@/cmps/common/TextEditor.vue'
import AnsRuleMenu from './AnsRuleMenu.vue'
import TimelimitMenu from './TimelimitMenu.vue'

export default {
  components: {TextEditor, AnsRuleMenu, TimelimitMenu},
  props: {
    quest: {
      type: Object,
      required: true,
    },
    errors: {
      type: Object,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
    isOneTry: {
      type: Boolean,
      required: true,
    },
    questsCount: {
      type: Number,
      required: true,
    },
  },
  emits: ['remove-quest', 'update-quest', 'duplicate-quest', 'validate-field'],

  data() {
    return {
      mutableQuest: this.quest,
    }
  },

  computed: {
    isMobileScreen() {
      return this.$store.getters['app/isMobileScreen']
    },

    timeLimits() {
      return getTimeLimits(this.$getTrans('mini-minutes'))
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isActionsModalOpen() {
      return this.modal.type === 'quest-actions' && this.modal.data.modalId === this.mutableQuest.id
    },
  },

  methods: {
    onRemoveQuest() {
      this.$emit('remove-quest', this.mutableQuest.id)
    },

    onUpdateQuest() {
      this.$emit('update-quest', this.mutableQuest)
    },

    onDuplicateQuest() {
      this.$emit('duplicate-quest', this.mutableQuest)
    },

    validateField(ev) {
      this.$emit('validate-field', ev)
    },

    toggleModal() {
      const modalId = this.isActionsModalOpen ? null : this.mutableQuest.id
      this.$store.dispatch('app/toggleModal', {
        type: 'quest-actions',
        data: {modalId},
      })
    },
  },
}
</script>
