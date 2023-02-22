// core
import {computed} from 'vue'

import {useRoute} from 'vue-router'
import {useFilter} from './useFilter'

import {getTrans} from '@/services/i18nService.js'
// we want this composable to be able to be used in components that already use the useFilter composable (while sharing its state),
// so we need to be able to pass in the useFilter composable as an argument, while maintaining the ability to use it on it's own,
// so we use destructuring and a default value
export function useTags({useFilter: {onSetFilterByKey} = useFilter()}) {
  const tagList = computed(() => {
    const queries = useRoute().query

    const tags = []
    for (const key in queries) {
      if (key === 'daysAgo' && queries[key]) tags.push({name: getTrans('date'), type: 'daysAgo'})
      if (key === 'incomplete' && queries[key] !== undefined) {
        const tag =
          queries[key] === 'false'
            ? {name: getTrans('complete-interviews'), type: 'incomplete'}
            : {name: getTrans('incomplete-interviews'), type: 'incomplete'}
        tags.push(tag)
      }
      if (key === 'showArchived' && queries[key] === 'true')
        tags.push({name: getTrans('archived'), type: 'showArchived'})
      if (key === 'tag' && queries[key]) {
        const tag = queries[key].split(',')
        tag.forEach((t) => {
          tags.push({name: t, type: 'tag'})
        })
      }
    }
    return tags
  })
  const onRemoveTag = (tag) => {
    let value = ''
    if (tag.type === 'incomplete') value = undefined
    else if (tag.type === 'statuses') value = []
    onSetFilterByKey(tag.type, value)
    // if (tag.type === 'incomplete') onSetFilterByKey(tag.type, undefined)
    // else if (tag.type === 'statuses') onSetFilterByKey(tag.type, [])
    // else {
    //   onSetFilterByKey(tag.type, '')
    // }
  }

  return {
    tagList,
    onRemoveTag,
  }
}
