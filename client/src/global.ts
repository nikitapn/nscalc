// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as npkcalc from './npkcalc'
import * as NPRPC from './nprpc';
import { observable, computed } from 'mobx'

export class UserData {
	@observable user: string;
	@computed get is_guest() { return this.user == "Guest" }
	email: string;
	
	reg_user: npkcalc.RegisteredUser;
	
	constructor() {
		this.user = "Guest";
		this.email = "";
	}
}

export class MyIcons {

	static get_image_jpg(abuf: ArrayBuffer) : string {
		return this.get_image('application/octet-binary', abuf);
	}
	
	static get_image_svg(abuf: ArrayBuffer) : string {
		return this.get_image('image/svg+xml', abuf);
	}
	
	static get_image(type: string, abuf: ArrayBuffer) {
		return URL.createObjectURL(new Blob([abuf], {type: type}));
	}

	public async fetch(obj: npkcalc.Calculator) {
		let images = NPRPC.make_ref<NPRPC.Flat.Vector_Direct2<npkcalc.Flat_npkcalc.Media_Direct>>();
		await obj.GetImages(images);
		for (let img of images.value) {
			(this as any)[img.name] = MyIcons.get_image_svg(img.data_vd().array_buffer);
		}
	}
}

class Global {
	user_data: UserData;
	icons: any;
	authorizator: npkcalc.Authorizator;

	constructor() {
		this.user_data = new UserData();
		this.icons = new MyIcons();
	}
}


export default new Global;


