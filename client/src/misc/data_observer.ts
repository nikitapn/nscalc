import * as NPRPC from 'nprpc';
import * as npkcalc from 'rpc/npkcalc'

import { alarms, Alarm } from 'misc/alarm'

export class DataObserverImpl extends npkcalc._IDataObserver_Servant implements npkcalc.IDataObserver_Servant {
	DataChanged(idx: number): void {
		// console.log("DataObserverImpl(): " + idx.toString());
	}

	OnAlarm(alarm: npkcalc.Flat_npkcalc.Alarm_Direct) {
		for (let i = 0; i < alarms.length; ++i) {
			if (alarms[i].confirmed) {
				alarms.splice(i, 0, new Alarm(alarm.id, alarm.type, alarm.msg));
				return;		
			}
		}
		alarms.push(new Alarm(alarm.id, alarm.type, alarm.msg));
	}
}