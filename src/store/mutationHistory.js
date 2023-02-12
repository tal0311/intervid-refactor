const EMPTY_STATE = 'emptyState'
class MutationHistory {
  done = []
  undone = []
  newMutation = true
  ignoreMutations = []
  store

  addMutation(mutation) {
    if (mutation.type !== EMPTY_STATE && this.ignoreMutations.indexOf(mutation.type) === -1) {
      this.done.push(mutation)
    }
    if (this.newMutation) {
      this.undone = []
    }
  }

  init(store) {
    this.store = store
  }

  get canRedo() {
    return this.undone.length
  }

  get canUndo() {
    return this.done.length
  }

  redo() {
    const commit = this.undone.pop()
    this.newMutation = false
    switch (typeof commit.payload) {
      case 'object':
        this.store.commit(`${commit.type}`, Object.assign({}, commit.payload))
        break
      default:
        this.store.commit(`${commit.type}`, commit.payload)
    }
    this.newMutation = true
  }

  undo(mutationCount = 1) {
    this.undone.push(...this.done.splice(this.done.length - mutationCount, mutationCount))
    this.newMutation = false
    this.store.commit(EMPTY_STATE)
    this.done.forEach((mutation) => {
      switch (typeof mutation.payload) {
        case 'object':
          this.store.commit(mutation.type, Object.assign({}, mutation.payload))
          break
        default:
          this.store.commit(mutation.type, mutation.payload)
      }
      this.done.pop()
    })
    this.newMutation = true
  }
}
export const mutationHistory = new MutationHistory()
