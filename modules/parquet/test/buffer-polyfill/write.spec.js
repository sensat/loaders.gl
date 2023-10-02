// loaders.gl, MIT license
// This file is forked from https://github.com/feross/buffer under MIT license
import test from 'tape-promise/tape';
import {BufferPolyfill} from '@loaders.gl/parquet';
// const isnan = require('is-nan')

test('buffer.write string should get parsed as number', function (t) {
  const b = new BufferPolyfill(64)
  // @ts-expect-error
  b.writeUInt16LE('1003', 0)
  t.equal(b.readUInt16LE(0), 1003)
  t.end()
})

test('buffer.writeUInt8 a fractional number will get Math.floored', function (t) {
  // Some extra work is necessary to make this test pass with the Object implementation

  const b = new BufferPolyfill(1)
  b.writeInt8(5.5, 0)
  t.equal(b[0], 5)
  t.end()
})

test('writeUint8 with a negative number throws', function (t) {
  const buf = new BufferPolyfill(1)

  t.throws(function () {
    buf.writeUInt8(-3, 0)
  })

  t.end()
})

test('hex of write{Uint,Int}{8,16,32}{LE,BE}', function (t) {
  t.plan(2 * ((2 * 2 * 2) + 2))
  const hex = [
    '03', '0300', '0003', '03000000', '00000003',
    'fd', 'fdff', 'fffd', 'fdffffff', 'fffffffd'
  ]
  const reads = [3, 3, 3, 3, 3, -3, -3, -3, -3, -3]
  const xs = ['UInt', 'Int']
  const ys = [8, 16, 32]
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i]
    for (let j = 0; j < ys.length; j++) {
      const y = ys[j]
      const endianesses = (y === 8) ? [''] : ['LE', 'BE']
      for (let k = 0; k < endianesses.length; k++) {
        const z = endianesses[k]

        const v1 = new BufferPolyfill(y / 8)
        const writefn = `write${  x  }${y  }${z}`
        const val = (x === 'Int') ? -3 : 3
        v1[writefn](val, 0)
        t.equal(
          v1.toString('hex'),
          hex.shift()
        )
        const readfn = `read${  x  }${y  }${z}`
        t.equal(
          v1[readfn](0),
          reads.shift()
        )
      }
    }
  }
  t.end()
})
/*
test('hex of write{Uint,Int}{8,16,32}{LE,BE} with overflow', function (t) {
  t.plan(3 * ((2 * 2 * 2) + 2))
  const hex = [
    '', '03', '00', '030000', '000000',
    '', 'fd', 'ff', 'fdffff', 'ffffff'
  ]
  const reads = [
    undefined, 3, 0, NaN, 0,
    undefined, 253, -256, 16777213, -256
  ]
  const xs = ['UInt', 'Int']
  const ys = [8, 16, 32]
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i]
    for (let j = 0; j < ys.length; j++) {
      const y = ys[j]
      const endianesses = (y === 8) ? [''] : ['LE', 'BE']
      for (let k = 0; k < endianesses.length; k++) {
        const z = endianesses[k]

        const v1 = new BufferPolyfill((y / 8) - 1)
        const next = new BufferPolyfill(4)
        next.writeUInt32BE(0, 0)
        const writefn = 'write' + x + y + z
        const val = (x === 'Int') ? -3 : 3
        v1[writefn](val, 0, true)
        t.equal(
          v1.toString('hex'),
          hex.shift()
        )
        // check that nothing leaked to next buffer.
        t.equal(next.readUInt32BE(0), 0)
        // check that no bytes are read from next buffer.
        next.writeInt32BE(~0, 0)
        const readfn = 'read' + x + y + z
        const r = reads.shift()
        if (isnan(r)) t.pass('equal')
        else t.equal(v1[readfn](0, true), r)
      }
    }
  }
  t.end()
})
*/

test('large values do not improperly roll over (ref #80)', function (t) {
  const nums = [-25589992, -633756690, -898146932]
  const out = new BufferPolyfill(12)
  out.fill(0)
  out.writeInt32BE(nums[0], 0)
  let newNum = out.readInt32BE(0)
  t.equal(nums[0], newNum)
  out.writeInt32BE(nums[1], 4)
  newNum = out.readInt32BE(4)
  t.equal(nums[1], newNum)
  out.writeInt32BE(nums[2], 8)
  newNum = out.readInt32BE(8)
  t.equal(nums[2], newNum)
  t.end()
})