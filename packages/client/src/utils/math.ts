import { create, all } from 'mathjs'
const mathjs = create(all, { number: 'BigNumber', precision: 64 })

const add = (...arg: number[]) => {
  return arg.reduce((a, b) => {
    return mathjs.number(mathjs.add(mathjs.bignumber(a), mathjs.bignumber(b)))
  })
}

const subtract = (a: number, b: number) => {
  return mathjs.number(
    mathjs.subtract(mathjs.bignumber(a), mathjs.bignumber(b)),
  )
}

const multiply = (a: number, b: number) => {
  // @ts-ignore
  return mathjs.number(
    // @ts-ignore
    mathjs.multiply(mathjs.bignumber(a), mathjs.bignumber(b)),
  )
}

const divide = (a: number, b: number) => {
  // @ts-ignore
  return mathjs.number(mathjs.divide(mathjs.bignumber(a), mathjs.bignumber(b)))
}

const toPercent = function (n: number) {
  return (Math.round(n * 10000) / 100).toFixed(2) + '%'
}

const toPrice = function (n: number) {
  return Math.round(n * 100) / 100
}

export { add, subtract, multiply, divide, toPercent, toPrice }
