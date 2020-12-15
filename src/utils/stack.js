export class StackManager {
  constructor (onFlush) {
    this.stacks = []
    this.onFlush = onFlush
  }

  uuid = 0;
  getUUID (suffix) {
    const current = this.uuid++
    return [current, suffix || ''].join('@@')
  }

  start (target) {
    this.stacks.push(target)
  }

  end (target) {
    const lastStack = this.stacks[this.stacks.length - 1]
    if (lastStack !== target) {
      throw new Error('transaction end not match with start')
    }
    this.stacks.pop()
    if (!this.duringStack) {
      const [, suffix] =
        typeof lastStack === 'string' ? lastStack.split('@@') : []
      this.onFlush && this.onFlush(suffix, target)
    }
  }

  get duringStack () {
    return this.stacks.length > 0
  }
}
