import {ref} from 'vue'

export function useToggle(startingValue = false) {
  const data = ref(startingValue)

  const setData = (val) => {
    data.value = val
  }
  const toggleData = () => {
    data.value = !data.value
  }

  return {
    data,
    setData,
    toggleData,
  }
}
