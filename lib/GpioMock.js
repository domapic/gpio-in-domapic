'use strict'

const EventEmitter = require('events')

class GpioEventsEmitter extends EventEmitter {}

class GpioMock {
  constructor () {
    this._eventEmitter = new GpioEventsEmitter()
  }

  get status () {
    return false
  }

  get events () {
    return this._eventEmitter
  }
}

module.exports = GpioMock
