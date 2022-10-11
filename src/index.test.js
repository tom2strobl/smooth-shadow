import { getSmoothShadow } from './'

test('usage without arguments returns string', () => {
  expect(typeof getSmoothShadow()).toEqual('string')
})
test('usage with 1 argument returns string', () => {
  expect(typeof getSmoothShadow(100)).toEqual('string')
})
test('usage with 2 arguments returns string', () => {
  expect(typeof getSmoothShadow(100, 0.5)).toEqual('string')
})
test('usage with 3 arguments returns string', () => {
  expect(typeof getSmoothShadow(100, 0.5, 0.5)).toEqual('string')
})
