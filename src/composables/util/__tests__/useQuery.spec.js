import {describe, beforeEach, it, expect, vi} from 'vitest'
import {useRouter, useRoute} from 'vue-router'
import {useQuery} from '../useQuery.js'

vi.mock('vue-router')
describe('onSetQuery', () => {
  useRouter.mockReturnValue({
    push: vi.fn(),
  })
  beforeEach(() => {
    useRouter().push.mockReset()
    // Create mock Vue Router methods
    // route = {
    //   path: '/',
    //   query: {},
    //   params: {},
    // }
    // router = {
    //   push: fn((newRoute) => {
    //     route.path = newRoute.path
    //     route.query = newRoute.query
    //     route.params = newRoute.params
    //   }),
    // }
  })

  it('calls router.push with the correct query and params, when no params were present in the route', async () => {
    useRoute.mockReturnValue({
      query: {},
      params: {},
    })
    // Call the useQuery composable with our mock router and route objects
    const {onSetQuery} = useQuery()

    // Call onSetQuery with some test query parameters
    onSetQuery({test: 'query'})

    // Wait for the debounce delay to pass
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Assert that router.push was called with the correct parameters
    expect(useRouter().push).toHaveBeenCalledWith({
      query: {test: 'query'},
    })
  })

  it('calls router.push with the correct query and params, when params were present in the route', async () => {
    useRoute.mockReturnValue({
      query: {},
      params: {test: 'param'},
    })
    // Call the useQuery composable with our mock router and route objects
    const {onSetQuery} = useQuery()

    // Call onSetQuery with some test query parameters
    onSetQuery({test: 'query'})

    // Wait for the debounce delay to pass
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Assert that router.push was called with the correct parameters
    expect(useRouter().push).toHaveBeenCalledWith({
      params: {test: 'param'},
      query: {test: 'query'},
    })
  })
  it('calls router.push with the correct query and params, when a path was passed', async () => {
    useRoute.mockReturnValue({
      query: {},
      params: {},
    })
    // Call the useQuery composable with our mock router and route objects
    const {onSetQuery} = useQuery()

    // Call onSetQuery with some test query parameters
    onSetQuery({test: 'query'}, '/test')

    // Wait for the debounce delay to pass
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Assert that router.push was called with the correct parameters
    expect(useRouter().push).toHaveBeenCalledWith({
      path: '/test',
      query: {test: 'query'},
    })
  })

  it('calls router.push with the correct query and params, when a path was passed and params were present in the route', async () => {
    useRoute.mockReturnValue({
      query: {},
      params: {test: 'param'},
    })
    // Call the useQuery composable with our mock router and route objects
    const {onSetQuery} = useQuery()

    // Call onSetQuery with some test query parameters
    onSetQuery({test: 'query'}, '/test')

    // Wait for the debounce delay to pass
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Assert that router.push was called with the correct parameters
    expect(useRouter().push).toHaveBeenCalledWith({
      params: {test: 'param'},
      query: {test: 'query'},
    })
  })
})
