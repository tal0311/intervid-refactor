import {useFilter} from './useFilter'
// we want this composable to be able to be used in components that already use the useFilter composable (while sharing its state),
// so we need to be able to pass in the useFilter composable as an argument, while maintaining the ability to use it on it's own,
// so we use destructuring and a default value.
// See example of usage in src/views/backoffice/admin/account/AccountOverview.vue
export function usePagination({filterBy, onSetFilterByKey} = useFilter()) {
  const onChangePage = ({to, diff}) => {
    let {currPage} = filterBy.value
    currPage = !currPage ? 0 : currPage
    currPage = +currPage + diff >= 0 ? +currPage + diff : currPage
    currPage = to !== undefined ? to : currPage
    onSetFilterByKey('currPage', currPage)
  }
  return {
    onChangePage,
  }
}
