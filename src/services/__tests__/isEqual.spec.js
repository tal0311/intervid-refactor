import {test, expect} from 'vitest'
import {utilService} from '../utilService.js'

test('isObject', () => {
  expect(utilService.isObject({})).toBe(true)
  expect(utilService.isObject(null)).toBe(false)
  expect(utilService.isObject(undefined)).toBe(false)
  expect(utilService.isObject(42)).toBe(false)
})

test('isPlainObject', () => {
  expect(utilService.isPlainObject({})).toBe(true)
  expect(utilService.isPlainObject(new Date())).toBe(false)
  expect(utilService.isPlainObject([])).toBe(false)
})

test('isArray', () => {
  expect(utilService.isArray([])).toBe(true)
  expect(utilService.isArray({})).toBe(false)
  expect(utilService.isArray(42)).toBe(false)
})

test('isEqual - primitives', () => {
  expect(utilService.isEqual(42, 42)).toBe(true)
  expect(utilService.isEqual('hello', 'hello')).toBe(true)
  expect(utilService.isEqual(null, null)).toBe(true)
  expect(utilService.isEqual(undefined, undefined)).toBe(true)
  expect(utilService.isEqual('hello', 42)).toBe(false)
})

test('isEqual - arrays', () => {
  expect(utilService.isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  expect(utilService.isEqual([1, 2, 3], [1, 2])).toBe(false)
  expect(utilService.isEqual([{a: 1}, {b: 2}], [{a: 1}, {b: 2}])).toBe(true)
  expect(utilService.isEqual([{a: 1}, {b: 2}], [{a: 1}, {b: 3}])).toBe(false)
})

test('isEqual - plain objects', () => {
  expect(utilService.isEqual({a: 1, b: 2}, {a: 1, b: 2})).toBe(true)
  expect(utilService.isEqual({a: 1, b: 2}, {a: 1})).toBe(false)
  expect(utilService.isEqual({a: {b: 1}}, {a: {b: 1}})).toBe(true)
  expect(utilService.isEqual({a: {b: 1}}, {a: {b: 2}})).toBe(false)
})

test('isEqual - mixed types', () => {
  expect(utilService.isEqual([1, 2, 3], {0: 1, 1: 2, 2: 3})).toBe(false)
  expect(utilService.isEqual({a: 1}, null)).toBe(false)
  expect(utilService.isEqual(undefined, {a: 1})).toBe(false)
})
