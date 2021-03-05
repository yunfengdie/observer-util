import { queueReaction } from '../reactionRunner'

export class RunnerManager {
  constructor () {
    this.runners = new Map()
  }

  add (reaction, operation) {
    // use last operation as source
    this.runners.set(reaction, operation)
  }

  uuid = 0;
  flush = (actionName, uuid) => {
    actionName = actionName || 'OB_UTIL_FLUSH'
    uuid = typeof uuid === 'undefined' ? this.uuid++ : uuid
    // copy incase being modified during exec reaction
    const todoCopy = this.runners
    this.runners = new Map()

    for (const [reaction, operation] of todoCopy.entries()) {
      queueReaction(reaction, operation, actionName, uuid)
    }
  };
}
