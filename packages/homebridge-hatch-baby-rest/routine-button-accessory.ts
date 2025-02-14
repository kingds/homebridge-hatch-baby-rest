import { Service, Characteristic, PlatformAccessory, CharacteristicValue } from "homebridge"
import { RestIot } from './rest-iot';
import { BaseAccessory } from "shared/base-accessory"
import { RestIotState } from "shared/hatch-sleep-types"
import { hap } from "shared/hap"

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

