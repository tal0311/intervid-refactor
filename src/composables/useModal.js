import { ref, computed, onMounted } from 'vue'

export default function UseModal() {
 const isBottom = ref(false)
 const modalWidth = ref(0)
 const modalTop = ref(0)
 const modalInlineStart = ref(0)
 const modalPos = ref(null)

 const isEnglish = computed(() => {
  return this.$store.getters['app/lang'] === 'en'
 })

 onMounted(() => {
  if (this.isOpen) return
  const bodyBounding = document.body.getBoundingClientRect()
  modalPos.value = this.mousePos ? this.mousePos : this.$refs['modal-wrapper'].getBoundingClientRect()

  if (this.mousePos) {
   isBottom.value = this.mousePos.y + this.modalHeight > bodyBounding.height
   modalTop.value = isBottom.value ? modalPos.value.y - this.modalHeight + 'px' : modalPos.value.y + 'px'
   modalInlineStart.value = isEnglish.value ?
    this.mousePos.x - modalWidth.value < 0 ? '10px' : this.mousePos.x - modalWidth.value + 'px' :
    bodyBounding.width - this.mousePos.x - modalWidth.value < 0 ? '10px' : bodyBounding.width - this.mousePos.x - modalWidth.value + 'px'
  } else {
   isBottom.value = modalPos.value.bottom + this.modalHeight > bodyBounding.height
   modalTop.value = isBottom.value
    ? modalPos.value.y - this.modalHeight + 'px'
    : modalPos.value.y + modalPos.value.height + 'px'
   modalWidth.value = modalWidth.value ? modalWidth.value : modalPos.value.width + 'px'
   modalInlineStart.value = isEnglish.value ?
    modalPos.value.right - modalWidth.value < 0 ? '10px' : modalPos.value.right - modalWidth.value + 'px' :
    bodyBounding.width - modalPos.value.left - modalWidth.value + 'px'
  }
 })

 return {
  isBottom,
  modalWidth,
  modalTop,
  modalInlineStart,
  modalPos,
  isEnglish
 }
}
