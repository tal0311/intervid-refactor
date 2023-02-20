<template>
  <div class="google-btn">
    <google-login :callback="onSuccess" :error="onFailure" />

    <!-- <GoogleLogin popup-type="CODE">
      <button @click="onSuccess">{{ getTrans("continue-with-google") }}</button>
    </GoogleLogin> -->

    <img
      loading="lazy"
      src="https://res.cloudinary.com/intervid/image/upload/v1661182402/Frontend/google-logo_wqcarj.png"
      alt="google-logo"
    />
  </div>
</template>

<script>
import { decodeCredential } from "vue3-google-login";
// import { decodeCredential, googleTokenLogin } from "vue3-google-login";
export default {
  methods: {
    async onSuccess(googleRes) {
      const userData = decodeCredential(googleRes.credential);
      console.log("Handle the userData", userData);

      // const tokenLoginRes = await googleTokenLogin();
      // console.log("Handle the response - tokenLoginRes", tokenLoginRes);

      // this.$emit("google-success", googleUser.getAuthResponse().id_token)
    },

    onFailure(err) {
      if (err) console.log("error from google login", err);
    },
  },
};
</script>
