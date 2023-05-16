// @vicky - other directive may work if ypu have problems
export const clickOutside = {
  mounted(el, {value: cb, modifiers}) {
    el.clickOutside = (ev) => {
      if (modifiers.prevent) ev.preventDefault()
      if (modifiers.stop) ev.stopPropagation()
      if (!el.contains(ev.target)) {
        // itemService.setModalType("");
        cb()
        // console.log('outside')
      } else {
        // console.log('inside')
      }
    }
    setTimeout(() => {
      document.addEventListener('click', el.clickOutside)
    }, 0)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutside)
  },
}

// @shachar - had problems with other directive lol
export const clickOutsideCalc = {
  mounted(el, {value: cb, modifiers}) {
    el.clickOutsideCalc = (ev) => {
      if (modifiers.prevent) ev.preventDefault()
      if (modifiers.stop) ev.stopPropagation()
      const {clientX, clientY} = ev
      const {left, top, width, height} = el.getBoundingClientRect()
      if (!(clientX > left && clientX < left + width && clientY > top && clientY < top + height)) {
        cb()
        // console.log('outside')
      } else {
        // console.log('inside')
      }
    }
    queueMicrotask(() => {
      document.addEventListener('click', el.clickOutsideCalc)
    })
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideCalc)
  },
}
