export default {
  data() {
    return {
      isBottom: false,
      modalWidth: 0,
      modalTop: 0,
      modalInlineStart: 0,
      modalPos: null,
    }
  },

  computed: {
    isEnglish() {
      return this.$store.getters['app/lang'] === 'en'
    },
  },

  methods: {
    setModalPosition() {
      // implemented context menu like behaviour - on component that uses modalmixin have a mousePos state - starts at null and on activation receieves {x: pageX, y: pageY} - thus the if else statement below.
      if (this.isOpen) return
      const bodyBounding = document.body.getBoundingClientRect()
      this.modalPos = this.mousePos ? this.mousePos : this.$refs['modal-wrapper'].getBoundingClientRect()

      if (this.mousePos) {
        this.isBottom = this.mousePos.y + this.modalHeight > bodyBounding.height
        this.modalTop = this.isBottom ? this.modalPos.y - this.modalHeight + 'px' : this.modalPos.y + 'px'
        this.modalInlineStart = this.isEnglish
          ? this.mousePos.x - this.modalWidth < 0
            ? '10px'
            : this.mousePos.x - this.modalWidth + 'px'
          : bodyBounding.width - this.mousePos.x - this.modalWidth < 0
          ? '10px'
          : bodyBounding.width - this.mousePos.x - this.modalWidth + 'px'
      } else {
        this.isBottom = this.modalPos.bottom + this.modalHeight > bodyBounding.height
        this.modalTop = this.isBottom
          ? this.modalPos.y - this.modalHeight + 'px'
          : this.modalPos.y + this.modalPos.height + 'px'
        this.modalWidth = this.modalWidth ? this.modalWidth : this.modalPos.width + 'px'
        this.modalInlineStart = this.isEnglish
          ? this.modalPos.right - this.modalWidth < 0
            ? '10px'
            : this.modalPos.right - this.modalWidth + 'px'
          : bodyBounding.width - this.modalPos.left - this.modalWidth + 'px'
      }
    },
  },
}
