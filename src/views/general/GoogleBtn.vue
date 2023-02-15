<template>
  <div class="google-btn">
    <google-login
      type="button"
      :params="params"
      :onSuccess="onSuccess"
      :onFailure="onFailure"
      >{{ getTrans("continue-with-google") }}</google-login
    >
    <img
      loading="lazy"
      src="https://res.cloudinary.com/intervid/image/upload/v1661182402/Frontend/google-logo_wqcarj.png"
      alt="google-logo"
    />
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";

export default {
  data() {
    return {
      params: {
        client_id:
          "762199449433-s2ulgt89bp0d66fm4ss5po65h2aqki2k.apps.googleusercontent.com",
      },
    };
  },

  methods: {
    onSuccess(googleUser) {
      this.$emit("google-success", googleUser.getAuthResponse().id_token);
    },

    onFailure(err) {
      if (err) console.log("error from google login", err);
    },
  },

  components: { GoogleLogin },
};
</script>
