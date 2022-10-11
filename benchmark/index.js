const b = require('benny')
const { getSmoothShadow } = require('../lib')

b.suite(
  'getSmoothShadow Benchmark',

  b.add('getSmoothShadow', () => {
    return getSmoothShadow()
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'benchmark', version: '1.0.0' }),
  b.save({ file: 'benchmark', format: 'chart.html' })
)
