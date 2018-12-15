'use strict'

const Gpio = require('./Gpio')
const GpioMock = require('./GpioMock')

const { GPIO_KEY, DEBOUNCE_TIMEOUT, eventNames } = require('./statics')

class GpioHandler {
  constructor (dpmcModule, options = {}, configKeys = {}) {
    this._module = dpmcModule
    this._gpioKey = configKeys.gpio || GPIO_KEY

    this._debounceTimeoutKey = configKeys.debounceTimeout

    this._defaultDebounceTimeout = options.debounceTimeout || DEBOUNCE_TIMEOUT
  }

  async init () {
    this._gpioNumber = await this._module.config.get(this._gpioKey)
    const debounceTimeout = (this._debounceTimeoutKey && await this._module.config.get(this._debounceTimeoutKey)) || this._defaultDebounceTimeout

    try {
      await this._module.tracer.info(`Initializing gpio ${this._gpioNumber} with "in" direction.`)
      this._gpio = new Gpio(this._gpioNumber, debounceTimeout)
    } catch (error) {
      await this._module.tracer.error('Error initializing gpio. Ensure that your system supports gpios programmatically', error)
      await this._module.tracer.info(`Inititalizing virtual gpio`)
      this._gpio = new GpioMock()
    }
  }

  get status () {
    return this._gpio.status
  }

  get events () {
    return this._gpio.events
  }

  static get eventNames () {
    return eventNames
  }
}

module.exports = GpioHandler
