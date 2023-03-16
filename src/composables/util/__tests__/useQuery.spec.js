import {describe, beforeEach, it, expect, vi} from 'vitest'
import {useRouter, useRoute} from 'vue-router'
import {useQuery} from '../useQuery.js'

vi.mock('vue-router')

describe('onSetQuery', () => {
  async function testQuery(routeInput, {query, path}, expectedOutput) {
    useRoute.mockReturnValue(routeInput)
    const {onSetQuery} = useQuery()
    onSetQuery(query, path)
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(useRouter().push).toHaveBeenCalledWith(expectedOutput)
  }

  useRouter.mockReturnValue({
    push: vi.fn(),
  })
  beforeEach(() => {
    useRouter().push.mockReset()
  })

  it('calls router.push with the correct query and params, when no params were present in the route', async () => {
    await testQuery(
      {
        query: {},
        params: {},
      },
      {query: {test: 'query'}},
      {
        query: {test: 'query'},
      },
    )
  })

  it('calls router.push with the correct query and params, when params were present in the route', async () => {
    await testQuery(
      {
        query: {},
        params: {test: 'param'},
      },
      {query: {test: 'query'}},
      {
        params: {test: 'param'},
        query: {test: 'query'},
      },
    )
  })
  it('calls router.push with the correct query and params, when a path was passed', async () => {
    await testQuery(
      {
        query: {},
        params: {},
      },
      {query: {test: 'query'}, path: '/test'},
      {
        path: '/test',
        query: {test: 'query'},
      },
    )
  })

  it('calls router.push with the correct query and params, when a path was passed and params were present in the route', async () => {
    await testQuery(
      {
        query: {},
        params: {test: 'param'},
      },
      {query: {test: 'query'}, path: '/test'},
      {
        path: '/test',
        params: {test: 'param'},
        query: {test: 'query'},
      },
    )
  })
})
