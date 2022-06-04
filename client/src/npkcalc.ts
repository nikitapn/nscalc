import * as NPRPC from './nprpc'

export const enum ELEMENT { //u32
  N_NO3,
  N_NH4 = 1,
  P = 2,
  K = 3,
  Ca = 4,
  Mg = 5,
  S = 6,
  Cl = 7,
  Fe = 8,
  Zn = 9,
  B = 10,
  Mn = 11,
  Cu = 12,
  Mo = 13,
  CO3 = 14,
  _P1 = 15,
  _P2 = 16,
  _P3 = 17,
  _P4 = 18,
  _P5 = 19,
  _P6 = 20,
  _P7 = 21,
  _P8 = 22,
  H = 23,
  O = 24,
  C = 25,
  NH4 = 26,
  NO3 = 27,
  SO4 = 28,
  H2PO4 = 29
}
export interface Solution {
  id: number/*u32*/;
  name: string;
  owner: string;
  elements: Array<number/*float64*/>;
}

export namespace Flat_npkcalc {
export class Solution_Direct extends NPRPC.Flat.Flat {
  public get id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get name() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 4;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set name(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 4, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public get owner() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 12;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set owner(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 12, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public elements_vd() { return new NPRPC.Flat.Array_Direct1_float64(this.buffer, this.offset + 24, 14); }
}
} // namespace Flat 
export const enum FertilizerBottle { //u8
  BOTTLE_A,
  BOTTLE_B = 1,
  BOTTLE_C = 2
}
export const enum FertilizerType { //u8
  DRY,
  LIQUID = 1,
  SOLUTION = 2
}
export interface Fertilizer {
  id: number/*u32*/;
  name: string;
  owner: string;
  formula: string;
}

export namespace Flat_npkcalc {
export class Fertilizer_Direct extends NPRPC.Flat.Flat {
  public get id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get name() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 4;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set name(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 4, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public get owner() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 12;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set owner(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 12, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public get formula() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 20;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set formula(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 20, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
export interface TargetElement {
  value: number/*float64*/;
  value_base: number/*float64*/;
  ratio: number/*float64*/;
}

export namespace Flat_npkcalc {
export class TargetElement_Direct extends NPRPC.Flat.Flat {
  public get value() { return this.buffer.dv.getFloat64(this.offset+0,true); }
  public set value(value: number) { this.buffer.dv.setFloat64(this.offset+0,value,true); }
  public get value_base() { return this.buffer.dv.getFloat64(this.offset+8,true); }
  public set value_base(value: number) { this.buffer.dv.setFloat64(this.offset+8,value,true); }
  public get ratio() { return this.buffer.dv.getFloat64(this.offset+16,true); }
  public set ratio(value: number) { this.buffer.dv.setFloat64(this.offset+16,value,true); }
}
} // namespace Flat 
export interface Calculation {
  id: number/*u32*/;
  name: string;
  elements: Array<TargetElement>;
  fertilizers_ids: Array<number/*u32*/>;
  volume: number/*float64*/;
  mode: boolean/*boolean*/;
}

export namespace Flat_npkcalc {
export class Calculation_Direct extends NPRPC.Flat.Flat {
  public get id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get name() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 4;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set name(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 4, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public elements_vd() { return new NPRPC.Flat.Array_Direct2<Flat_npkcalc.TargetElement_Direct>(this.buffer, this.offset + 16, 24, Flat_npkcalc.TargetElement_Direct, 14); }
  public fertilizers_ids(elements_size: number): void { 
    NPRPC.Flat._alloc(this.buffer, this.offset + 352, elements_size, 4, 4);
  }
  public fertilizers_ids_vd() { return new NPRPC.Flat.Vector_Direct1_u32(this.buffer, this.offset + 352); }
  public get volume() { return this.buffer.dv.getFloat64(this.offset+360,true); }
  public set volume(value: number) { this.buffer.dv.setFloat64(this.offset+360,value,true); }
  public get mode() { return (this.buffer.dv.getUint8(this.offset+368) === 0x01); }
  public set mode(value: boolean) { this.buffer.dv.setUint8(this.offset+368, value === true ? 0x01 : 0x00); }
}
} // namespace Flat 
export interface Media {
  name: string;
  data: Array<number/*u8*/>;
}

export namespace Flat_npkcalc {
export class Media_Direct extends NPRPC.Flat.Flat {
  public get name() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 0;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set name(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 0, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public data(elements_size: number): void { 
    NPRPC.Flat._alloc(this.buffer, this.offset + 8, elements_size, 1, 1);
  }
  public data_vd() { return new NPRPC.Flat.Vector_Direct1_u8(this.buffer, this.offset + 8); }
}
} // namespace Flat 
export const enum AuthorizationFailed_Reason { //u8
  email_does_not_exist,
  incorrect_password = 1,
  session_does_not_exist = 2
}
export class AuthorizationFailed extends NPRPC.Exception {
  constructor(public reason?: AuthorizationFailed_Reason) { super("AuthorizationFailed"); }
}

export namespace Flat_npkcalc {
export class AuthorizationFailed_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get reason() { return this.buffer.dv.getUint8(this.offset+4); }
  public set reason(value: AuthorizationFailed_Reason) { this.buffer.dv.setUint8(this.offset+4,value); }
}
} // namespace Flat 
export interface UserData {
  name: string;
  session_id: string;
  db: NPRPC.detail.ObjectId;
}

export namespace Flat_npkcalc {
export class UserData_Direct extends NPRPC.Flat.Flat {
  public get name() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 0;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set name(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 0, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public get session_id() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 8;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set session_id(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 8, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public get db() { return new NPRPC.detail.Flat_nprpc_base.ObjectId_Direct(this.buffer, this.offset + 16); }
}
} // namespace Flat 
export interface SolutionElement {
  index: number/*u32*/;
  value: number/*float64*/;
}

export namespace Flat_npkcalc {
export class SolutionElement_Direct extends NPRPC.Flat.Flat {
  public get index() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set index(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get value() { return this.buffer.dv.getFloat64(this.offset+8,true); }
  public set value(value: number) { this.buffer.dv.setFloat64(this.offset+8,value,true); }
}
} // namespace Flat 
export class Authorizator extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IAuthorizator_Servant {
    return _IAuthorizator_Servant;
  }


  public async LogIn(login: /*in*/string, password: /*in*/string): Promise<UserData> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(176);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 0;
  let _ = new Flat_npkcalc.npkcalc_M1_Direct(buf,32);
  _._1 = login;
  _._2 = password;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1) {
      npkcalc_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M2_Direct(buf, 16);
  let __ret_value: UserData;
  (__ret_value as any) = new Object();
  __ret_value.name = out._1.name;
  __ret_value.session_id = out._1.session_id;
  __ret_value.db = NPRPC.oid_create_from_flat(out._1.db);
  return __ret_value;
}

  public async LogInWithSessionId(session_id: /*in*/string): Promise<UserData> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(168);
    buf.commit(40);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 1;
  let _ = new Flat_npkcalc.npkcalc_M3_Direct(buf,32);
  _._1 = session_id;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1) {
      npkcalc_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M2_Direct(buf, 16);
  let __ret_value: UserData;
  (__ret_value as any) = new Object();
  __ret_value.name = out._1.name;
  __ret_value.session_id = out._1.session_id;
  __ret_value.db = NPRPC.oid_create_from_flat(out._1.db);
  return __ret_value;
}

  public async LogOut(session_id: /*in*/string): Promise<boolean/*boolean*/> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(168);
    buf.commit(40);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 2;
  let _ = new Flat_npkcalc.npkcalc_M3_Direct(buf,32);
  _._1 = session_id;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M4_Direct(buf, 16);
  let __ret_value: boolean/*boolean*/;
  __ret_value = out._1;
  return __ret_value;
}

};

export interface IAuthorizator_Servant
{
  LogIn(login: string, password: string): UserData;
  LogInWithSessionId(session_id: string): UserData;
  LogOut(session_id: string): boolean/*boolean*/;
}

export class _IAuthorizator_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "npkcalc/npkcalc.Authorizator"; }
  public readonly get_class = () => { return _IAuthorizator_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IAuthorizator_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IAuthorizator_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
  let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
  switch(__ch.function_idx) {
    case 0: {
      let ia = new Flat_npkcalc.npkcalc_M1_Direct(buf, 32);
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(200);
      obuf.commit(72);
      let oa = new Flat_npkcalc.npkcalc_M2_Direct(obuf,16);
let __ret_val: UserData;
      try {
      __ret_val = (obj as any).LogIn(ia._1, ia._2);
      }
      catch(e) {
        let obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(24);
        obuf.commit(24);
        let oa = new Flat_npkcalc.AuthorizationFailed_Direct(obuf,16);
        oa.__ex_id = 0;
  oa.reason = e.reason;
        obuf.write_len(obuf.size - 4);
        obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        return;
      }
  oa._1.name = __ret_val.name;
  oa._1.session_id = __ret_val.session_id;
  oa._1.db.object_id = __ret_val.db.object_id;
  oa._1.db.ip4 = __ret_val.db.ip4;
  oa._1.db.port = __ret_val.db.port;
  oa._1.db.websocket_port = __ret_val.db.websocket_port;
  oa._1.db.poa_idx = __ret_val.db.poa_idx;
  oa._1.db.flags = __ret_val.db.flags;
  oa._1.db.class_id = __ret_val.db.class_id;
  oa._1.db.hostname = __ret_val.db.hostname;
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    case 1: {
      let ia = new Flat_npkcalc.npkcalc_M3_Direct(buf, 32);
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(200);
      obuf.commit(72);
      let oa = new Flat_npkcalc.npkcalc_M2_Direct(obuf,16);
let __ret_val: UserData;
      try {
      __ret_val = (obj as any).LogInWithSessionId(ia._1);
      }
      catch(e) {
        let obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(24);
        obuf.commit(24);
        let oa = new Flat_npkcalc.AuthorizationFailed_Direct(obuf,16);
        oa.__ex_id = 0;
  oa.reason = e.reason;
        obuf.write_len(obuf.size - 4);
        obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        return;
      }
  oa._1.name = __ret_val.name;
  oa._1.session_id = __ret_val.session_id;
  oa._1.db.object_id = __ret_val.db.object_id;
  oa._1.db.ip4 = __ret_val.db.ip4;
  oa._1.db.port = __ret_val.db.port;
  oa._1.db.websocket_port = __ret_val.db.websocket_port;
  oa._1.db.poa_idx = __ret_val.db.poa_idx;
  oa._1.db.flags = __ret_val.db.flags;
  oa._1.db.class_id = __ret_val.db.class_id;
  oa._1.db.hostname = __ret_val.db.hostname;
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    case 2: {
      let ia = new Flat_npkcalc.npkcalc_M3_Direct(buf, 32);
let __ret_val: boolean/*boolean*/;
      __ret_val = (obj as any).LogOut(ia._1);
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(17);
      obuf.commit(17);
      let oa = new Flat_npkcalc.npkcalc_M4_Direct(obuf,16);
  oa._1 = __ret_val;
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    default:
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
  }
  }
}

export class RegisteredUser extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IRegisteredUser_Servant {
    return _IRegisteredUser_Servant;
  }


  public async GetMyCalculations(calculations: /*out*/NPRPC.ref<NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Calculation_Direct>>): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(32);
    buf.commit(32);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 0;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M5_Direct(buf, 16);
  calculations.value = out._1_vd();
}

  public async AddSolution(name: /*in*/string, elements: /*in*/Array<number>/*14*/): Promise<number/*u32*/> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(280);
    buf.commit(152);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 1;
  let _ = new Flat_npkcalc.npkcalc_M6_Direct(buf,32);
  _._1 = name;
  _._2_vd().copy_from_ts_array(elements); 
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M7_Direct(buf, 16);
  let __ret_value: number/*u32*/;
  __ret_value = out._1;
  return __ret_value;
}

  public async SetSolutionName(id: /*in*/number, name: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 2;
  let _ = new Flat_npkcalc.npkcalc_M8_Direct(buf,32);
  _._1 = id;
  _._2 = name;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async SetSolutionElements(id: /*in*/number, name: /*in*/Array<SolutionElement>): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 3;
  let _ = new Flat_npkcalc.npkcalc_M9_Direct(buf,32);
  _._1 = id;
  _._2(name.length);
  {
  let vv = _._2_vd(), index = 0;
  for (let e of vv) {
          e.index = name[index].index;
      e.value = name[index].value;
    ++index;
  }
  }
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async DeleteSolution(id: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 4;
  let _ = new Flat_npkcalc.npkcalc_M7_Direct(buf,32);
  _._1 = id;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async AddFertilizer(name: /*in*/string, formula: /*in*/string): Promise<number/*u32*/> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(176);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 5;
  let _ = new Flat_npkcalc.npkcalc_M1_Direct(buf,32);
  _._1 = name;
  _._2 = formula;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M7_Direct(buf, 16);
  let __ret_value: number/*u32*/;
  __ret_value = out._1;
  return __ret_value;
}

  public async SetFertilizerName(id: /*in*/number, name: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 6;
  let _ = new Flat_npkcalc.npkcalc_M8_Direct(buf,32);
  _._1 = id;
  _._2 = name;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async SetFertilizerFormula(id: /*in*/number, name: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 7;
  let _ = new Flat_npkcalc.npkcalc_M8_Direct(buf,32);
  _._1 = id;
  _._2 = name;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async DeleteFertilizer(id: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 8;
  let _ = new Flat_npkcalc.npkcalc_M7_Direct(buf,32);
  _._1 = id;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async SaveData(): Promise<void> {
    let interface_idx = (arguments.length == 0 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(32);
    buf.commit(32);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 9;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async UpdateCalculation(calculation: /*in*/Calculation): Promise<number/*u32*/> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(536);
    buf.commit(408);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 10;
  let _ = new Flat_npkcalc.npkcalc_M10_Direct(buf,32);
  _._1.id = calculation.id;
  _._1.name = calculation.name;
  {
  let vv = _._1.elements_vd(), index = 0;
  for (let e of vv) {
          e.value = calculation.elements[index].value;
      e.value_base = calculation.elements[index].value_base;
      e.ratio = calculation.elements[index].ratio;
    ++index;
  }
  }
  _._1.fertilizers_ids(calculation.fertilizers_ids.length);
  _._1.fertilizers_ids_vd().copy_from_ts_array(calculation.fertilizers_ids); 
  _._1.volume = calculation.volume;
  _._1.mode = calculation.mode;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M7_Direct(buf, 16);
  let __ret_value: number/*u32*/;
  __ret_value = out._1;
  return __ret_value;
}

  public async DeleteCalculation(id: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 11;
  let _ = new Flat_npkcalc.npkcalc_M7_Direct(buf,32);
  _._1 = id;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async Advise(obj: /*in*/NPRPC.detail.ObjectId): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(200);
    buf.commit(72);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 12;
  let _ = new Flat_npkcalc.npkcalc_M11_Direct(buf,32);
  _._1.object_id = obj.object_id;
  _._1.ip4 = obj.ip4;
  _._1.port = obj.port;
  _._1.websocket_port = obj.websocket_port;
  _._1.poa_idx = obj.poa_idx;
  _._1.flags = obj.flags;
  _._1.class_id = obj.class_id;
  _._1.hostname = obj.hostname;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

};

export interface IRegisteredUser_Servant
{
  GetMyCalculations(calculations: NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Calculation_Direct>): void;
  AddSolution(name: string, elements: NPRPC.Flat.Array_Direct1_float64): number/*u32*/;
  SetSolutionName(id: number, name: string): void;
  SetSolutionElements(id: number, name: NPRPC.Flat.Vector_Direct2<Flat_npkcalc.SolutionElement_Direct>): void;
  DeleteSolution(id: number): void;
  AddFertilizer(name: string, formula: string): number/*u32*/;
  SetFertilizerName(id: number, name: string): void;
  SetFertilizerFormula(id: number, name: string): void;
  DeleteFertilizer(id: number): void;
  SaveData(): void;
  UpdateCalculation(calculation: Flat_npkcalc.Calculation_Direct): number/*u32*/;
  DeleteCalculation(id: number): void;
  Advise(obj: NPRPC.ObjectProxy): void;
}

export class _IRegisteredUser_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "npkcalc/npkcalc.RegisteredUser"; }
  public readonly get_class = () => { return _IRegisteredUser_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IRegisteredUser_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IRegisteredUser_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
  let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
  switch(__ch.function_idx) {
    case 0: {
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(152);
      obuf.commit(24);
      let oa = new Flat_npkcalc.npkcalc_M5_Direct(obuf,16);
      (obj as any).GetMyCalculations(oa._1_vd);
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    case 1: {
      let ia = new Flat_npkcalc.npkcalc_M6_Direct(buf, 32);
let __ret_val: number/*u32*/;
      __ret_val = (obj as any).AddSolution(ia._1, ia._2_vd());
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(20);
      obuf.commit(20);
      let oa = new Flat_npkcalc.npkcalc_M7_Direct(obuf,16);
  oa._1 = __ret_val;
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    case 2: {
      let ia = new Flat_npkcalc.npkcalc_M8_Direct(buf, 32);
      (obj as any).SetSolutionName(ia._1, ia._2);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 3: {
      let ia = new Flat_npkcalc.npkcalc_M9_Direct(buf, 32);
      (obj as any).SetSolutionElements(ia._1, ia._2_vd());
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 4: {
      let ia = new Flat_npkcalc.npkcalc_M7_Direct(buf, 32);
      (obj as any).DeleteSolution(ia._1);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 5: {
      let ia = new Flat_npkcalc.npkcalc_M1_Direct(buf, 32);
let __ret_val: number/*u32*/;
      __ret_val = (obj as any).AddFertilizer(ia._1, ia._2);
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(20);
      obuf.commit(20);
      let oa = new Flat_npkcalc.npkcalc_M7_Direct(obuf,16);
  oa._1 = __ret_val;
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    case 6: {
      let ia = new Flat_npkcalc.npkcalc_M8_Direct(buf, 32);
      (obj as any).SetFertilizerName(ia._1, ia._2);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 7: {
      let ia = new Flat_npkcalc.npkcalc_M8_Direct(buf, 32);
      (obj as any).SetFertilizerFormula(ia._1, ia._2);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 8: {
      let ia = new Flat_npkcalc.npkcalc_M7_Direct(buf, 32);
      (obj as any).DeleteFertilizer(ia._1);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 9: {
      (obj as any).SaveData();
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 10: {
      let ia = new Flat_npkcalc.npkcalc_M10_Direct(buf, 32);
let __ret_val: number/*u32*/;
      __ret_val = (obj as any).UpdateCalculation(ia._1);
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(20);
      obuf.commit(20);
      let oa = new Flat_npkcalc.npkcalc_M7_Direct(obuf,16);
  oa._1 = __ret_val;
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    case 11: {
      let ia = new Flat_npkcalc.npkcalc_M7_Direct(buf, 32);
      (obj as any).DeleteCalculation(ia._1);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 12: {
      let ia = new Flat_npkcalc.npkcalc_M11_Direct(buf, 32);
      (obj as any).Advise(NPRPC.create_object_from_flat(ia._1, remote_endpoint.ip4));
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    default:
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
  }
  }
}

export class DataObserver extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IDataObserver_Servant {
    return _IDataObserver_Servant;
  }


  public async DataChanged(idx: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 0;
  let _ = new Flat_npkcalc.npkcalc_M7_Direct(buf,32);
  _._1 = idx;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

};

export interface IDataObserver_Servant
{
  DataChanged(idx: number): void;
}

export class _IDataObserver_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "npkcalc/npkcalc.DataObserver"; }
  public readonly get_class = () => { return _IDataObserver_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IDataObserver_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IDataObserver_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
  let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
  switch(__ch.function_idx) {
    case 0: {
      let ia = new Flat_npkcalc.npkcalc_M7_Direct(buf, 32);
      (obj as any).DataChanged(ia._1);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    default:
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
  }
  }
}

export class Calculator extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _ICalculator_Servant {
    return _ICalculator_Servant;
  }


  public async GetData(solutions: /*out*/NPRPC.ref<NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Solution_Direct>>, fertilizers: /*out*/NPRPC.ref<NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Fertilizer_Direct>>): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(32);
    buf.commit(32);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 0;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M12_Direct(buf, 16);
  solutions.value = out._1_vd();
  fertilizers.value = out._2_vd();
}

  public async GetImages(images: /*out*/NPRPC.ref<NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Media_Direct>>): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(32);
    buf.commit(32);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 1;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint(), buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_npkcalc.npkcalc_M13_Direct(buf, 16);
  images.value = out._1_vd();
}

};

export interface ICalculator_Servant
{
  GetData(solutions: NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Solution_Direct>, fertilizers: NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Fertilizer_Direct>): void;
  GetImages(images: NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Media_Direct>): void;
}

export class _ICalculator_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "npkcalc/npkcalc.Calculator"; }
  public readonly get_class = () => { return _ICalculator_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _ICalculator_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _ICalculator_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
  let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
  switch(__ch.function_idx) {
    case 0: {
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(160);
      obuf.commit(32);
      let oa = new Flat_npkcalc.npkcalc_M12_Direct(obuf,16);
      (obj as any).GetData(oa._1_vd, oa._2_vd);
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    case 1: {
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(152);
      obuf.commit(24);
      let oa = new Flat_npkcalc.npkcalc_M13_Direct(obuf,16);
      (obj as any).GetImages(oa._1_vd);
      obuf.write_len(obuf.size - 4);
      obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
      obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
      break;
    }
    default:
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
  }
  }
}


function npkcalc_throw_exception(buf: NPRPC.FlatBuffer): void { 
  switch( buf.read_exception_number() ) {
  case 0:
  {
    let ex_flat = new Flat_npkcalc.AuthorizationFailed_Direct(buf, 16);
    let ex = new AuthorizationFailed();
  ex.reason = ex_flat.reason;
    throw ex;
  }
  default:
    throw "unknown rpc exception";
  }
}
export interface npkcalc_M1 {
  _1: string;
  _2: string;
}

export namespace Flat_npkcalc {
export class npkcalc_M1_Direct extends NPRPC.Flat.Flat {
  public get _1() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 0;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set _1(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 0, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public get _2() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 8;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set _2(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 8, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
export interface npkcalc_M2 {
  _1: UserData;
}

export namespace Flat_npkcalc {
export class npkcalc_M2_Direct extends NPRPC.Flat.Flat {
  public get _1() { return new UserData_Direct(this.buffer, this.offset + 0); }
}
} // namespace Flat 
export interface npkcalc_M3 {
  _1: string;
}

export namespace Flat_npkcalc {
export class npkcalc_M3_Direct extends NPRPC.Flat.Flat {
  public get _1() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 0;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set _1(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 0, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
export interface npkcalc_M4 {
  _1: boolean/*boolean*/;
}

export namespace Flat_npkcalc {
export class npkcalc_M4_Direct extends NPRPC.Flat.Flat {
  public get _1() { return (this.buffer.dv.getUint8(this.offset+0) === 0x01); }
  public set _1(value: boolean) { this.buffer.dv.setUint8(this.offset+0, value === true ? 0x01 : 0x00); }
}
} // namespace Flat 
export interface npkcalc_M5 {
  _1: Array<Calculation>;
}

export namespace Flat_npkcalc {
export class npkcalc_M5_Direct extends NPRPC.Flat.Flat {
  public _1(elements_size: number): void { 
    NPRPC.Flat._alloc(this.buffer, this.offset + 0, elements_size, 376, 8);
  }
  public _1_vd() { return new NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Calculation_Direct>(this.buffer, this.offset + 0, 376, Flat_npkcalc.Calculation_Direct); }
}
} // namespace Flat 
export interface npkcalc_M6 {
  _1: string;
  _2: Array<number/*float64*/>;
}

export namespace Flat_npkcalc {
export class npkcalc_M6_Direct extends NPRPC.Flat.Flat {
  public get _1() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 0;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set _1(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 0, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public _2_vd() { return new NPRPC.Flat.Array_Direct1_float64(this.buffer, this.offset + 8, 14); }
}
} // namespace Flat 
export interface npkcalc_M7 {
  _1: number/*u32*/;
}

export namespace Flat_npkcalc {
export class npkcalc_M7_Direct extends NPRPC.Flat.Flat {
  public get _1() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set _1(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export interface npkcalc_M8 {
  _1: number/*u32*/;
  _2: string;
}

export namespace Flat_npkcalc {
export class npkcalc_M8_Direct extends NPRPC.Flat.Flat {
  public get _1() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set _1(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get _2() {
    let enc = new TextDecoder("utf-8");
    let v_begin = this.offset + 4;
    let data_offset = v_begin + this.buffer.dv.getUint32(v_begin, true);
    let bn = this.buffer.array_buffer.slice(data_offset, data_offset + this.buffer.dv.getUint32(v_begin + 4, true));
    return enc.decode(bn);
  }
  public set _2(str: string) {
    let enc = new TextEncoder();
    let bytes = enc.encode(str);
    let len = bytes.length;
    let offset = NPRPC.Flat._alloc(this.buffer, this.offset + 4, len, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
export interface npkcalc_M9 {
  _1: number/*u32*/;
  _2: Array<SolutionElement>;
}

export namespace Flat_npkcalc {
export class npkcalc_M9_Direct extends NPRPC.Flat.Flat {
  public get _1() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set _1(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public _2(elements_size: number): void { 
    NPRPC.Flat._alloc(this.buffer, this.offset + 4, elements_size, 16, 8);
  }
  public _2_vd() { return new NPRPC.Flat.Vector_Direct2<Flat_npkcalc.SolutionElement_Direct>(this.buffer, this.offset + 4, 16, Flat_npkcalc.SolutionElement_Direct); }
}
} // namespace Flat 
export interface npkcalc_M10 {
  _1: Calculation;
}

export namespace Flat_npkcalc {
export class npkcalc_M10_Direct extends NPRPC.Flat.Flat {
  public get _1() { return new Calculation_Direct(this.buffer, this.offset + 0); }
}
} // namespace Flat 
export interface npkcalc_M11 {
  _1: NPRPC.detail.ObjectId;
}

export namespace Flat_npkcalc {
export class npkcalc_M11_Direct extends NPRPC.Flat.Flat {
  public get _1() { return new NPRPC.detail.Flat_nprpc_base.ObjectId_Direct(this.buffer, this.offset + 0); }
}
} // namespace Flat 
export interface npkcalc_M12 {
  _1: Array<Solution>;
  _2: Array<Fertilizer>;
}

export namespace Flat_npkcalc {
export class npkcalc_M12_Direct extends NPRPC.Flat.Flat {
  public _1(elements_size: number): void { 
    NPRPC.Flat._alloc(this.buffer, this.offset + 0, elements_size, 136, 8);
  }
  public _1_vd() { return new NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Solution_Direct>(this.buffer, this.offset + 0, 136, Flat_npkcalc.Solution_Direct); }
  public _2(elements_size: number): void { 
    NPRPC.Flat._alloc(this.buffer, this.offset + 8, elements_size, 28, 4);
  }
  public _2_vd() { return new NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Fertilizer_Direct>(this.buffer, this.offset + 8, 28, Flat_npkcalc.Fertilizer_Direct); }
}
} // namespace Flat 
export interface npkcalc_M13 {
  _1: Array<Media>;
}

export namespace Flat_npkcalc {
export class npkcalc_M13_Direct extends NPRPC.Flat.Flat {
  public _1(elements_size: number): void { 
    NPRPC.Flat._alloc(this.buffer, this.offset + 0, elements_size, 16, 4);
  }
  public _1_vd() { return new NPRPC.Flat.Vector_Direct2<Flat_npkcalc.Media_Direct>(this.buffer, this.offset + 0, 16, Flat_npkcalc.Media_Direct); }
}
} // namespace Flat 
