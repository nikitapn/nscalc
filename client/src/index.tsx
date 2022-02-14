// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { TabPane, Menu, MenuButton } from './tab_menu'
import { View_NutrientSolutions } from './view_solutions'
import { View_Fertilizers } from './view_fertilizers'
import { View_Calculator } from './view_calculator'
import { View_Books } from './view_books'
import { WLogin, set_user_data } from './wlogin'
import * as NPRPC from './nprpc';
import * as npkcalc from './npkcalc'
import { store } from './store'
import * as che from './calc'
import global from './global'
import {MyIcons} from './global'
import * as utils from './utils'
import { fetch_user_data } from './store_calculations'
import {calculator, authorizator} from './rpc'

class App extends TabPane {
	constructor(props:any) {
		super(props);
		this.add_view(View_Calculator, "CALCULATOR", true);
		this.add_view(View_NutrientSolutions, "SOLUTIONS", false);
		this.add_view(View_Fertilizers, "FERTILIZERS", false);
		//this.add_view(View_Books, "BOOKS", false);
	}
	componentDidMount() {
		super.componentDidMount();
		let this_ = this;
		document.addEventListener("new_calculation", () => {window.scrollTo(0, 0); this_.select_view(0)});
	}
	render() {
		let { view_builder } = this.state;
		if (view_builder.length === 0) return (<div key="nc"></div>);
		return (
			<div key="hc">
				<div style={{display: 'flex'}}>
				<Menu className={this.props.menu_className} ref={this.menu} active_index={this.active_index_after_adding} items=
				{
					view_builder.map((x, index) => {
					return {
						name: x.tab_name, 
						ref: React.createRef<MenuButton>(),
						onclick: () => { this.handle_select_view(this.views[index]) },
						oncloseclick: () => { this.remove_view(index) }
					};})
				}/>
				<WLogin className="wlogin"/>
			</div>
				<div className="main">
					{
						view_builder.map((x, index) => { return (x.create(index)) })
					}
				</div>
			</div>
		);
	}
}

async function ping() {
//	await obj.Ping();
//	console.log("ping");
//	setTimeout(ping, 5000);
}

async function fetch_data() {
	let solutions = NPRPC.make_ref<NPRPC.Flat.Vector_Direct2<npkcalc.Flat_npkcalc.Solution_Direct>>();
	let fertilizers = NPRPC.make_ref<NPRPC.Flat.Vector_Direct2<npkcalc.Flat_npkcalc.Fertilizer_Direct>>();
	let t0 = performance.now()

	try {
		await (global.icons as MyIcons).fetch(calculator);
		await calculator.GetData(solutions, fertilizers);

		for (let s of solutions.value) {
			store.solutions.add(che.Solution.create_from_data(s));
		}

		for (let f of fertilizers.value) {
			store.fertilizers.add(che.Fertilizer.create_from_data(f));
		}
		
		await fetch_user_data();

		(window as any).root.dispatchEvent(new Event("ce_data_recieved"));
	} catch (e) {
		console.log(e);
	}

	let t1 = performance.now();
	console.log("Call to RPC took " + (t1 - t0) + " milliseconds.");

	//	setTimeout(ping, 5000);
}

let root = document.getElementById('root') as HTMLDivElement;
(window as any).root = root;

root.addEventListener("ce_data_recieved", () => {
	ReactDOM.render(
		<App menu_className="tab" dynamic={false} />,
		root
	);
	let body = document.getElementById("id_body") as HTMLBodyElement
	body.style.display = 'block';
});

async function auth() {
	let session_id = utils.getCookie("sid");
	if (session_id) {
		try { set_user_data(await authorizator.LogInWithSessionId(session_id), false); } catch(e) {}
	}
	fetch_data();
}

auth();
