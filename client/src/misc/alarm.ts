import * as nscalc from 'rpc/npkcalc'
import { observable, computed } from 'mobx'

export class Alarm implements nscalc.Alarm {
  @observable confirmed: boolean;
  constructor(public id: number, public type: nscalc.AlarmType, public  msg: string) {
    this.confirmed = false;
  }
}

export let alarms = observable(new Array<Alarm>());