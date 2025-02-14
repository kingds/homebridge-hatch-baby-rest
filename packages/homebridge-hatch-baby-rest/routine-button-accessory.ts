import { hap } from '../shared/hap'
import { Characteristic, PlatformAccessory } from 'homebridge'
import { BaseAccessory } from '../shared/base-accessory'
import { RestIot } from './rest-iot'
import { logInfo } from '../shared/util'

export class RoutineButtonAccessory extends BaseAccessory {
  constructor(device: RestIot, accessory: PlatformAccessory) {
    super(device, accessory)

    logInfo("Creating routine button accessory.")

    const { Service, Characteristic } = hap,
      service = this.getService(Service.StatelessProgrammableSwitch)
    this.registerCharacteristic(
      service.getCharacteristic(Characteristic.ProgrammableSwitchEvent),
      device.onSomeContentPlaying,
      (value) => {
        logInfo("Value = " + value.toString())

        if (value === Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS) {
          device.nextStep()
        } else if (value === Characteristic.ProgrammableSwitchEvent.LONG_PRESS) {
          device.turnOff()
        }
      })

    service.setPrimaryService(true)
  }
}

