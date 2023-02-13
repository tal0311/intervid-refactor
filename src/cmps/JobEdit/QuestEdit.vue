<template>
  <section class="quest-edit">
    <i v-if="questsCount > 1" class="material-icons drag-indicator">
      drag_indicator
    </i>
    <div class="quest-header">
      <h4>{{ getTrans("question") }} {{ idx + 1 }}</h4>
      <div class="quest-rules">
        <timelimit-menu :quest="quest" @change-timelimit="onUpdateQuest" />
        <ans-rule-menu
          :quest="quest"
          :isOneTry="isOneTry"
          @change-ans="onUpdateQuest"
        />
      </div>

      <div class="quest-actions-modal" :class="{ open: isActionsModalOpen }">
        <button type="button" class="menu-btn" @click="toggleModal">
          <i class="material-icons">more_horiz</i>
        </button>

        <div class="answer-modal">
          <button type="button" class="menu-btn" @click="onDuplicateQuest">
            <i class="material-icons">content_copy</i>
            {{ getTrans("duplicate") }}
          </button>
          <button
            type="button"
            class="menu-btn remove"
            v-if="questsCount > 1"
            @click="onRemoveQuest"
          >
            <i class="material-icons"> delete_outline </i>
            {{ getTrans("remove") }}
          </button>
        </div>
      </div>
    </div>

    <div class="quest-content">
      <div class="quest-title">
        <main-input
          :inputName="`quest-title-${quest.id}`"
          :placeholder="getTrans('question')"
          validate="required"
          v-model.trim="quest.txt"
          :onBlur="validateField"
          :errors="errors"
          styled="main"
        />
      </div>

      <text-editor
        placeholder="Elaborate (optional)"
        v-model.trim="quest.desc"
        :tools="['code', 'link']"
      />
    </div>

    <div class="quest-actions">
      <div class="quest-rules">
        <timelimit-menu :quest="quest" @change-timelimit="onUpdateQuest" />
        <ans-rule-menu
          :quest="quest"
          :isOneTry="isOneTry"
          @change-ans="onUpdateQuest"
        />
      </div>

      <div class="actions">
        <i
          class="icon material-icons duplicate-btn"
          @click="onDuplicateQuest"
          :title="getTrans('duplicate')"
          >content_copy</i
        >
        <i
          v-if="questsCount > 1"
          class="icon material-icons remove-btn"
          @click="onRemoveQuest"
          :title="getTrans('remove')"
          >delete_outline</i
        >
      </div>
    </div>
  </section>
</template>

<script>
import { getTimeLimits } from "@/services/constData";

import TextEditor from "@/cmps/common/TextEditor.vue";
import AnsRuleMenu from "./AnsRuleMenu.vue";
import TimelimitMenu from "./TimelimitMenu.vue";

export default {
  props: ["quest", "errors", "idx", "isOneTry", "questsCount"],

  computed: {
    isMobile() {
      return this.$store.getters["app/isMobile"];
    },

    timeLimits() {
      return getTimeLimits();
    },

    modal() {
      return this.$store.getters["app/modal"];
    },

    isActionsModalOpen() {
      return (
        this.modal.type === "quest-actions" &&
        this.modal.data.modalId === this.quest.id
      );
    },
  },

  methods: {
    onRemoveQuest() {
      this.$emit("remove-quest", this.quest.id);
    },

    onUpdateQuest() {
      this.$emit("update-quest");
    },

    onDuplicateQuest() {
      this.$emit("duplicate-quest", this.quest);
    },

    validateField(ev) {
      this.$emit("validate-field", ev);
    },

    toggleModal() {
      const modalId = this.isActionsModalOpen ? null : this.quest.id;
      this.$store.dispatch("app/toggleModal", {
        type: "quest-actions",
        data: { modalId },
      });
    },
  },

  components: { TextEditor, AnsRuleMenu, TimelimitMenu },
};
</script>
