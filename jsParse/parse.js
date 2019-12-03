function nullParse (input) {
  if (!input.startsWith('null')) return null
  return [null, input.slice(4)]
}
// console.log(nullParse('nullabcd'));

function booleanParse (input) {
  if (input.startsWith('true')) return [true, input.slice(4)]
  if (input.startsWith('false')) return [false, input.slice(5)]
  return null
}
// console.log(booleanParse('falseejghghii'));
// console.log(booleanParse('ksdjfksdjf'));
// console.log(booleanParse('truedkfjskdj'));

function numberParse (input) {
  if (input[0] === '-' && /[^.e\d]/i.test(input[2]) && input[1] === '0') {
    return [0, input.slice(2)]
  }
  if (input[0] === '0' && /[^.e\d]/i.test(input[1])) {
    return [0, input.slice(1)]
  }
  const result = input.match(
    /(^-?[1-9]\d*(\.\d+)?(e-?\d+)?)|(^-?\d\.\d+(e-?\d+)?)|(^-?0e-?\d+)/gi
  )
  if (result == null) return null
  const resLength = result[0].length
  let fResult = Number(input.slice(0, resLength))
  if (fResult === 0) {
    fResult = 0
  }
  return [fResult, input.slice(resLength)]
}
// console.log(numberParse('0nn'))
// console.log(numberParse('012.345hiii'));
// console.log(numberParse('0e12hiiihello'));
// console.log(numberParse('10.52e-25checking'));
// console.log(numberParse('0.123check'));
// console.log(numberParse('10.5E78'));

// console.log(stringParse('"i1234A"AD\tj\n12\\34\bg123"a"d'))
// console.log(stringParse("\"name\"923"));
// console.log(stringParse('""hello'));

function stringParse (input) {
  let result = 0
  let fResult = ''
  const obj = { '"': '"', '\\': '\\', "'": "'", n: '\n', r: '\r', b: '\b', f: '\f', t: '\t', '/': '/' }
  if (input.startsWith('"')) {
    for (let i = 1; i < input.length; i++) {
      if (input[i] === '\\') {
        if (input[i + 1] === 'u') {
          fResult += String.fromCodePoint(
            parseInt('0x' + input.slice(i + 2, i + 6))
          )
          i += 6
        } else {
          fResult += obj[input[i + 1]]
          i += 2
        }
      } else {
        fResult += input[i]
        i++
      }
      if (input[i] === '"') {
        result = i
        break
      }
      i--
    }
  } else return null
  return [fResult.slice(0, fResult.length), input.slice(result + 1)]
}
const fs = require('fs')
fs.readFile('inputt.txt', (err, data) => {
  if (err) throw err
  // console.log(nullParse(data.toString()))
  // console.log(numberParse(data.toString()))
  // console.log(stringParse(data.toString()))
  // console.log(booleanParse(data.toString()))
  // console.log(arrayParse(data.toString()))
  // console.log(objectParse(data.toString()))
  // console.log(data.toString());
})

function arrayParse (input) {
  if (input.startsWith('[')) {
    input = input.slice(1)
    const arr = []
    let final = input
    while (final) {
      final = final.trim()
      const temp =
      nullParse(final) ||
      booleanParse(final) ||
      numberParse(final) ||
      stringParse(final) ||
      arrayParse(final)
      if (temp === null) {
        return null
      }
      const first = temp[0]
      arr.push(first)
      let second = temp[1].trim()
      if (!(second[0] === ',' || second[0] === ']')) return null
      if (second[0] === ',') {
        second = second.slice(1)
      } else if (second[0] === ']') {
        return [arr, second.slice(1)]
      } final = second
    }
  } else return null
}

function objectParse(input) {
  if (input.startsWith('{')) {
    const obj = {}
    let final = input.slice(1)
    while (final) {
      final = final.trim()
      const temp =
    stringParse(final)
      if (temp === null) return null
      const first = temp[0]
      let second = temp[1]
      second = second.trim()
      if (second[0] !== ':') return null
      second = second.slice(1)
      second = second.trim()
      const temp1 =
      nullParse(second) ||
      booleanParse(second) ||
      numberParse(second) ||
      stringParse(second) ||
      arrayParse(second) ||
      objectParse(second)
      const sFirst = temp1[0]
      let sSecond = temp1[1]
      sSecond = sSecond.trim()
      obj[first] = sFirst
      if (!(sSecond[0] === ',' || sSecond[0] === '}')) return null
      if (sSecond[0] === ',') {
        sSecond = sSecond.slice(1).trim()
      }
      if (sSecond[0] === '}') {
        return [obj, sSecond.slice(1).trim()]
      } final = sSecond
    }
  } else { return null }
}
