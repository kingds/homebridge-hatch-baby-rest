import { hap } from '../shared/hap'
import { CharacteristicValue, PlatformAccessory } from "homebridge"
import { BaseAccessory } from '../shared/base-accessory'
import { RestIot } from './rest-iot'
import { Restore } from './restore'
import { logInfo } from '../shared/util'


export class RoutineButtonAccessory extends BaseAccessory {
  constructor(device : RestIot, accessory: PlatformAccessory) {
    super(device, accessory);

    const { Service, Characteristic } = hap,
      service = this.getService(Service.StatelessProgrammableSwitch)

    service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
      .onSet(async (value: CharacteristicValue) => {
        const eventValue = value as number; // Explicitly cast to number

        if (eventValue === Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS) {
          device.nextStep()
        } else if (eventValue === Characteristic.ProgrammableSwitchEvent.LONG_PRESS) {
          device.turnOff();
        }
      });

    service.setPrimaryService(true)
  }
}

