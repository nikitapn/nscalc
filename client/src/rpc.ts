// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as NPRPC from './nprpc';
import * as npkcalc from './npkcalc'
import global from './global'

NPRPC.set_debug_level(NPRPC.DebugLevel.DebugLevel_EveryCall);
let rpc = NPRPC.init();

export let poa =rpc.create_poa(10);

export let calculator = new npkcalc.Calculator();
calculator.data.ip4 = 0x7F000001;
calculator.data.port = 0;
calculator.data.websocket_port = 80;
calculator.data.object_id = 0n;
calculator.data.poa_idx = 0;

export let authorizator = new npkcalc.Authorizator();
authorizator.data.ip4 = 0x7F000001;
authorizator.data.port = 0;
authorizator.data.websocket_port = 80;
authorizator.data.object_id = 1n;
authorizator.data.poa_idx = 0;

global.authorizator = authorizator;