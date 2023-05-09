import {onMounted, onUnmounted, shallowRef} from 'vue'
/**
 * @description A composable that adds an event listener to an element, and returns a remove function to remove the event listener, or add and remove the event listener on the onMounted and onUnmounted lifecycles
 * @param {HTMLElement | string} targetSelector - The element to add the event listener to, or a selector to find the element
 * @param {string} evName - The name of the event to listen for
 * @param {Function} callback - The callback function to call when the event is triggered
 * @param {boolean} isUseLifecycles - Whether to use the onMounted and onUnmounted lifecycles to add and remove the event listener
 * @returns {object} An object with a remove function to remove the event listener
 */
export function useEventListener(targetSelector, evName, callback, isUseLifecycles = true) {
  const elTarget = shallowRef(typeof targetSelector !== 'string' ? targetSelector : null)

  const remove = () => elTarget.value?.removeEventListener(evName, callback)

  function _setElement() {
    if (!elTarget.value) elTarget.value = document.querySelector(targetSelector)
  }
  const _addListener = () => elTarget.value?.addEventListener(evName, callback)

  if (isUseLifecycles) {
    onMounted(() => {
      _setElement()
      _addListener()
    })
    onUnmounted(remove)
  } else {
    _setElement()
    _addListener()
  }

  return {
    remove,
  }
}
