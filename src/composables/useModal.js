import { ref, computed, onMounted } from 'vue'
import {useStore } from 'vuex'

const props = {
  isOpen:
}

// data() {
//   return {
//     modalHeight: this.job.archivedAt ? 100 : 300,
//     modalWidth: 200,
//   }
// },

// computed: {
//   isMobile() {
//     return this.$store.getters['app/isMobile']
//   },

//   invitationUrl() {
//     return `${config.baseUrl}interview/${this.job._id}`
//   },

//   companyName() {
//     const name = this.job.company?.name
//     return name?.charAt(0).toUpperCase() + name?.slice(1)
//   },

//   jobTitle() {
//     return this.job.info.title
//   },

//   modal() {
//     return this.$store.getters['app/modal']
//   },

//   isOpen() {
//     return this.modal.type === 'job-menu' && this.modal.data.modalId === this.job._id
//   },
export default function useModal({isOpen,mousePos,}) { 
  const store = useStore()
 const isBottom = ref(false)
 const modalWidth = ref(0)
 const modalTop = ref(0)
 const modalInlineStart = ref(0)
 const modalPos = ref(null)

 const isEnglish = computed(() => {
  return store.getters['app/lang'] === 'en'
 })

 const setModalPosition=() => {
  if (this.isOpen) return
  const bodyBounding = document.body.getBoundingClientRect()
  modalPos.value = this.mousePos ? this.mousePos : this.$refs['modal-wrapper'].getBoundingClientRect() // not sure how to handle the $refs in the best way yetr

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
 }

 return {
  isBottom,
  modalWidth,
  modalTop,
  modalInlineStart,
  modalPos,
  isEnglish,
  setModalPosition
 }
}
