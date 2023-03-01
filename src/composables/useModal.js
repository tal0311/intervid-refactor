import {ref, computed, watch} from 'vue'
import {useStore} from 'vuex'
import {useElementBounding} from './util/useElementBounding'

// params : {
//  modalHeight.value: computed number,
//  modalWidth: number,
//  mousePos.value: ref ({
//    x:number,
//    y:number
//  } | null),
//  modalWrapper: template ref | null,
// }
export function useModal({
  emit,
  modalId,
  modalHeight,
  modalWidth,
  modalType,
  mousePos,
  modalWrapper,
  listContainerSelector,
}) {
  console.log('🚀 ~ file: useModal.js:15 ~ useModal ~ modalWrapper:', modalWrapper.value)

  const store = useStore()

  const modalPos = ref({
    modalWidth: 0,
    isBottom: false,
    top: 0,
  })

  const isEnglish = computed(() => {
    return store.getters['app/lang'] === 'en'
  })

  const modal = computed(() => {
    return store.getters['app/modal']
  })

  const isOpen = computed(() => {
    return modal.value.type === modalType && modal.value.data.modalId === modalId
  })

  const modalWrapperBounding = useElementBounding(modalWrapper, listContainerSelector)
  console.log('modalWrapperBounding', modalWrapperBounding.value)
  const isFromMousePos = computed(() => !!mousePos?.value)

  const startingPos = computed(() => {
    return isFromMousePos.value ? mousePos.value : modalWrapperBounding.value
  })

  watch([startingPos, isOpen], ([startingPos, isOpen], oldVal) => {
    if (!isOpen && oldVal[1]) return emit('modal-closed')
    if (!isOpen) return
    console.log('startingPos changed', startingPos)
    if (isFromMousePos.value) {
      modalPos.value = useModalPosFromClick({
        modalHeight,
        modalWidth,
        mousePos: startingPos,
        isEnglish,
      })
    } else {
      modalPos.value = useModalPosFromBounding({
        modalHeight,
        modalBounding: startingPos,
        modalWidth,
        isEnglish,
      })
    }
  })

  // watch(isOpen, (newVal, oldVal) => {
  //   if (!newVal && oldVal) {
  //     emit('modal-closed')
  //   }
  // })

  return {
    isEnglish,
    isOpen,
    modalPos,
  }
}

function useModalPosFromClick({modalHeight, modalWidth = 0, mousePos, isEnglish}) {
  const bodyBounding = document.body.getBoundingClientRect()
  const isBottom = mousePos.y + modalHeight.value > bodyBounding.height

  const top = isBottom ? mousePos.y - modalHeight.value : mousePos.y
  // TODO: This is a mess, and needs to be refactored
  const insetInlineStart = isEnglish.value
    ? mousePos.x - modalWidth < 0
      ? 10
      : mousePos.x - modalWidth
    : bodyBounding.width - mousePos.x - modalWidth < 0
    ? 10
    : bodyBounding.width - mousePos.x - modalWidth

  return {
    modalWidth,
    isBottom,
    top,
    insetInlineStart,
  }
}

function useModalPosFromBounding({modalHeight, modalBounding, isEnglish, modalWidth}) {
  const bodyBounding = document.body.getBoundingClientRect()
  if (!modalWidth) modalWidth = modalBounding.width

  const isBottom = modalBounding.bottom + modalHeight.value > bodyBounding.height

  const top = isBottom ? modalBounding.y - modalHeight.value : modalBounding.y + modalBounding.height
  // TODO: This is a mess, and needs to be refactored
  const insetInlineStart = isEnglish.value
    ? modalBounding.right - modalWidth < 0
      ? 10
      : modalBounding.right - modalWidth
    : bodyBounding.width - modalBounding.left - modalWidth

  return {
    modalWidth,
    isBottom,
    top,
    insetInlineStart,
  }
}

// params:{
//  modalHeight: computed number
//  modalWidth: Ref number
//  startingPos : computed object: {
//    x: number
//    y: number
//    right?: number
//    left?: number
//    height?: number
//  }
//   isEnglish: computed boolean
// }
// export function useModalPos({modalHeight, modalWidth = ref(0), startingPos, isEnglish}) {
//   // TODO: Check if a computed is needed here
//   const bodyBounding = computed(() => document.body.getBoundingClientRect())
//   // TODO: Find better name
//   const actualModalWidth = computed(() => {
//     if (modalWidth.value) return modalWidth.value
//     if (startingPos.value?.width) return startingPos.value.width
//     return 0
//   })

//   const isBottom = computed(() => {
//     if (!startingPos.value) return
//     if (startingPos.value?.bottom !== null && startingPos.value?.bottom !== undefined) {
//       return startingPos.value.bottom + modalHeight.value > bodyBounding.value.height
//     }
//     return startingPos.value.y + modalHeight.value > bodyBounding.value.height
//   })

//   const top = computed(() => {
//     if (!startingPos.value) return
//     // TODO: Find better name
//     // start with the value for the bottom, which is the same for both cases
//     let top = startingPos.value.y - modalHeight.value
//     if (!isBottom.value) {
//       // if the startingPos.value obj has a height, it means we got it from an element bounding calculation,
//       // and not a mousePos.value, so we need to calculate the top diffrently
//       top = startingPos.value.height ? startingPos.value.y + startingPos.value.height : startingPos.value.y
//     }
//     return top
//     // another option for the same logic:
//     // return isBottom.value
//     //   ? startingPos.value.y - modalHeight.value
//     //   : startingPos.value.height
//     //   ? startingPos.value.y + startingPos.value.height
//     //   : startingPos.value.y
//   })

//   const insetInlineStart = computed(() => {
//     // TODO: This is a mess, we need to find a better way to do this when time permits
//     if (!startingPos.value) return
//     if (!startingPos.value.right) {
//       console.log(startingPos.value)
//       return isEnglish.value
//         ? startingPos.value.x - actualModalWidth.value < 0
//           ? 10
//           : startingPos.value.x - actualModalWidth.value
//         : bodyBounding.value.width - startingPos.value.x - actualModalWidth.value < 0
//         ? 10
//         : bodyBounding.value.width - startingPos.value.x - actualModalWidth.value
//     }
//     return isEnglish.value
//       ? startingPos.value.right - actualModalWidth.value < 0
//         ? 10
//         : startingPos.value.right - actualModalWidth.value
//       : bodyBounding.value.width - startingPos.value.left - actualModalWidth.value
//   })

//   return {
//     actualModalWidth,
//     isBottom,
//     top,
//     insetInlineStart,
//   }
// }
