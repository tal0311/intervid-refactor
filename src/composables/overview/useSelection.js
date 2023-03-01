import {ref} from 'vue'

export function useSelection() {
  const selectedItems = ref([])

  const setSelectedItems = (val) => {
    selectedItems.value = val
  }
  const onSelectAll = (items) => {
    // TODO: figure out what is supposed to happen in the splice
    if (selectedItems.value.length) return selectedItems.value.splice(0)
    setSelectedItems(items.slice())
  }
  const isSelected = (item) => {
    const idKey = item.id ? 'id' : '_id'
    return selectedItems.value.some((item) => item[idKey] === item[idKey])
  }
  const onSelectItem = (item) => {
    const idKey = item.id ? 'id' : '_id'
    const itemIdx = selectedItems.value.findIndex((i) => i[idKey] === item[idKey])
    if (itemIdx !== -1) selectedItems.value.splice(itemIdx, 1)
    else selectedItems.value.push(item)
  }
  const clearSelectedItems = () => {
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
