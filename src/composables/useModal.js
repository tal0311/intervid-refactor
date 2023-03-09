import {ref, computed, watch} from 'vue'
import {useStore} from 'vuex'

/**
 * @description A composable to get the position of a modal, and update it in reaction to different events. It can be positioned based on the mouse click, or the bounding rect of the modalWrapper
 * @param {Object} options - The options to pass to the composable
 * @param {Function} options.emit - The emit function from the component
 * @param {string} options.modalId - The id of the modal
 * @param {Ref<number>} options.modalHeight - A Ref containing the height of the modal
 * @param {Ref<number>} options.modalWidth - A Ref containing the width of the modal
 * @param {string} options.modalType - The type of modal to open
 * @param {Ref<{x:number,y:number} | null>} options.mousePos - The position of the mouse click. Optional, if not provided the modal will be positioned based on the bounding rect of the modalWrapper
 * @param {Ref<HTMLElement | null>} options.modalWrapper - The ref to the element to get the bounding rect of, if mousePos is not provided / closed
 */
export function useModal({emit, modalId, modalHeight, modalWidth, modalType, mousePos, modalWrapper}) {
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

  const isFromMousePos = computed(() => !!mousePos?.value)

  watch([isOpen, isFromMousePos], ([isOpen, isFromMousePos], [oldIsOpen]) => {
    if (!isOpen) {
      if (oldIsOpen) emit('modal-closed')
      return
    }
    if (isFromMousePos) {
      modalPos.value = useModalPosFromClick({
        modalHeight,
        modalWidth,
        mousePos: mousePos.value,
        isEnglish,
      })
    } else {
      modalPos.value = useModalPosFromBounding({
        modalHeight,
        modalWrapper,
        modalWidth,
        isEnglish,
      })
    }
  })

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

function useModalPosFromBounding({modalHeight, modalWrapper, isEnglish, modalWidth}) {
  const bodyBounding = document.body.getBoundingClientRect()
  const modalBounding = modalWrapper.value.getBoundingClientRect()
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

// Old overengineered version, kept for reference and future upgrades

// import {ref, computed, watch} from 'vue'
// import {useStore} from 'vuex'
// import {useElementBounding} from './util/useElementBounding'

// /**
//  *
//  * @param {Object} options - The options to pass to the composable
//  * @param {Function} options.emit - The emit function from the component
//  * @param {string} options.modalId - The id of the modal
//  * @param {Ref<number>} options.modalHeight - A Ref containing the height of the modal
//  * @param {Ref<number>} options.modalWidth - A Ref containing the width of the modal
//  * @param {string} options.modalType - The type of modal to open
//  * @param {Ref<{x:number,y:number} | null>} options.mousePos - The position of the mouse click. Optional, if not provided the modal will be positioned based on the bounding rect of the modalWrapper
//  * @param {Ref<HTMLElement | null>} options.modalWrapper - The ref to the element to get the bounding rect of, if mousePos is not provided / closed
//  * @param {string} options.listContainerSelector - The selector to find the scroll container to listen for scroll events on. Only required if the modalPos is detrmined from modalWrapper,
//  * and the scroll listener is requested for updating the pos.
//  * @returns
//  */
// export function useModal({
//   emit,
//   modalId,
//   modalHeight,
//   modalWidth,
//   modalType,
//   mousePos,
//   modalWrapper,
//   listContainerSelector,
// }) {
//   const store = useStore()

//   const modalPos = ref({
//     modalWidth: 0,
//     isBottom: false,
//     top: 0,
//   })

//   const isEnglish = computed(() => {
//     return store.getters['app/lang'] === 'en'
//   })

//   const modal = computed(() => {
//     return store.getters['app/modal']
//   })

//   const isOpen = computed(() => {
//     return modal.value.type === modalType && modal.value.data.modalId === modalId
//   })

//   const modalWrapperBounding = useElementBounding({
//     elementRef: modalWrapper,
//     listeners: ['scroll'],
//     scrollContainerSelector: listContainerSelector,
//   })
//   const isFromMousePos = computed(() => !!mousePos?.value)

//   const startingPos = computed(() => {
//     return isFromMousePos.value ? mousePos.value : modalWrapperBounding.value
//   })

//   watch([startingPos, isOpen], ([startingPos, isOpen], [, oldIsOpen]) => {
//     if (!isOpen) {
//       if (oldIsOpen) emit('modal-closed')
//       return
//     }
//     if (isFromMousePos.value) {
//       modalPos.value = useModalPosFromClick({
//         modalHeight,
//         modalWidth,
//         mousePos: startingPos,
//         isEnglish,
//       })
//     } else {
//       modalPos.value = useModalPosFromBounding({
//         modalHeight,
//         modalBounding: startingPos,
//         modalWidth,
//         isEnglish,
//       })
//     }
//   })

//   return {
//     isEnglish,
//     isOpen,
//     modalPos,
//   }
// }

// function useModalPosFromClick({modalHeight, modalWidth = 0, mousePos, isEnglish}) {
//   const bodyBounding = document.body.getBoundingClientRect()
//   const isBottom = mousePos.y + modalHeight.value > bodyBounding.height

//   const top = isBottom ? mousePos.y - modalHeight.value : mousePos.y
//   // TODO: This is a mess, and needs to be refactored
//   const insetInlineStart = isEnglish.value
//     ? mousePos.x - modalWidth < 0
//       ? 10
//       : mousePos.x - modalWidth
//     : bodyBounding.width - mousePos.x - modalWidth < 0
//     ? 10
//     : bodyBounding.width - mousePos.x - modalWidth

//   return {
//     modalWidth,
//     isBottom,
//     top,
//     insetInlineStart,
//   }
// }

// function useModalPosFromBounding({modalHeight, modalWrapper, isEnglish, modalWidth}) {
//   const bodyBounding = document.body.getBoundingClientRect()
//   const modalBounding = modalWrapper.value.getBoundingClientRect()
//   if (!modalWidth) modalWidth = modalBounding.width

//   const isBottom = modalBounding.bottom + modalHeight.value > bodyBounding.height

//   const top = isBottom ? modalBounding.y - modalHeight.value : modalBounding.y + modalBounding.height
//   // TODO: This is a mess, and needs to be refactored
//   const insetInlineStart = isEnglish.value
//     ? modalBounding.right - modalWidth < 0
//       ? 10
//       : modalBounding.right - modalWidth
//     : bodyBounding.width - modalBounding.left - modalWidth

//   return {
//     modalWidth,
//     isBottom,
//     top,
//     insetInlineStart,
//   }
// }
