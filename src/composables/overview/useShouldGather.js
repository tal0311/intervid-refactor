import {useToggle} from '../util/useToggle'

export function useShouldGather() {
  const {data: shouldGather, setData: setShouldGather} = useToggle()
  return {
    shouldGather,
    setShouldGather,
  }
}
