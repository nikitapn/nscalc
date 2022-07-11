
import * as npkcalc from 'rpc/npkcalc'
import { narrow, ObjectProxy } from 'nprpc'
import global from 'misc/global'
import { setCookie } from 'misc/utils'
import { get_calculations } from 'tables/store_calculations'

export function set_user_data(ud: npkcalc.UserData | null, component_mounted: boolean): void {
	if (ud === null) {
		global.user_data.is_logged_in = false;
		global.user_data.user = "Guest";
		global.user_data.email = "";
		if (global.user_data.reg_user) {
			global.user_data.reg_user.release();
		}
		global.user_data.reg_user = null;
		setCookie("sid", undefined, 31, false);
		get_calculations();
		return;
	}
	
	global.user_data.user = ud.name;
	
	let obj = new ObjectProxy(ud.db); 
	obj.add_ref();
	global.user_data.reg_user = narrow(obj, npkcalc.RegisteredUser);
	if (global.user_data.reg_user === null) {
		console.log("narrowing failed");
	}

	if (component_mounted) {
		get_calculations().then(	() => document.dispatchEvent(new CustomEvent("calc_data_received")) );
	}
	
	setCookie("sid", ud.session_id, 31, false);

	global.user_data.is_logged_in = true;
}