import { getSmoothShadow } from './'

test('usage without arguments returns string', () => {
  expect(typeof getSmoothShadow()).toEqual('string')
})
test('usage with 1 argument returns string', () => {
  expect(typeof getSmoothShadow({ distance: 100 })).toEqual('string')
})
test('usage with 2 arguments returns string', () => {
  expect(typeof getSmoothShadow({ distance: 100, intensity: 0.5 })).toEqual('string')
})
test('usage with 3 arguments returns string', () => {
  expect(typeof getSmoothShadow({ distance: 100, intensity: 0.5, sharpness: 0.5 })).toEqual('string')
})
