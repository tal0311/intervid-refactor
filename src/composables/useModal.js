import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

// params : {
//  modalHeight: number,
//  modalWidth: number,
//  mousePos: {
//    x:number,
//    y:number
//  } | null,
//  modalWrapper: template ref | null,
// }
export default function useModal({
  modalHeight,
  modalWidth = 0,
  mousePos = null,
  modalWrapper = null,
}) {
  const store = useStore();

  const isEnglish = computed(() => {
    return store.getters["app/lang"] === "en";
  });
  const modal = computed(() => {
    // console.log(store.getters["app/modal"])
    return store.getters["app/modal"];
  });
  const isOpen = computed(() => {
    return modal.type === modalType && modal.data.modalId === jobId;
  });
  const parseStartingPosFromBounding = computed(() => {
    const bounding = modalWrapper.value?.getBoundingClientRect();
    if (!bounding) return null;
    return {
      x: bounding.x,
      // we map the y to the bounding bottom, because we want the modal to open from the bottom of the element,
      // and it is only used for the isBottom calculation
      y: bounding.bottom,
      right: bounding.right,
      left: bounding.left,
      height: bounding.height,
    };
  });
  const startingPos = computed(() => {
    return mousePos || parseStartingPosFromBounding.value;
  });

  const { top, insetInlineStart, isBottom } = useModalPos({
    modalHeight,
    modalWidth,
    startingPos,
    isEnglish,
    // modalWrapper,
  });

  return {
    isEnglish,
    isOpen,
    top,
    insetInlineStart,
    isBottom,
  };

  // const modalWrapperBounding = computed(() => {
  //   return modalWrapper.value?.getBoundingClientRect();
  // })
}

// params:{
//  modalHeight: number
//  modalWidth: number
//  startingPos : computed object: {
//    x: number
//    y: number
//    right?: number
//    left?: number
//    height?: number
//  }
//   isEnglish: computed boolean
// }
export function useModalPos({
  modalHeight,
  modalWidth = 0,
  startingPos,
  // modalWrapper = ref(null)
}) {
  // const modalWrapperBounding = computed(() => {
  //   return modalWrapper.value?.getBoundingClientRect();
  // })

  // TODO: Check if a computed is needed here
  const bodyBounding = computed(() => document.body.getBoundingClientRect());

  const isBottom = computed(() => {
    return startingPos.value.y + modalHeight > bodyBounding.value.height;

    // console.log(mousePos);
    // if (mousePos) return mousePos.y + modalHeight > bodyBounding.value.height;
    // return modalWrapper?.bottom + modalHeight > bodyBounding.value.height;
  });

  const top = computed(() => {
    // TODO: Find better name
    // start with the value for the bottom, which is the same for both cases
    let top = startingPos.value.y - modalHeight;
    if (!isBottom.value) {
      // if the startingPos.value obj has a height, it means we got it from an element bounding calculation,
      // and not a mousePos, so we need to calculate the top diffrently
      top = startingPos.value.height
        ? startingPos.value.y + startingPos.value.height
        : startingPos.value.y;
    }
    return top;
    // another option for the same logic:
    // return isBottom.value
    //   ? startingPos.value.y - modalHeight
    //   : startingPos.value.height
    //   ? startingPos.value.y + startingPos.value.height
    //   : startingPos.value.y
  });

  const insetInlineStart = computed(() => {
    // if(isEnglish && mousePos.x - modalWidth > 0){
    //     return mousePos.x - modalWidth
    //   }
    // if(!isEnglish && bodyBounding.value.width - mousePos.x - modalWidth > 0){
    //   return bodyBounding.value.width - mousePos.x - modalWidth
    // }
    // if(!isEnglish){
    //   return bodyBounding.value.width - startingPos.value.left - modalWidth
    // }
    // if(startingPos.right - modalWidth > 0){
    //     return startingPos.right - modalWidth
    //   }
    if (!isEnglish.value) {
      if (
        startingPos.value.left !== undefined &&
        startingPos.value.left !== null
      ) {
        return bodyBounding.value.width - startingPos.value.left - modalWidth;
      }
      if (bodyBounding.value.width - startingPos.value.x - modalWidth > 0) {
        return bodyBounding.value.width - startingPos.value.x - modalWidth;
      }
    } else {
      if (
        startingPos.value.right !== undefined &&
        startingPos.value.right !== null
      ) {
        return startingPos.value.right - modalWidth;
      }
      if (startingPos.value.x - modalWidth > 0) {
        return startingPos.value.x - modalWidth;
      }
    }
    return 10;
  });

  // const compModalWidth = computed(() => {
  //   console.log("width2:", modalWrapperBounding?.value?.width);
  //   return `${modalWidth || modalWrapperBounding?.value?.width}px`;
  // });

  return {
    isBottom,
    top,
    insetInlineStart,
    // modalHeight,
    // compModalWidth,
  };
}

// function _parseStartingPosFromBounding(bounding) {
//   return {
//     x: bounding.x,
//     // we map the y to the bounding bottom, because we want the modal to open from the bottom of the element,
//     // and it is only used for the isBottom calculation
//     y: bounding.bottom,
//     right: bounding.right,
//     left: bounding.left,
//     height: bounding.height,
//   };
// }
