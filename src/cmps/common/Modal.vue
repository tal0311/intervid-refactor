<template>
  <div>
    <regular-modal />
    <alert-bar />
  </div>
</template>

<script>
import AlertBar from "@/cmps/common/AlertBar";
import RegularModal from "@/cmps/common/RegularModal";

export default {
  components: {
    AlertBar,
    RegularModal,
  },
};
</script>
