import {ref, onMounted, onUnmounted} from 'vue'
// this composable receives a ref and returns the bounding rect of the element, which updates on scroll
export function useElementBounding(scrollContainerSelector, elementRef) {
  const bounding = ref({})

  const updateBounding = () => {
    console.log('updateBounding')
    if (elementRef.value) {
      bounding.value = elementRef.value.getBoundingClientRect()
    }
    console.log(bounding.value)
  }

  onMounted(() => {
    updateBounding()
    // TODO: This is a hack, we need to find a better way to do this
    document.querySelector(scrollContainerSelector).addEventListener('scroll', updateBounding)
  })

  onUnmounted(() => {
    document.querySelector(scrollContainerSelector).removeEventListener('scroll', updateBounding)
  })

  return bounding
}
