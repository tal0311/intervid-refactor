import {ref, onMounted, onUnmounted} from 'vue'
import {useEventListener} from './useEventListener'
import {useIntersectionObserver} from './useIntersectionObserver'

// this composable receives a ref and returns the bounding rect of the element, which updates on scroll
export function useElementBounding(elementRef, scrollContainerSelector = 'body') {
  const bounding = ref({})

  const _intersectionOptions = {
    root: document.body,
    rootMargin: '0px',
    threshold: 0.01,
  }
  let _unobserveElement = null
  let _removeListener = null

  const _updateBounding = (bundingClientRect) => {
    if (!elementRef?.value) return
    bounding.value = bundingClientRect
  }

  // We need to add a listener to the scroll container, but only want it to be active when the element is in view
  // so we use an intersection observer to determine when the element is in view, and then add the listener, or remove it when it's not in view
  // add a listener to the scroll container for each element
  // there are two options here, option 1, add a listener to the scroll container for each element, and remove it when it's not in view
  const _setBoundingListener = ({target, isIntersecting}) => {
    if (!isIntersecting) return _removeListener?.()
    _updateBounding(target.getBoundingClientRect())
    const {remove} = useEventListener(scrollContainerSelector, 'scroll', () =>
      _updateBounding(target.getBoundingClientRect()),
    )
    _removeListener = remove
    return
  }

  // option 2: add a listener to the scroll container for all elements, if there is a way to store this data in a global way it can be done
  // but I don't know how to do it for now, and it's not worth the time, it's worth revisting in the future

  onMounted(() => {
    if (!elementRef?.value) return
    const {observe, unobserve} = useIntersectionObserver({
      options: _intersectionOptions,
      cb: (entries) => {
        entries.forEach(_setBoundingListener)
      },
    })

    observe(elementRef.value)
    _unobserveElement = unobserve
  })

  onUnmounted(() => {
    if (!elementRef?.value) return
    _unobserveElement?.(elementRef.value)
    _removeListener?.()
  })

  return bounding
}
