import {ref, onMounted, onUnmounted} from 'vue'
import {useEventListener} from './useEventListener'
import {useIntersectionObserver} from './useIntersectionObserver'

/**
 * @description A composable to get the bounding rect of an element, and update it in reaction to different events
 * @param {object} options - The options to pass to the composable
 * @param {Ref<HTMLElement>} options.elementRef - The ref to the element to get the bounding rect of
 * @param {string[]} options.listeners - The events to listen for to update the bounding rect. Defaults to ['resize']
 * @param {string} options.scrollContainerSelector - The selector to find the scroll container to listen for scroll events on. Only required if the listeners array includes 'scroll'
 * @returns {Ref<{x:number,y:number,bottom:number,height:number,left:number,right:number,top:number,width:number}>} The bounding rect of the element
 */
export function useElementBounding({elementRef, listeners, scrollContainerSelector}) {
  const bounding = ref({})

  // TODO: Find better const names
  const _defaultListeners = ['resize']
  const _listeners = [..._defaultListeners, ...listeners]
  if (_listeners.includes('scroll') && !scrollContainerSelector) {
    throw new Error(
      `Scroll listener requested, but no scrollContainerSelector provided, with data: 
      elementRef - ${elementRef}, 
      listeners - ${listeners}, 
      scrollContainerSelector - ${scrollContainerSelector}`,
    )
  }
  const _listenerTargetMap = {
    resize: window,
    scroll: scrollContainerSelector,
  }
  const _intersectionOptions = {
    root: document.body,
    rootMargin: '0px',
    threshold: 0.01,
  }
  let _unobserveElement = null
  let _listenersToRemove = []

  function _updateBounding(bundingClientRect) {
    // console.log('updating bounding')
    if (!elementRef?.value) return
    bounding.value = bundingClientRect
  }

  // We need to add several listeners to diffrent elements (by default we only add the resize listener to the whole window), but only want it to be active when the element is in view
  // so we use an intersection observer to determine when the element is in view, and then add the listener, or remove it when it's not in view
  // there are two options here -
  // option 1:, add the listeners to the elements for each element, and remove it when it's not in view, con is a massive amount of listeners for list elements

  // option 2: add a single listener (per listener) to their respective parent element for all elementRefs, if there is a way to store this data in a global way it can be done
  // but I don't know how to do it best for now, and it's not worth the time, it's worth revisting in the future
  // option 2 is not implemented yet, but it's probably the way to go

  // option 1:
  function _addListeners() {
    _listeners.forEach((listenerName) => {
      const target = _listenerTargetMap[listenerName]
      const {remove} = useEventListener(
        target,
        listenerName,
        () => _updateBounding(elementRef.value?.getBoundingClientRect()),
        false,
      )
      _listenersToRemove.push(remove)
    })
  }

  const _removeListeners = () => {
    _listenersToRemove.forEach((remove) => remove())
    _listenersToRemove = []
  }

  function _setBoundingListener({target, isIntersecting}) {
    // This  short circuit is to prevent the listener from being added when the element is not in view & remove existing listeners if there are any
    if (!isIntersecting) return _listenersToRemove.length && _removeListeners()
    _updateBounding(target.getBoundingClientRect())
    _addListeners()
    return
  }

  onMounted(() => {
    if (!elementRef?.value) return
    const {observe, unobserve} = useIntersectionObserver((entries) => {
      entries.forEach(_setBoundingListener)
    }, _intersectionOptions)

    observe(elementRef.value)
    _unobserveElement = unobserve
  })

  onUnmounted(() => {
    if (!elementRef?.value) return
    _unobserveElement?.(elementRef.value)
    _removeListeners()
  })

  return bounding
}
