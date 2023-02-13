const clickOutside = {
  mounted(el) {
    el.clickOutside = (ev) => {
      if (!el.contains(ev.target)) {
        //change to close modal
        // itemService.setModalType('')
      }
    };
    setTimeout(() => {
      document.addEventListener("click", el.clickOutside);
    }, 0);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutside);
  },
};

export { clickOutside };
