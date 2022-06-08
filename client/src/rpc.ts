// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as NPRPC from './nprpc';
import * as npkcalc from './npkcalc'

export let poa: NPRPC.Poa;
export let calculator: npkcalc.Calculator;
export let authorizator: npkcalc.Authorizator;
export let chat: npkcalc.Chat;

export const init_rpc = async (): Promise<void> => {
	NPRPC.set_debug_level(NPRPC.DebugLevel.DebugLevel_Critical);
	let rpc = await NPRPC.init();
	poa = rpc.create_poa(10);
	calculator = new npkcalc.Calculator(rpc.host_info.objects.calculator);
	authorizator = new npkcalc.Authorizator(rpc.host_info.objects.authorizator);
	chat = new npkcalc.Chat(rpc.host_info.objects.chat);
}