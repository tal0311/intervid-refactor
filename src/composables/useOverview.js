// core
import {ref} from 'vue'
// lib
import {useStore} from 'vuex'

export function useOverview() {
  const store = useStore()
  const shouldGather = ref(false)

  // Methods
  const setShouldGather = (val) => {
    shouldGather.value = val
  }

  const sendAlert = (alertData) => {
    store.commit({
      type: 'app/setAlertData',
      alertData,
    })
  }

  return {
    // for everything
    // filterBy,
    // sort,
    // onSort,
    // onChangePage,
    // isSelected,
    // not for everything
    shouldGather,
    // selectedItems,
    setShouldGather,
    // setSelectedItems,
    // setFilterFromRoute,
    // onSetFilterByKey,
    // resetFilters,
    // onSetFilter,
    // onSelectAll,
    // onSelectItem,
    // clearSelectedItems,
    // onRemoveTag,
    sendAlert,
    // tagList,
    // not needed outside
    // onSetQuery,
    // query,
    // archiveBy,
    // cmpName,
    // shouldParseFilter,
  }
}
