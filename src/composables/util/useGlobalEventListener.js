// TODO: Finished this, and find a better name, global is not representative of what this does

// Not sure if this is the best way to do this, but fuck it
const globalEventListeners = new Map()

export function useGlobalEventListener({target, type, listener, options = null}) {
  // TODO: Add comments
  if (typeof target === 'string') target = document.querySelector(target)
  // console.log('target', target)
  if (!target)
    return {
      remove() {},
    }

  const targetListeners = globalEventListeners.get(target)
  if (!targetListeners) {
    globalEventListeners.set(target, new Map())
  }
  const targetTypeListeners = globalEventListeners.get(target).get(type)
  if (!targetTypeListeners) {
    // console.log('adding listener', type)
    globalEventListeners.get(target).set(type, [listener])
    target.addEventListener(
      type,
      (ev) => {
        globalEventListeners
          .get(target)
          .get(type)
          .forEach((listener) => {
            listener(ev)
          })
      },
      options,
    )
  }
  const idx = globalEventListeners.get(target).get(type).push(listener) - 1
  return {
    remove() {
      globalEventListeners.get(target).get(type).splice(idx, 1)
    },
  }
}
