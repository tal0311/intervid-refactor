<template>
  <section class="interview-end">
    <template v-if="!isUploadDone">
      <div class="upload">
        <uploading-animation />
        <div class="content">
          <div class="progress-bar">
            <span>{{ donePercent + "%" }}</span>
            <div :style="{ width: donePercent + '%' }" class="inner"></div>
          </div>
          <div class="uploading-msg">
            <p>{{ getTrans("do-not-close-this-window") }}</p>
            <p>{{ getTrans("your-inteview-recordings-uploaded") }}</p>
          </div>
        </div>

        <div class="modal-wrapper" v-if="waitForNetwork">
          <div class="no-network-modal">
            <div class="head-container">
              <i class="material-icons"> wifi_off </i>
              <p>{{ getTrans("no-internet-connection") }}</p>
            </div>
            <p>{{ getTrans("make-sure-wifi-connected") }}</p>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="goodbye">
        <div class="content">
          <h1>{{ getTrans("thanks") }}</h1>
          <p>{{ getTrans("your-application-has-been-successfully-sent") }}</p>
          <p>{{ getTrans("well-be-in-touch-with-you-as-soon-as-possible") }}</p>
        </div>
        <img
          loading="lazy"
          src="https://res.cloudinary.com/intervid/image/upload/v1661183431/Frontend/interview-end_b82dmk.png"
          alt="interview-end"
        />
      </div>

      <application />

      <confetti-animation />
    </template>
  </section>
</template>

<script>
import { uploaderService } from "@/services/uploaderService";
import { verifyBeforeExit } from "@/services/utilService";
import { loggerService } from "@/services/loggerService";
import VideoMixin from "@/mixins/VideoMixin";
import UploadingAnimation from "@/cmps/common/UploadingAnimation.vue";
import Application from "../onboarding/Application.vue";
import ConfettiAnimation from "@/cmps/common/ConfettiAnimation.vue";

export default {
  mixins: [VideoMixin],

  data() {
    return {
      donePercent: 0,
    };
  },

  mounted() {
    window.onbeforeunload = (ev) => {
      loggerService.info(
        "[InterviewEnd] [onBeforeUnload] Applicant try to leave the interview - open confirmation modal"
      );
      verifyBeforeExit(ev);
    }; // Open confirmation modal
    document.body.onunload = () => {
      if (!this.isUploadDone) {
        loggerService.info(
          "[InterviewEnd] [onunload] Applicant try to leave the interview - send quit timeEvent"
        );
        this.$emit("handle-quit");
      }
    }; // Send quit timeEvent when navigated out (all case exept interview inner routes navigation)

    uploaderService.addEventListener("progress", (progress) => {
      this.donePercent = progress;
      if (progress === 100) {
        loggerService.info(`[InterviewEnd] [progress] - upload progress = 100`);
        this.$store.commit({
          type: "applicant/setIsUploadDone",
          isUploadDone: true,
        });
      }
    });

    this.addNetworkListener();
  },

  beforeUnmount() {
    if (!this.isUploadDone) {
      this.$emit("handle-quit");
    } // Send quit timeEvent when navigated out (only interview inner routes navigation)
    window.onbeforeunload = null;
    document.body.onunload = null;
    this.removeNetworkListener();
  },

  computed: {
    job() {
      return this.$store.getters["applicant/job"];
    },

    waitForNetwork() {
      return this.$store.getters["applicant/waitForNetwork"];
    },

    isUploadDone() {
      return this.$store.getters["applicant/isUploadDone"];
    },
  },

  methods: {},

  components: { UploadingAnimation, Application, ConfettiAnimation },
};
</script>