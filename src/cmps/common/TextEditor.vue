<template>
  <div class="text-editor">
    <div class="toolbar-container">
      <div :id="'toolbar' + id">
        <span class="ql-formats">
          <select class="ql-header" @click.stop="">
            <option value="2">{{ $getTrans('heading1') }}</option>
            <option value="3">{{ $getTrans('heading2') }}</option>
            <option value="">{{ $getTrans('normal') }}</option>
          </select>
        </span>

        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>

        <span v-if="tools.length" class="ql-formats">
          <button v-for="(tool, idx) in tools" :key="idx" :class="toolClassMap[tool]"></button>
        </span>
      </div>

      <span v-if="charLimit" class="char-limit">{{ textLength }}/{{ charLimit }}</span>
    </div>
    <div ref="editor"></div>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    currQuestIdx: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      required: true,
    },
    charLimit: {
      type: Number,
      default: null,
    },
    tools: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      editor: null,
      toolClassMap: {
        code: 'ql-code-block',
        image: 'ql-image',
        link: 'ql-link',
      },
    }
  },

  computed: {
    remainingCharCount() {
      return this.charLimit - this.textLength
    },

    textLength() {
      if (!this.editor) return this.modelValue && this.modelValue.length
      return this.getLengthNoTags(this.editor.getText()) - 1
    },
  },

  watch: {
    currQuestIdx() {
      this.setup()
    },
  },

  mounted() {
    this.setup()
    const scrollHeight = this.editor.scroll.domNode.scrollHeight
    this.editor.scroll.domNode.style.maxHeight = scrollHeight + 'px'
  },
  created() {
    this.id = this.$utilService.makeCmpId()
  },
  beforeUnmount() {
    this.editor.off('text-change', this.update)
  },

  methods: {
    setup() {
      this.editor = new Quill(this.$refs.editor, {
        modules: {
          toolbar: '#toolbar' + this.id,
        },
        placeholder: this.placeholder,
        theme: 'snow',
      })
      this.editor.root.innerHTML = this.modelValue || ''
      this.editor.on('text-change', this.update)
    },

    update() {
      if (this.remainingCharCount <= 0) {
        return this.editor.deleteText(this.charLimit, this.editor.getLength())
      }
      if (this.editor.root.innerHTML === this.modelValue) return
      this.$emit('update:modelValue', this.editor.getText().length !== 1 ? this.editor.root.innerHTML : '')
      const scrollHeight = this.editor.scroll.domNode.scrollHeight
      this.editor.scroll.domNode.style.maxHeight = scrollHeight + 'px'
    },

    getLengthNoTags(richText) {
      var div = document.createElement('div')
      div.innerHTML = richText
      return div.innerText.length
    },
  },
}
</script>
