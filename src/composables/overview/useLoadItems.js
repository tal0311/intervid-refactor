import {useStore} from 'vuex'

export function useLoadItems({dispatchName, filterBy, sort, shouldGather, setShouldGather}) {
  const store = useStore()

  async function loadItems() {
    await store.dispatch(dispatchName, {
      filterBy: filterBy.value,
      sort: sort.value,
      shouldGather: shouldGather.value,
    })
    if (shouldGather.value) setShouldGather(false)
  }

  return {loadItems}
}
