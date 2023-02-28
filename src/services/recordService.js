import httpService from './httpService'

export const recordService = {
  query,
}

function query(filterBy, sort, cancelToken) {
  // const key = 'record/query'
  // const token = _handleCancelRequest(key)
  const {itemsPerPage, currPage} = filterBy
  delete filterBy.itemsPerPage
  delete filterBy.currPage
  const filterQuery = this.$getUrlParamsFromObj({...filterBy, ...sort})

  return httpService.customRequest(
    'get',
    `record?limit=${itemsPerPage}&skip=${currPage * itemsPerPage}&${filterQuery.substring(1)}`,
    null,
    {cancelToken},
  )
  // return httpService.get(`record?limit=${itemsPerPage}&skip=${currPage * itemsPerPage}&${filterQuery.substr(1)}`)
}
