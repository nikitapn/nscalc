// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as NPRPC from 'nprpc';
import * as npkcalc from 'rpc/npkcalc'

export let poa: NPRPC.Poa;
export let calculator: npkcalc.Calculator;
export let authorizator: npkcalc.Authorizator;
export let chat: npkcalc.Chat;

export const init_rpc = async (): Promise<void> => {
	NPRPC.set_debug_level(NPRPC.DebugLevel.DebugLevel_Critical);
	let rpc = await NPRPC.init();
	poa = rpc.create_poa(10);
	calculator = NPRPC.narrow(rpc.host_info.objects.calculator, npkcalc.Calculator);
	authorizator = NPRPC.narrow(rpc.host_info.objects.authorizator, npkcalc.Authorizator);
	chat = NPRPC.narrow(rpc.host_info.objects.chat, npkcalc.Chat);
}