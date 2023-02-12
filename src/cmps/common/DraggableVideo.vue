<template>
  <div
    ref="draggableContainer"
    :style="{ top: 0, left: 0 }"
    class="draggable-container"
    :class="className"
    @mousedown="dragMouseDown"
    @touchstart="dragMouseDown"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DraggableVideo',

  props: ['className', 'isShown'],

  data() {
    return {
      mousePos: {
        clientX: null,
        clientY: null,
      },
      lastPos: null,
      lastBoundaries: {
        parent: null,
        container: null,
      },
    }
  },

  mounted() {
    if (!this.isShown) return
    window.addEventListener('resize', this.isOutOfBoundaries)
    document.addEventListener('fullscreenchange', this.handleFullScreen)
    this.calcLastBoundaries()
  },

  destroyed() {
    if (!this.isShown) return
    window.removeEventListener('resize', this.isOutOfBoundaries)
    document.removeEventListener('fullscreenchange', this.handleFullScreen)
  },

  methods: {
    async handleFullScreen() {
      await this.$nextTick()
      this.rePositionRelatively()
      this.calcLastBoundaries()
    },

    calcLastBoundaries() {
      const parent = this.$refs.draggableContainer.offsetParent.getBoundingClientRect()
      this.lastBoundaries.parent = {
        width: parent.width,
        height: parent.height,
      }

      const container = this.$refs.draggableContainer.getBoundingClientRect()
      this.lastBoundaries.container = {
        width: container.width,
        height: container.height,
      }
    },

    dragMouseDown(event) {
      // get the mouse cursor position at startup:
      this.mousePos.clientX = event.clientX
      this.mousePos.clientY = event.clientY
      if (!this.mousePos.clientX) this.mousePos.clientX = event.targetTouches[0].clientX
      if (!this.mousePos.clientY) this.mousePos.clientY = event.targetTouches[0].clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
      document.ontouchmove = this.elementDrag
      document.ontouchend = this.closeDragElement
    },

    isOutOfBoundaries() {
      const elContainer = this.$refs.draggableContainer

      let isOutOfBoundary = false
      if (parseInt(elContainer.style.top) < 0) {
        elContainer.style.top = 0
        isOutOfBoundary = true
      }
      if (parseInt(elContainer.style.left) < 0) {
        elContainer.style.left = 0
        isOutOfBoundary = true
      }
      if (parseInt(elContainer.style.left) > elContainer.offsetParent.clientWidth - elContainer.offsetWidth) {
        elContainer.style.left = elContainer.offsetParent.clientWidth - elContainer.offsetWidth + 'px'
        isOutOfBoundary = true
      }
      if (parseInt(elContainer.style.top) > elContainer.offsetParent.clientHeight - elContainer.clientHeight) {
        elContainer.style.top = elContainer.offsetParent.clientHeight - elContainer.clientHeight + 'px'
        isOutOfBoundary = true
      }
      return isOutOfBoundary
    },

    elementDrag(event) {
      if (this.isOutOfBoundaries()) return
      const isTouchEvent = event.type === 'touchmove'

      let movementX = this.mousePos.clientX - event.clientX
      let movementY = this.mousePos.clientY - event.clientY
      if (isTouchEvent) movementX = this.mousePos.clientX - event.targetTouches[0].clientX
      if (isTouchEvent) movementY = this.mousePos.clientY - event.targetTouches[0].clientY

      this.mousePos.clientX = event.clientX
      this.mousePos.clientY = event.clientY
      if (isTouchEvent) this.mousePos.clientX = event.targetTouches[0].clientX
      if (isTouchEvent) this.mousePos.clientY = event.targetTouches[0].clientY

      // set the element's new position:
      const top = this.$refs.draggableContainer.offsetTop - movementY
      const left = this.$refs.draggableContainer.offsetLeft - movementX
      this.$refs.draggableContainer.style.top = top + 'px'
      this.$refs.draggableContainer.style.left = left + 'px'
      this.lastPos = { top, left }
    },

    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null

      document.ontouchmove = null
      document.ontouchend = null
    },

    rePositionRelatively() {
      const elContainer = this.$refs.draggableContainer
      const parentRect = elContainer.offsetParent.getBoundingClientRect()
      const topPercent = parseFloat(elContainer.style.top || 0) / this.lastBoundaries.parent.height
      const leftPercent = parseFloat(elContainer.style.left || 0) / this.lastBoundaries.parent.width
      elContainer.style.top = parentRect.height * Math.abs(topPercent) + 'px'
      elContainer.style.left = parentRect.width * Math.abs(leftPercent) + 'px'
      this.isOutOfBoundaries()
      this.lastPos = {
        top: parseInt(elContainer.style.top || 0),
        left: parseInt(elContainer.style.left || 0),
      }
    },
  },
}
</script>
