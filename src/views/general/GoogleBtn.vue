<template>
  <div class="google-btn">
    <!-- <google-login :callback="onSuccess" :error="onFailure" /> -->

    <!-- <GoogleLogin > -->
    <button @click="login">{{ $getTrans('continue-with-google') }}</button>
    <!-- </GoogleLogin> -->

    <img
      loading="lazy"
      src="https://res.cloudinary.com/intervid/image/upload/v1661182402/Frontend/google-logo_wqcarj.png"
      alt="google-logo"
    />
  </div>
</template>

<script setup>
import {googleTokenLogin} from 'vue3-google-login'

const emit = defineEmits(['google-success'])
async function login() {
  const tokenLogin = await googleTokenLogin()
  emit('google-success', tokenLogin.access_token)
}
</script>
