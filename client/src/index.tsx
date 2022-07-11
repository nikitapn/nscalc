// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as React from 'react'
import * as ReactDOM from 'react-dom';

import { set_user_data } from 'misc/login'
import * as NPRPC from 'nprpc';
import * as npkcalc from 'rpc/npkcalc'
import { store } from 'tables/store'
import * as che from 'calculation/datatypes'
import global from 'misc/global'
import { MyIcons } from 'misc/global'
import * as utils from 'misc/utils'
import { get_calculations } from 'tables/store_calculations'
import { calculator, authorizator, init_rpc, poa } from 'rpc/rpc'
import { connect_to_room } from 'misc/chat'
import { DataObserverImpl } from 'misc/data_observer'
import App from 'gui/App.svelte';
import { AppReact } from 'gui/app'

let root = document.getElementById('root') as HTMLDivElement;

const app = new App({
	target: root,
	props: {}
});

root.addEventListener("ce_data_recieved", (ev:  Event) => {
	ev.stopPropagation();
	ReactDOM.render(
		<AppReact menu_className="tab" dynamic={false} />,
		app.content
	);
	let body = document.getElementById("id_body") as HTMLBodyElement
	body.style.display = 'block';
});

async function fetch_data() {
	let solutions = NPRPC.make_ref<NPRPC.Flat.Vector_Direct2<npkcalc.Flat_npkcalc.Solution_Direct>>();
	let fertilizers = NPRPC.make_ref<NPRPC.Flat.Vector_Direct2<npkcalc.Flat_npkcalc.Fertilizer_Direct>>();
	
	//let t0 = performance.now()
	try {
		await (global.icons as MyIcons).fetch(calculator);
		await calculator.GetData(solutions, fertilizers);

		for (let s of solutions.value) {
			store.solutions.add(che.Solution.create_from_data(s));
		}

		for (let f of fertilizers.value) {
			store.fertilizers.add(che.Fertilizer.create_from_data(f));
		}
		
		await get_calculations();

		await calculator.Subscribe(
			poa.activate_object(new DataObserverImpl())
		);
		root.dispatchEvent(new Event("ce_data_recieved"));
		
		connect_to_room();
	} catch (e) {
		console.log(e);
	}
	//let t1 = performance.now();
	//console.log("Call to RPC took " + (t1 - t0) + " milliseconds.");
}

async function auth() {
	await init_rpc();
	let session_id = utils.getCookie("sid");
	if (session_id != null) {
		try { set_user_data(await authorizator.LogInWithSessionId(session_id), false); } catch(e) {}
	}
	fetch_data();
};

auth();
