<template>
  <div class="no-mobile-screen-share">
    <div class="material-icons">warning_amber</div>
    <h1>{{ getTrans("interview-includes-screen-answer") }}</h1>
    <h3>{{ getTrans("device-not-suppport-screen-capture") }}</h3>
    <h3>{{ getTrans("open-in-desktop-browser") }}</h3>
    <img
      loading="lazy"
      src="https://res.cloudinary.com/intervid/image/upload/v1661182433/Frontend/desktop-interview_rsxths.svg"
      alt="desktop-interview"
    />
  </div>
</template>
