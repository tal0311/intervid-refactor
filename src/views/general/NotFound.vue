<template>
  <section class="not-found">
    <div class="info-container">
      <i class="material-icons">warning_amber</i>
      <h2>{{ msg || $getTrans('page-not-found') }}</h2>
    </div>

    <img
      loading="lazy"
      src="https://res.cloudinary.com/intervid/image/upload/v1662977086/Frontend/not-found_xutq1d.svg"
      alt="not-found"
    />
  </section>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
}
</script>
