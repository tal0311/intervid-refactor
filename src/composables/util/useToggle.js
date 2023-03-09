import {ref} from 'vue'

/**
 * @description A composable that returns a ref with a boolean value, and functions to set, toggle, and reset the value
 * @param {boolean} startingValue - The starting value of the toggle. Defaults to false
 * @returns {object} An object with a data ref, a setData function, a toggleData function, and a resetData function
 */
export function useToggle(startingValue = false) {
  /**
   * @type {import('vue').Ref<boolean>}
   */
  const data = ref(startingValue)

  function setData(val) {
    data.value = val
  }

  function toggleData() {
    data.value = !data.value
  }

  function resetData() {
    data.value = startingValue
  }

  return {
    data,
    setData,
    toggleData,
    resetData,
  }
}
