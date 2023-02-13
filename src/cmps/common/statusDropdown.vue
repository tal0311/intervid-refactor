<template>
  <div
    class="status-dropdown"
    ref="modal-wrapper"
    :class="{ 'full-width': isFullWidth }"
  >
    <button
      class="status-btn"
      :class="{
        open: isOpen && !isMobile,
        recruitment: isRecruitmentStatus,
        top: isBottom,
      }"
      :style="{
        backgroundColor: isDisabled ? '#EBEEF2' : applicantStatus.color,
        color: isDisabled ? '#AAADB5' : '#fff',
      }"
      ref="status-btn"
      @click="toggleModal"
    >
      {{ getTrans(statusBtnTxt) }}
      <i v-if="!isDisabled && !isShowArchived" class="material-icons"
        >expand_more</i
      >
    </button>

    <div
      class="status-modal"
      :style="{ top: modalTop, width: modalWidth }"
      :class="{ open: isOpen && !isMobile, top: isBottom }"
    >
      <button
        v-for="(status, idx) in statusMap"
        :key="status.label"
        :style="{ backgroundColor: status.color }"
        @click="onSetStatus(idx)"
        :data-label="
          idx === '0'
            ? getTrans('evaluation')
            : idx === '5'
            ? getTrans('recruitment')
            : ''
        "
      >
        {{ getTrans(status.label) }}
      </button>
    </div>

    <mobile-modal
      v-if="isOpen && isMobile"
      cmpName="update status"
      :applicant="applicant"
      @on-close="toggleModal"
      @set-status="onSetStatus"
    />
  </div>
</template>

<script>
import { activityMap } from "@/services/activityService";
import { getStatusByCode, statusMap } from "@/services/constData";

import ModalMixin from "@/mixins/ModalMixin.js";
import MobileModal from "./modals/MobileModal.vue";

export default {
  props: ["applicant", "isShowArchived", "isFullWidth"],

  mixins: [ModalMixin],

  data() {
    return {
      modalHeight: 342,
    };
  },

  computed: {
    isMobile() {
      return this.$store.getters["app/isMobile"];
    },

    applicantStatus() {
      return getStatusByCode(this.applicant.status);
    },

    statusBtnTxt() {
      if (this.applicant.timestamp.quited) return "incomplete-interview";
      else if (!this.applicant.timestamp.submitted) return "in-progress";
      return this.applicantStatus.label;
    },

    isDisabled() {
      return !this.applicant.timestamp.submitted;
    },

    isRecruitmentStatus() {
      return (
        this.applicantStatus.label === "Offer sent" ||
        this.applicantStatus.label === "Not interested" ||
        this.applicantStatus.label === "Hired"
      );
    },

    statusMap() {
      return statusMap;
    },

    activityMap() {
      return activityMap;
    },

    modal() {
      return this.$store.getters["app/modal"];
    },

    isOpen() {
      return (
        this.modal.type === "status-picker" &&
        this.modal.data.modalId === this.applicant.id
      );
    },
  },

  methods: {
    toggleModal() {
      if (this.isDisabled || this.isShowArchived) return;
      this.setModalPosition();
      const modalId = this.isOpen ? null : this.applicant.id;
      this.$store.dispatch("app/toggleModal", {
        type: "status-picker",
        data: { modalId },
      });
    },

    async onSetStatus(statusCode) {
      this.toggleModal();
      if (statusCode === this.applicant.status) return;
      this.$emit("on-set-status", statusCode);
    },
  },

  components: {
    MobileModal,
  },
};
</script>
