import {onMounted, onUnmounted, shallowRef} from 'vue'

export function useEventListener(target, event, callback, isUseLifecycles = true) {
  const elTarget = shallowRef(typeof target !== 'string' ? target : null)

  const _setElement = () => {
    if (!elTarget.value) elTarget.value = document.querySelector(target)
  }
  const _addListener = () => elTarget.value?.addEventListener(event, callback)
  const remove = () => elTarget.value?.removeEventListener(event, callback)

  if (isUseLifecycles) {
    // target = typeof target === 'string' ? document.querySelector(target) : target
    onMounted(() => {
      _setElement()
      _addListener()
    })
    onUnmounted(() => elTarget.value?.removeEventListener(event, callback))
  } else {
    _setElement()
    _addListener()
  }
  return {
    remove,
  }
}
