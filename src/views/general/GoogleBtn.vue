<template>
  <div class="google-btn">
    <google-login :callback="onSuccess" :error="onFailure" />
    <!-- {{ getTrans("continue-with-google") }} -->
    <img
      loading="lazy"
      src="https://res.cloudinary.com/intervid/image/upload/v1661182402/Frontend/google-logo_wqcarj.png"
      alt="google-logo"
    />
  </div>
</template>

<script>
import { decodeCredential, googleTokenLogin } from "vue3-google-login";
export default {
  methods: {
    onSuccess(googleRes) {
      const userData = decodeCredential(googleRes.credential);
      console.log("Handle the userData", userData);

      // googleTokenLogin().then((googleTokenLoginRes) => {
      //   console.log("Handle the response", googleTokenLoginRes)
      // })

      // this.$emit("google-success", googleUser.getAuthResponse().id_token)
    },

    onFailure(err) {
      if (err) console.log("error from google login", err);
    },
  },
};
</script>
