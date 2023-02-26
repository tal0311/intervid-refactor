import {ref} from 'vue'

export function useToggle() {
  const data = ref(false)

  // Methods
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
