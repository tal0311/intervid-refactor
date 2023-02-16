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

    <div class="status-modal">
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
// core
import { computed, ref } from "vue";
// lib
import { useStore } from "vuex";
// custom composables
import { useModal } from "@/composables/useModal.js";
// services
import { activityMap } from "@/services/activityService";
import { getStatusByCode, statusMap } from "@/services/constData";
// cmps
import MobileModal from "./modals/MobileModal.vue";

export default {
  props: ["applicant", "isShowArchived", "isFullWidth"],
  setup(props) {
    const store = useStore();
    const modalHeight = computed(() => 342);
    const modalWrapper = ref(null);

    const { isOpen, top, insetInlineStart, isBottom } = useModal({
      modalHeight,
      modalType: "status-picker",
      modalId: props.applicant.id,
      modalWrapper,
    });

    const isMobile = computed(() => {
      return store.getters["app/isMobile"];
    });

    const modalStyle = computed(() => {
      return {
        top: `${top.value}px`,
        insetInlineStart: `${insetInlineStart.value}px`,
      };
    });

    const modalClass = computed(() => {
      return {
        open: isOpen.value && !isMobile.value,
        top: isBottom.value,
      };
    });

    return {
      isOpen,
      modalClass,
      modalStyle,
    };
  },

  computed: {
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
  },

  methods: {
    toggleModal() {
      if (this.isDisabled || this.isShowArchived) return;
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
