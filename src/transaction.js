import { StackManager } from './utils/stack'
import { decoratorFactory } from './utils/decorator'
import { RunnerManager } from './utils/runner'
import { createAction } from './action'

export const runnerManager = new RunnerManager()
export const transactionManager = new StackManager(runnerManager.flush)

export function startTransaction (target) {
  transactionManager.start(target)
}

export function endTransaction (target) {
  transactionManager.end(target)
}

/**
 * wrapper sync function to support batch
 * @param {*} target
 * @param {*} propertyKey
 * @param {*} descriptor
 */
export const withTransaction = decoratorFactory(
  createTransaction,
  createAction
)

export function createTransaction (originalFunc, ...restNames) {
  if (typeof originalFunc !== 'function') {
    throw new Error(
      'transaction should must wrap on Function: ' + typeof originalFunc
    )
  }
  const identity = transactionManager.getUUID(restNames.join(''))
  function wrapper (...args) {
    transactionManager.start(identity)
    try {
      return originalFunc.apply(this, args)
    } finally {
      transactionManager.end(identity)
    }
  }
  if (restNames.length) {
    Object.defineProperty(wrapper, 'name', {
      configurable: true,
      writable: false,
      enumerable: false,
      value: restNames.join('')
    })
  }
  return wrapper
}
export function flush () {
  runnerManager.flush()
}
