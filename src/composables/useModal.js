import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

// params : {
//  modalHeight.value: computed number,
//  modalWidth: number,
//  mousePos.value: ref ({
//    x:number,
//    y:number
//  } | null),
//  modalWrapper: template ref | null,
// }
export default function useModal({
  modalId,
  modalHeight,
  modalWidth = 0,
  modalType,
  mousePos = ref(null),
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
    return (
      modal.value.type === modalType && modal.value.data.modalId === modalId
    );
  });

  const modalWrapperBounding = computed(() => {
    return modalWrapper.value?.getBoundingClientRect();
  });
  // const parseStartingPosFromBounding = computed(() => {
  //   const bounding = modalWrapper.value?.getBoundingClientRect();
  //   if (!bounding) return null;
  //   return {
  //     x: bounding.x,
  //     // we map the y to the bounding bottom, because we want the modal to open from the bottom of the element,
  //     // and it is only used for the isBottom calculation
  //     y: bounding.y,
  //     bottom: bounding.bottom,
  //     right: bounding.right,
  //     left: bounding.left,
  //     height: bounding.height,
  //   };
  // });
  const startingPos = computed(() => {
    return mousePos.value || modalWrapperBounding.value;
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
//  modalHeight: computed number
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
  isEnglish,
}) {
  // TODO: Check if a computed is needed here
  const bodyBounding = computed(() => document.body.getBoundingClientRect());

  const isBottom = computed(() => {
    if (startingPos.bottom !== null && startingPos.bottom !== undefined) {
      return (
        startingPos?.bottom + modalHeight.value > bodyBounding.value.height
      );
    }
    return startingPos.y + modalHeight.value > bodyBounding.value.height;
  });

  const top = computed(() => {
    // TODO: Find better name
    // start with the value for the bottom, which is the same for both cases
    let top = startingPos.value.y - modalHeight.value;
    if (!isBottom.value) {
      // if the startingPos.value obj has a height, it means we got it from an element bounding calculation,
      // and not a mousePos.value, so we need to calculate the top diffrently
      top = startingPos.value.height
        ? startingPos.value.y + startingPos.value.height
        : startingPos.value.y;
    }
    return top;
    // another option for the same logic:
    // return isBottom.value
    //   ? startingPos.value.y - modalHeight.value
    //   : startingPos.value.height
    //   ? startingPos.value.y + startingPos.value.height
    //   : startingPos.value.y
  });

  const insetInlineStart = computed(() => {
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

  return {
    isBottom,
    top,
    insetInlineStart,
  };
}
