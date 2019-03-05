'use strict'

const EventEmitter = require('events')

const death = require('death')

const { debounce } = require('lodash')

const onoffLib = require('./onoff')
const { eventNames, GPIO_STATUS, GPIO_STATUS_EVENT } = require('./statics')

class GpioEventsEmitter extends EventEmitter {}

class Gpio {
  constructor (gpioNumber, debounceTimeout) {
    this._gpioNumber = gpioNumber
    this._eventEmitter = new GpioEventsEmitter()

    const onoff = onoffLib.init()
    if (!onoff.Gpio.accessible) {
      throw new Error('Gpio is not accesible')
    }

    this._currentValue = null

    this._gpio = new onoff.Gpio(gpioNumber, 'in', 'both')

    this._gpioChangeCallback = this._gpioChangeCallback.bind(this)

    if(debounceTimeout) {
      this._gpioChangeCallback = debounce(this._gpioChangeCallback, debounceTimeout, {
        maxWait: debounceTimeout
      })
    }

    this._gpio.watch((error, value) => {
      this._gpioChangeCallback(error, value);
    })

    this._offDeath = this._addDeathListener()
  }

  _addDeathListener () {
    return death({
      uncaughtException: true
    })(() => {
      this._gpio.unwatchAll()
      if (this._gpio.unexport) {
        this._gpio.unexport()
      }
      process.exit()
    })
  }

  _getStatus () {
    return !!this._gpio.readSync()
  }

  _gpioChangeCallback (error, value) {
    if (error) {
      this._eventEmitter.emit(eventNames.ERROR, error)
    } else {
      if (this._currentValue !== value) {
        this._currentValue = value
        const statusKey = value.toString()
        const status = GPIO_STATUS[statusKey]
        this._eventEmitter.emit(eventNames.BOTH, status)
        this._eventEmitter.emit(GPIO_STATUS_EVENT[statusKey], status)
      }
    }
  }

  get status () {
    return this._getStatus()
  }

  get events () {
    return this._eventEmitter
  }
}

module.exports = Gpio
