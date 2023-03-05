import {ref} from 'vue'

export function useToggle(startingValue = false) {
  const data = ref(startingValue)

  const setData = (val) => {
    data.value = val
  }

  const toggleData = () => {
    data.value = !data.value
  }

  const resetData = () => {
    data.value = startingValue
  }

  return {
    data,
    setData,
    toggleData,
    resetData,
  }
}
