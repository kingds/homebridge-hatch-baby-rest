import { Service, Characteristic } from 'homebridge';
import { RestIot } from './rest-iot';

export class RoutineButtonAccessory {
  private service: Service;
  private currentRoutineIndex = 0;
  private routines: any[] = [];

  constructor(private readonly device: RestIot, private readonly api: any) {
    this.service = new this.api.hap.Service.StatelessProgrammableSwitch();

    this.service.getCharacteristic(this.api.hap.Characteristic.ProgrammableSwitchEvent)
      .onSet(this.handlePress.bind(this));

    this.device.fetchRoutines().then(routines => {
      this.routines = routines;
    });
  }

  private async handlePress(value: number) {
    if (value === this.api.hap.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS) {
      this.currentRoutineIndex = (this.currentRoutineIndex + 1) % this.routines.length;
      const nextRoutine = this.routines[this.currentRoutineIndex];
      this.device.update({ current: { playing: 'routine', srId: nextRoutine.id } });
    } else if (value === this.api.hap.Characteristic.ProgrammableSwitchEvent.LONG_PRESS) {
      this.device.turnOff();
    }
  }

  getServices(): Service[] {
    return [this.service];
  }
}

