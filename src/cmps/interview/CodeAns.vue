<template>
  <div class="code-ans grow">
    <v-ace-editor :value="ans.txt" @init="editorInit" @change="recordKeystroke" lang="js" />
  </div>
</template>

<script>
import {VAceEditor} from 'vue3-ace-editor'

export default {
  props: ['ans', 'questId'],

  data() {
    return {
      editor: null,
      keystrokes: [],
    }
  },

  methods: {
    editorInit(editor) {
      this.editor = editor
      editor.getSession().setMode('ace/mode/javascript')
      editor.setTheme('ace/theme/monokai')
      editor.setFontSize(14)
      editor.setValue(this.ans.txt)
      this.captureState()
    },

    recordKeystroke(e) {
      const keyEvent = {
        data: e,
        timestamp: Date.now(),
      }
      this.keystrokes.push(keyEvent)
      const ans = {
        ...this.ans,
        txt: this.editor.getValue(),
        keystrokes: this.keystrokes.slice(),
      }
      this.$emit('save-ans', ans)
    },

    captureState() {
      var keyEvent = {
        data: {
          action: 'insert',
          text: this.editor.getValue(),
        },
        timestamp: Date.now(),
      }

      this.keystrokes.push(keyEvent)
    },
  },

  watch: {
    questId() {
      this.editor.setValue(this.ans.txt)
      this.keystrokes = []
    },
  },

  components: {
    VAceEditor,
  },
}
</script>
