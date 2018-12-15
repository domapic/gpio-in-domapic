# Gpio In Domapic

> Handler to be used internally by Domapic Modules for controlling a gpio in \"in\" mode

[![Build status][travisci-image]][travisci-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Quality Gate][quality-gate-image]][quality-gate-url] [![js-standard-style][standard-image]][standard-url]

[![NPM dependencies][npm-dependencies-image]][npm-dependencies-url] [![Last commit][last-commit-image]][last-commit-url] [![Last release][release-image]][release-url]

[![NPM downloads][npm-downloads-image]][npm-downloads-url] [![License][license-image]][license-url]

---

## Intro

This package provides a Domapic handler for controlling a relay using the [onoff][onoff-url] library internally.  Passing to it a Domapic module instance, it will retrieve the module instance configuration defined when started the service, and will configure the gpio based on it.

Just define which are your module "options keys" for configuring the relay, and the handler will automatically load the configuration. Or you can also set the options with fixed values programatically.

## Installation

```bash
npm i gpio-in-domapic -save
```

## Usage

#### `new Gpio(domapicModule, [options[, configurationKeys]])`

* `options` `<object>` Object containing default values for options. Will apply these values if no configuration keys are provided.
  * `debounceTimeout` `<boolean>` Defines the debounceTimeout time for the gpio. Default is `10`. Read the [onoff][onoff-url] documentation for further info about this option.
* `configurationKeys` `<object>` Object defining configuration keys from which the options will be loaded.
  * `gpio` `<string>` Key defining the configuration property in which the gpio number is defined. Default is `gpio`.
  * `debounceTimeout` `<string>` Key defining the configuration property in which the `debounceTimeout` option for the gpio is defined.

##### Instance

* `gpio.init()` `async method`. Initializes the gpio retrieving configuration, etc.
* `gpio.status` `getter`. Returns the current gpio status.
* `gpio.events` `getter`. Returns gpio eventEmitter object. Read the events chapter for further info.

##### Statics
* `eventNames` `<object>` Object containing gpio event names.

#### Events

Gpio instances emit events through an `eventEmitter` object exposed in the `events` getter. Event names are exposed in the Gpio static object `eventNames`. Available events are:

* `Gpio.eventNames.ON`. Emitted when gpio status change to `true`
* `Gpio.eventNames.OFF`. Emitted when gpio status change to `false`
* `Gpio.eventNames.CHANGE`. Emitted whenever the gpio status changes. It sends the new status as first argument to subscribed listeners.
* `Gpio.eventNames.ERROR`. Emitted whenever the gpio throws an error. It sends the error as first argument to subscribed listeners.

## Example

In the next example, the `gpio-in-domapic` package is used to create a [Domapic Module][domapic-service-url] having an state for returning a door status, and emitting an event when the door status changes. It also allow users to decide the debounce time when starting the module.

```js
const path = require('path')

const domapic = require('domapic-service')
const gpioIn = require('gpio-in-domapic')

domapic.createModule({
  packagePath: path.resolve(__dirname),
  customConfig: {
    gpio: {
      type: 'number',
      describe: 'Set gpio number for the door sensor'
    },
    debounce: {
      type: 'number',
      describe: 'Set debounce timeout for the door sensor',
      default: 20
    }
  }
}).then(async dmpcModule => {
  const contactSensor = new gpioIn.Gpio(dmpcModule, {
    debounceTimeout: 1000
  }, {
    debounceTimeout: 'debounce'
  })

  await dmpcModule.register({
    door: {
      description: 'Door status',
      data: {
        type: 'boolean'
      },
      state: {
        description: 'Returns current door status',
        handler: () => gpioIn.status
      },
      event: {
        description: 'Door status has changed'
      }
    }
  })

  await contactSensor.init()

  contactSensor.events.on(gpioIn.Gpio.eventNames.CHANGE, newValue => {
    dmpcModule.tracer.debug('Door status has changed', newValue)
    dmpcModule.events.emit('door', newValue)
  })

  return dmpcModule.start()
})
```

Now, the module can be started using the `debounce` option, which Gpio will use as `debounceTimeout`:

```bash
node server.js --gpio=18 --debounce=200
```

[coveralls-image]: https://coveralls.io/repos/github/javierbrea/gpio-in-domapic/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/javierbrea/gpio-in-domapic
[travisci-image]: https://travis-ci.com/javierbrea/gpio-in-domapic.svg?branch=master
[travisci-url]: https://travis-ci.com/javierbrea/gpio-in-domapic
[last-commit-image]: https://img.shields.io/github/last-commit/javierbrea/gpio-in-domapic.svg
[last-commit-url]: https://github.com/javierbrea/gpio-in-domapic/commits
[license-image]: https://img.shields.io/npm/l/gpio-in-domapic.svg
[license-url]: https://github.com/javierbrea/gpio-in-domapic/blob/master/LICENSE
[npm-downloads-image]: https://img.shields.io/npm/dm/gpio-in-domapic.svg
[npm-downloads-url]: https://www.npmjs.com/package/gpio-in-domapic
[npm-dependencies-image]: https://img.shields.io/david/javierbrea/gpio-in-domapic.svg
[npm-dependencies-url]: https://david-dm.org/javierbrea/gpio-in-domapic
[quality-gate-image]: https://sonarcloud.io/api/project_badges/measure?project=gpio-in-domapic&metric=alert_status
[quality-gate-url]: https://sonarcloud.io/dashboard?id=gpio-in-domapic
[release-image]: https://img.shields.io/github/release-date/javierbrea/gpio-in-domapic.svg
[release-url]: https://github.com/javierbrea/gpio-in-domapic/releases
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

[onoff-url]: https://www.npmjs.com/package/onoff
[domapic-service-url]: https://www.npmjs.com/package/domapic-service


