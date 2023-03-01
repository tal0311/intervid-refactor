export function useEventListener(selector, type, listener, options = null) {
  const target = document.querySelector(selector)
  if (!target) return

  const eventListener = (event) => listener(event)

  target.addEventListener(type, eventListener, options)

  return {
    remove() {
      console.log('remove', type, listener)
      target.removeEventListener(type, eventListener, options)
    },
  }
}
