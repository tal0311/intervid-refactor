import {useEventListener} from './useEventListener'

export function useScroll({scrollContainerSelector = 'window', scrollCB}) {
  const {remove: manuallyRemoveScroll} = useEventListener(scrollContainerSelector, 'scroll', scrollCB)

  return {
    manuallyRemoveScroll,
  }
}
