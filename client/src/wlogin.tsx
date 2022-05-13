// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as React from 'react'
import global from './global'
import * as npkcalc from './npkcalc'
import {narrow, ObjectProxy} from './nprpc'
import * as utils from './utils'
import { fetch_user_data } from './store_calculations'

export function set_user_data(ud: npkcalc.UserData | null, component_mounted: boolean): void {
	if (ud === null) {
		global.user_data.user = "Guest";
		global.user_data.email = "";
		if (global.user_data.reg_user) {
			global.user_data.reg_user.release();
		}
		document.dispatchEvent(new CustomEvent("calc_clear"));
		utils.setCookie("sid", undefined, 31, false);
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
		fetch_user_data().then(	() => document.dispatchEvent(new CustomEvent("calc_data_received")) );
	}
	
	utils.setCookie("sid", ud.session_id, 31, false);
}

export class WLogin extends React.Component<{
	className: string;
},{
	is_logged_in: boolean;
	email: string;
	pwd: string;
}> {
	constructor(props:any) {
		super(props)

		this.state = {
			is_logged_in: !global.user_data.is_guest,
			email: "", pwd: ""
		};

		this.handleChangeEmail = this.handleChangeEmail.bind(this);
		this.handleChangePwd = this.handleChangePwd.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChangeEmail(event:any) {
		this.setState({email: event.target.value});
	}

	handleChangePwd(event:any) {
		this.setState({pwd: event.target.value});
	}

	handleSubmit(event: any) {
		event.preventDefault();
		let this_ = this;
		global.authorizator.LogIn(this.state.email, this.state.pwd).then((ud: npkcalc.UserData) => {
			set_user_data(ud, true);
			this_.setState({is_logged_in: true});
		}).catch((e: any) => {
			if (e instanceof npkcalc.AuthorizationFailed) {
				console.log("Authorization failed: " + e.reason);
			} else {
				console.log(e);
			}
		});
	}

	handleRegister(event: any) {
		
	}

	handleLogOut(event: any) {
		let this_ = this;
		global.authorizator.LogOut(utils.getCookie("sid")).then( () => {
			set_user_data(null, true);
			this_.setState({is_logged_in: false})
		 });
	}

	render() {
		let { className } = this.props;
		let { is_logged_in } = this.state;
		return (<div className={className}>
			{
			!is_logged_in 
			? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onSubmit={this.handleSubmit}>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
						<label>email:</label>
						<input type="email" name="email" autoComplete="username" value={this.state.email} onChange={this.handleChangeEmail}/>
					</div>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<label>password:</label>
						<input type="input" name="pwd" minLength={1} autoComplete="current-password" value={this.state.pwd} onChange={this.handleChangePwd}/>
					</div>
				</div>
					<button style={{width:'100px', height:'28px', marginRight: '10px'}}>Log in</button>
			  </form> 
			  <button style={{width:'100px', height:'28px'}} onClick={this.handleRegister}>Register</button>
			  </div>
			: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<label style={{width:'100px'}}>Hello {global.user_data.user}!</label>
					<button style={{width:'100px', height:'28px', marginRight:'10px', marginLeft: '10px'}} onClick={this.handleLogOut.bind(this)}>Log Out</button> 
			  </div> 
			}
		</div>
		);
	}
}