// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as Calculation from './calculation'
import global from './global'
import * as NPRPC from './nprpc';
import * as npkcalc from './npkcalc'
import { TableModel } from './table_item'
import { poa } from './rpc'

class Table_Calculations extends TableModel(class {}, Calculation.Calculation) {
	constructor() {
		super();
	}
	store() {
//		networking.send(new Array<IMyEvent>(new Event_UserSavesCalculations(this.items)));
	}
	private get_new_id() {
		let id = 0;
		for (let calc of this.items) {
			let calc_id = calc.get_id();
			if (calc_id >= id) id = calc_id + 1;
		}
		return id;
	}
	
	create_calculation(): Calculation.Calculation {
		let calc = new Calculation.Calculation(true, this.get_new_id());
		this.items.push(calc);
		return calc;
	}
}

export let calculations = new Table_Calculations();


class DataObserverImpl extends npkcalc._IDataObserver_Servant implements npkcalc.IDataObserver_Servant {
	DataChanged(idx: number): void {
		console.log("DataObserverImpl(): " + idx.toString());
	}
}

export async function fetch_user_data() {
	if (global.user_data.reg_user) {
		let calculations_data = NPRPC.make_ref<NPRPC.Flat.Vector_Direct2<npkcalc.Flat_npkcalc.Calculation_Direct>>();
		await global.user_data.reg_user.GetMyCalculations(calculations_data);

		for (let calc_data of calculations_data.value) {
			calculations.add(Calculation.Calculation.create_from_data(calc_data));
		}
		await global.user_data.reg_user.Advise(poa.activate_object(new DataObserverImpl()));
	}
}