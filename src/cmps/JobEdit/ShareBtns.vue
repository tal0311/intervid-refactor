<template>
  <div class="share-btns-container">
    <p>{{ getTrans("invitation-msg") }}</p>
    <div class="invitation-url-container">
      <span>{{ invitationUrl }}</span>
      <button class="copy" @click="copyLink">
        {{ getTrans("copy-link") }}
      </button>
    </div>
    <div class="media-btns-container">
      <div class="media-wrapper embed">
        <button @click="onCopyEmbed">
          <i class="material-icons">code</i>
        </button>
        <span>{{ getTrans("embed") }}</span>
      </div>

      <div class="media-wrapper">
        <share-network
          @open="closeModal"
          tag="button"
          network="whatsapp"
          title="We're seeking for you!"
          :url="invitationUrl"
          :description="`${companyName} is seeking for ${jobTitle}. Click the link to start the interview via Intervid.`"
          v-html="svgs.whatsapp"
        ></share-network>
        <span>{{ getTrans("whatsapp") }}</span>
      </div>

      <div class="media-wrapper">
        <share-network
          @open="closeModal"
          tag="button"
          network="facebook"
          :url="invitationUrl"
          title="We're seeking for you!"
          quote="We're seeking for you! Click to start the interview."
          hashtags="hiring"
          v-html="svgs.facebook"
        ></share-network>
        <span>{{ getTrans("facebook") }}</span>
      </div>

      <div class="media-wrapper">
        <share-network
          @open="closeModal"
          tag="button"
          network="email"
          :title="`Intervid invition- ${jobTitle} at ${companyName} `"
          :url="invitationUrl"
          :description="`${companyName} is seeking for ${jobTitle}. Click the link to start the interview via Intervid.`"
        >
          <i class="material-icons">mail_outline</i>
        </share-network>
        <span>{{ getTrans("email") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { msgService } from "@/services/msgService";

import { ShareNetwork } from "vue-social-sharing";
import config from "@/config";

export default {
  props: ["job", "data"],

  data() {
    return {
      svgs: {
        whatsapp: "",
        facebook: "",
      },
    };
  },

  created() {
    this.svgs.whatsapp = this.getSvg("whatsappIcon");
    this.svgs.facebook = this.getSvg("facebookIcon");
  },

  computed: {
    jobToshow() {
      return this.job || this.data.job;
    },

    invitationUrl() {
      return `${config.baseUrl}interview/${this.jobToshow._id}`;
    },

    companyName() {
      const name = this.jobToshow.company.name;
      return name.charAt(0).toUpperCase() + name.slice(1);
    },

    jobTitle() {
      return this.jobToshow.info.title;
    },

    lang() {
      return this.$store.getters["app/lang"];
    },
  },

  methods: {
    closeModal() {
      this.$store.dispatch("app/toggleModal", {
        type: "share",
        isDarkScreen: false,
      });
    },

    async copyLink() {
      await navigator.clipboard.writeText(this.invitationUrl);
      const msg = msgService.copy("link");
      this.$store.commit("app/setAlertData", { alertData: msg });
      this.closeModal();
    },

    // Share URLs
    // onShareWhatsapp() {
    //   window.open(`https://api.whatsapp.com/send?phone=&text=Hello, Apply and video interview via this link: ${this.invitationUrl}`)
    // },
    // onShareFacebook() {
    //   window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.invitationUrl}`)
    // },

    async onCopyEmbed() {
      await navigator.clipboard.writeText(
        `<iframe src="${config.baseUrl}embed/${this.jobToshow._id}?lng=${this.lang}" frameborder="0"></iframe>`
      );
      const msg = msgService.copy("link");
      this.$store.commit("app/setAlertData", { alertData: msg });
      this.closeModal();
    },
  },

  components: { ShareNetwork },
};
</script>
