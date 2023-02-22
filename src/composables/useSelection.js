export function useSelection() {}
const onSelectAll = (items) => {
  if (selectedItems.value.length) return selectedItems.value.splice(0)
  selectedItems.value = items.slice()
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
  selectedItems.value = []
}
