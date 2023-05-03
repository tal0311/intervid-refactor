<template>
  <div class="template-picker">
    <h2>{{ $getTrans('create-new-interview') }}</h2>
    <div class="list-wrapper">
      <!-- TODO: This div should have a v-mounted, which is the directive defined locally in this cmp
      I turned it off for now since it throws errors, it should be added back when the directive is defined
      -->
      <div ref="scrollable-list" class="template-card-list" @scroll="setArrows">
        <button v-if="isStartBtnShowen" class="material-icons scroll-btn start" @click="scrollTo(-1)">
          chevron_left
        </button>
        <div class="template-card-preview add" @click="$router.push({name: 'JobEdit'})">
          <i class="material-icons">add</i>
          <h2>{{ $getTrans('create-new') }}</h2>
        </div>
        <div
          v-for="template in defaultTemplates"
          :key="template.title"
          class="template-card-preview"
          @click="onUseTemplate(template._id)"
        >
          <img :src="template.coverUrl || defaultImgUrl.jobCover" alt="job cover" />
          <h2>{{ template.title }}</h2>
        </div>
        <button v-if="isEndBtnShowen" class="material-icons scroll-btn end" @click="scrollTo(1)">chevron_right</button>
      </div>
    </div>
  </div>
</template>

<script>
import {defaultImgUrl} from '@/services/constData'

export default {
  directives: {
    mounted(el, _, {context}) {
      // TODO: CONVERT TO VUE3
      //in vue 3 there is no "context" inside vnode anymore. try "ctx.ctx".
      context.nextTick(() => {
        // maybe "$nextTick"
        const {clientWidth, scrollWidth} = el
        if (clientWidth === scrollWidth) {
          context.isStartBtnShowen = false
          context.isEndBtnShowen = false
        } else if (el) {
          context.setArrows({target: el})
        }
      })
    },
  },
  data() {
    return {
      isStartBtnShowen: false,
      isEndBtnShowen: true,
    }
  },

  computed: {
    defaultTemplates() {
      return this.$store.getters['template/defaultTemplates']
    },

    defaultImgUrl() {
      return defaultImgUrl
    },

    isEnglish() {
      return this.$store.getters['app/lang'] === 'en'
    },
  },

  methods: {
    onUseTemplate(templateId) {
      this.$router.push({name: 'JobEdit', query: {templateId}})
    },

    scrollTo(dir) {
      const elScrollableList = this.$refs['scrollable-list']
      const {scrollLeft, childNodes, scrollWidth} = elScrollableList
      const cardCount = Array.from(childNodes).filter((elChild) => elChild.nodeName === 'DIV').length
      let cardWidth = elScrollableList.children[1].clientWidth
      const gap = (scrollWidth - cardWidth * cardCount) / (cardCount - 1)
      cardWidth += gap / 2
      const nextScrollPosition = this.isEnglish ? scrollLeft + cardWidth : scrollLeft - cardWidth
      const prevScrollPosition = this.isEnglish ? scrollLeft - cardWidth : scrollLeft + cardWidth
      const scrollPosition = dir === -1 ? prevScrollPosition : nextScrollPosition
      elScrollableList.scrollTo(scrollPosition, 0)
    },

    setArrows({target}) {
      const {scrollLeft, clientWidth, scrollWidth} = target
      this.isStartBtnShowen = scrollLeft > 0
      this.isEndBtnShowen = scrollLeft + clientWidth < scrollWidth - 10
    },
  },
}
</script>
