import {useFilter} from './useFilter'
/**
 * @description A composable to handle pagination in overview pages.
 *
 * @param {Object} options - Optional object containing filterBy and onSetFilterByKey properties
 * @param {Ref<Object>} options.filterBy - The reactive filter object used to filter data on the page
 * @param {Function} options.onSetFilterByKey - The function used to set a filter value by its key
 *
 * @returns {Object} The object containing the onChangePage function
 *
 * @example
 * import { usePagination } from './usePagination'
 *
 * // Using the composable without any arguments
 * const { onChangePage } = usePagination()
 *
 * // Using the composable with arguments
 * import { useFilter } from './useFilter'
 *
 * const { filterBy, onSetFilterByKey } = useFilter()
 * const { onChangePage } = usePagination({ filterBy, onSetFilterByKey })
 */
export function usePagination({filterBy, onSetFilterByKey} = useFilter()) {
  /**
   * A function to update the current page number in the filter object
   *
   * @param {Object} options - Optional object containing the `to` and `diff` properties
   * @param {Number} options.to - The new current page number
   * @param {Number} options.diff - The difference between the current page number and the new page number
   */
  const onChangePage = ({to, diff}) => {
    let currPage = filterBy.value.currPage || 0
    currPage = +currPage + diff >= 0 ? +currPage + diff : currPage
    currPage = to !== undefined ? to : currPage
    onSetFilterByKey('currPage', currPage)
  }

  return {
    onChangePage,
  }
}
