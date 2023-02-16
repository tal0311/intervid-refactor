<template>
  <section class="action-menu" ref="modal-wrapper">
    <button class="menu-btn" @click="toggleModal">
      <span class="material-icons"> more_horiz </span>
    </button>

    <div class="menu-modal" :ref="job._id" @contextmenu.stop.prevent="" :style="modalStyle" :class="modalClass">
      <template v-if="!job.archivedAt">
        <div @click="onCopyUrl">{{ getTrans("copy-invitation-url") }}</div>
        <div @click="onGoToPage({ name: 'JobEdit', params: { jobId: job._id } })">
          {{ getTrans("edit-job") }}
        </div>
        <div @click="onOpenPreview">{{ getTrans("preview-job") }}</div>
        <div @click="onCloneJob">{{ getTrans("clone-job") }}</div>
        <div @click="onShare">{{ getTrans("share-job") }}</div>
      </template>
      <div @click="onToggleArchive">
        {{ job.archivedAt ? getTrans("restore") : getTrans("archive-job") }}
      </div>
      <div v-if="job.archivedAt" @click="onRemoveJob">
        {{ getTrans("delete-permanently") }}
      </div>
    </div>

    <mobile-modal v-if="isOpen && isMobile" cmpName="job-actions" @on-close="toggleModal" :job="job"
      @on-clone-job="onCloneJob" @on-open-preview="onOpenPreview" @on-share="onShare" @on-toggle-archive="onToggleArchive"
      @on-copy-url="onCopyUrl" @on-go-to-page="onGoToPage($event)" />
</section>
</template>

<script>
// core
import { computed } from 'vue'
// lib
import { useStore } from 'vuex'
import cloneDeep from "lodash.clonedeep"
// import { useStore } from 'vuex'
// services
import { msgService } from "@/services/msgService";
// custom composables
import { useModal } from "@/composables/useModal";
// cmps
import MobileModal from "@/cmps/common/modals/MobileModal.vue";
// misc
import config from "@/config";

export default {
  props: ["job", "mousePos"],

  setup(props) {
    const modalWidth = 200;

    const store = useStore();

    const modalHeight = computed(() => (props.job.archivedAt ? 100 : 300));
    const { isOpen, top, insetInlineStart, isBottom } = useModal({
      modalId: props.job._id,
      modalType: "job-menu",
      mousePos: props.mousePos,
      modalWidth,
      modalHeight,
    });

    const isMobile = computed(() => store.getters["app/isMobile"]);

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
      isMobile,
      isOpen,
      modalStyle,
      modalClass,
    };
  },

  computed: {
    invitationUrl() {
      return `${config.baseUrl}interview/${this.job._id}`;
    },

    companyName() {
      const name = this.job.company?.name;
      return name?.charAt(0).toUpperCase() + name?.slice(1);
    },

    jobTitle() {
      return this.job.info.title;
    },
  },

  methods: {
    toggleModal() {
      if (this.mousePos) this.$emit("modal-closed");
      // WTF is this??
      const modalId = this.isJobMenuOpen ? null : this.job._id;
      this.$store.dispatch("app/toggleModal", {
        type: "job-menu",
        data: { modalId },
      });
    },

    async onCloneJob() {
      this.toggleModal();
      const jobToSave = cloneDeep(this.job);
      delete jobToSave._id;
      delete jobToSave.createdAt;
      jobToSave.applicants = [];
      jobToSave.archivedAt = null;
      jobToSave.info.title = `copy of ${this.job.info.title}`;

      await this.$store.dispatch("job/addJob", { job: jobToSave });
      this.$emit("load-jobs");
    },

    onOpenPreview() {
      this.toggleModal();
      window.open(`${this.invitationUrl}?demo=1`, "_blank");
    },

    async onCopyUrl() {
      this.toggleModal();
      await navigator.clipboard.writeText(this.invitationUrl);
      const msg = msgService.copy("link");
      this.$store.commit("app/setAlertData", { alertData: msg });
    },

    onGoToPage({ name, params }) {
      this.toggleModal();
      this.$router.push({ name, params });
    },

    onToggleArchive() {
      this.toggleModal();
      this.$emit("archive", this.job);
    },
    onRemoveJob() {
      this.toggleModal();
      this.$emit("remove", this.job);
    },

    onShare() {
      this.toggleModal();
      if (this.isMobile && navigator.share) {
        navigator.share({
          title: "Interview invitation via Intervid",
          text: `${this.companyName} is seeking for ${this.jobTitle}. Click the link to start your interview`,
          url: this.invitationUrl,
        });
      } else {
        this.$store.dispatch("app/toggleModal", {
          type: "ShareBtns",
          data: { job: this.job, isCloseable: false },
        });
      }
    },
  },

  watch: {
    mousePos() {
      if (this.mousePos) {
        this.toggleModal();
      }
    },
  },
  components: {
    MobileModal,
  },
};
</script>
