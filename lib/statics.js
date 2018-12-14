'use strict'

const GPIO_KEY = 'gpio'
const DEBOUNCE_TIMEOUT = 10

const FALLING = '0'
const RISING = '1'

const eventNames = {
  RISING: 'rising',
  FALLING: 'falling',
  BOTH: 'both',
  ERROR: 'error'
}

const GPIO_STATUS = {
  [FALLING]: false,
  [RISING]: true
}

const GPIO_STATUS_EVENT = {
  [FALLING]: eventNames.FALLING,
  [RISING]: eventNames.RISING
}

const eventAliases = {
  RISING: eventNames.RISING,
  FALLING: eventNames.FALLING,
  BOTH: eventNames.BOTH,
  ERROR: eventNames.ERROR,
  ON: eventNames.RISING,
  OFF: eventNames.FALLING,
  CHANGE: eventNames.BOTH
}

module.exports = {
  GPIO_KEY,
  DEBOUNCE_TIMEOUT,
  GPIO_STATUS,
  GPIO_STATUS_EVENT,
  eventNames: eventAliases
}
