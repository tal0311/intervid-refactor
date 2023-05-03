import {ref} from 'vue'
import {loggerService} from '@/services/loggerService'

export function useSelection() {
  const selectedItems = ref([])

  const setSelectedItems = (val) => {
    _logger('info', 'setSelectedItems')
    selectedItems.value = val
  }
  const onSelectAll = (items) => {
    _logger('info', 'onSelectAll')
    // TODO: figure out what is supposed to happen in the splice
    if (selectedItems.value.length) return selectedItems.value.splice(0)
    setSelectedItems(items.slice())
  }
  const isSelected = (item) => {
    const idKey = item.id ? 'id' : '_id'
    return selectedItems.value.some((selectedItem) => selectedItem[idKey] === item[idKey])
  }

  const onSelectItem = (item) => {
    console.log('selectedItems',selectedItems)
    _logger('info', 'onSelectItem')
    const idKey = item.id ? 'id' : '_id'
    const itemIdx = selectedItems.value.findIndex((i) => i[idKey] === item[idKey])
    if (itemIdx !== -1) selectedItems.value.splice(itemIdx, 1)
    else selectedItems.value.push(item)
  }
  const clearSelectedItems = () => {
    _logger('info', 'clearSelectedItems')
    setSelectedItems([])
  }

  return {
    selectedItems,
    setSelectedItems,
    onSelectAll,
    isSelected,
    onSelectItem,
    clearSelectedItems,
  }
}

function _logger(type, funcName, msg = '') {
  loggerService[type](`[useSelection] [${funcName}] ${msg}`)
}
