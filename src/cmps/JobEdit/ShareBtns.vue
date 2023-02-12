<template>
  <div class="share-btns-container">
    <p>{{getTrans('invitation-msg')}}</p>
    <div class="invitation-url-container">
      <span>{{invitationUrl}}</span>
      <button class="copy" @click="copyLink">
        {{getTrans('copy-link')}}
      </button>
    </div>
    <div class="media-btns-container">
      <div class="media-wrapper embed">
        <button @click="onCopyEmbed">
          <i class="material-icons">code</i>
        </button>
        <span>{{getTrans('embed')}}</span>
      </div>

      <div class="media-wrapper">
        <share-network
          @open="closeModal"
          tag="button"
          network="whatsapp"
          title="We're seeking for you!"
          :url="invitationUrl"
          :description="`${companyName} is seeking for ${jobTitle}. Click the link to start the interview via Intervid.`"
        >
          <i
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-whatsapp"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
              /></svg
          ></i>
        </share-network>
        <span>{{getTrans('whatsapp')}}</span>
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
        >
          <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26px" height="26px">
            <path
              d="M16.403,9H14V7c0-1.032,0.084-1.682,1.563-1.682h0.868c0.552,0,1-0.448,1-1V3.064c0-0.523-0.401-0.97-0.923-1.005 C15.904,2.018,15.299,1.999,14.693,2C11.98,2,10,3.657,10,6.699V9H8c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1l2-0.001V21 c0,0.552,0.448,1,1,1h2c0.552,0,1-0.448,1-1v-8.003l2.174-0.001c0.508,0,0.935-0.381,0.993-0.886l0.229-1.996 C17.465,9.521,17.001,9,16.403,9z"
            />
          </svg>
        </share-network>
        <span>{{getTrans('facebook')}}</span>
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
        <span>{{getTrans('email')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { msgService } from '@/services/msgService'

import { ShareNetwork } from 'vue-social-sharing'
import config from '@/config'

export default {
  props: ['job', 'data'],

  computed: {
    jobToshow() {
      return this.job || this.data.job
    },

    invitationUrl() {
      return `${config.baseUrl}interview/${this.jobToshow._id}`
    },

    companyName() {
      const name = this.jobToshow.company.name
      return name.charAt(0).toUpperCase() + name.slice(1)
    },

    jobTitle() {
      return this.jobToshow.info.title
    },

    lang() {
      return this.$store.getters['app/lang']
    },
  },

  methods: {
    closeModal() {
      this.$store.dispatch('app/toggleModal', { type: 'share', isDarkScreen: false })
    },

    async copyLink() {
      await navigator.clipboard.writeText(this.invitationUrl)
      const msg = msgService.copy('link')
      this.$store.commit('app/setAlertData', { alertData: msg })
      this.closeModal()
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
        `<iframe src="${config.baseUrl}embed/${this.jobToshow._id}?lng=${this.lang}" frameborder="0"></iframe>`,
      )
      const msg = msgService.copy('link')
      this.$store.commit('app/setAlertData', { alertData: msg })
      this.closeModal()
    },
  },

  components: { ShareNetwork },
}
</script>
