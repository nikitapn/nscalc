import * as NPRPC from '@/index_internal'

const u8enc = new TextEncoder();
const u8dec = new TextDecoder();

export class Nameserver extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _INameserver_Servant {
    return _INameserver_Servant;
  }


  public async Bind(obj: /*in*/NPRPC.detail.ObjectId, name: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    let buf = NPRPC.FlatBuffer.create();
    buf.prepare(216);
    buf.commit(88);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
    __ch.object_id = this.data.object_id;
    __ch.poa_idx = this.data.poa_idx;
    __ch.interface_idx = interface_idx;
    __ch.function_idx = 0;
  let _ = new Flat_nprpc_nameserver.nprpc_nameserver_M1_Direct(buf,32);
  NPRPC.oid_assign_from_ts(_._1, obj);
  _._2 = name;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint, buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
}

  public async Resolve(name: /*in*/string, obj: /*out*/NPRPC.ref<NPRPC.ObjectProxy>): Promise<boolean/*boolean*/> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
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
  let _ = new Flat_nprpc_nameserver.nprpc_nameserver_M2_Direct(buf,32);
  _._1 = name;
    buf.write_len(buf.size - 4);
    await NPRPC.rpc.call(
      this.endpoint, buf, this.timeout
    );
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
  let out = new Flat_nprpc_nameserver.nprpc_nameserver_M3_Direct(buf, 16);
  obj.value = NPRPC.create_object_from_flat(out._2, this.endpoint);
  let __ret_value: boolean/*boolean*/;
  __ret_value = out._1;
  return __ret_value;
}

};

export interface INameserver_Servant
{
  Bind(obj: NPRPC.ObjectProxy, name: string): void;
  Resolve(name: string, obj: NPRPC.detail.Flat_nprpc_base.ObjectId_Direct): boolean/*boolean*/;
}

export class _INameserver_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "nprpc_nameserver/Nameserver"; }
  public readonly get_class = () => { return _INameserver_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _INameserver_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _INameserver_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
  let __ch = new NPRPC.impl.Flat_nprpc_base.CallHeader_Direct(buf, 16);
  switch(__ch.function_idx) {
    case 0: {
      let ia = new Flat_nprpc_nameserver.nprpc_nameserver_M1_Direct(buf, 32);
      (obj as any).Bind(NPRPC.create_object_from_flat(ia._1, remote_endpoint), ia._2);
      NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
      break;
    }
    case 1: {
      let ia = new Flat_nprpc_nameserver.nprpc_nameserver_M2_Direct(buf, 32);
      let obuf = buf;
      obuf.consume(obuf.size);
      obuf.prepare(200);
      obuf.commit(72);
      let oa = new Flat_nprpc_nameserver.nprpc_nameserver_M3_Direct(obuf,16);
let __ret_val: boolean/*boolean*/;
      __ret_val = (obj as any).Resolve(ia._1, oa._2);
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

export interface nprpc_nameserver_M1 {
  _1: NPRPC.detail.ObjectId;
  _2: string;
}

export namespace Flat_nprpc_nameserver {
export class nprpc_nameserver_M1_Direct extends NPRPC.Flat.Flat {
  public get _1() { return new NPRPC.detail.Flat_nprpc_base.ObjectId_Direct(this.buffer, this.offset + 0); }
  public get _2() {
    const offset = this.offset + 48;
    const n = this.buffer.dv.getUint32(offset + 4, true);
    return n > 0 ? u8dec.decode(new DataView(this.buffer.array_buffer, offset + this.buffer.dv.getUint32(offset, true), n)) : ""
  }
  public set _2(str: string) {
    const bytes = u8enc.encode(str);
    const offset = NPRPC.Flat._alloc(this.buffer, this.offset + 48, bytes.length, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
export interface nprpc_nameserver_M2 {
  _1: string;
}

export namespace Flat_nprpc_nameserver {
export class nprpc_nameserver_M2_Direct extends NPRPC.Flat.Flat {
  public get _1() {
    const offset = this.offset + 0;
    const n = this.buffer.dv.getUint32(offset + 4, true);
    return n > 0 ? u8dec.decode(new DataView(this.buffer.array_buffer, offset + this.buffer.dv.getUint32(offset, true), n)) : ""
  }
  public set _1(str: string) {
    const bytes = u8enc.encode(str);
    const offset = NPRPC.Flat._alloc(this.buffer, this.offset + 0, bytes.length, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
export interface nprpc_nameserver_M3 {
  _1: boolean/*boolean*/;
  _2: NPRPC.detail.ObjectId;
}

export namespace Flat_nprpc_nameserver {
export class nprpc_nameserver_M3_Direct extends NPRPC.Flat.Flat {
  public get _1() { return (this.buffer.dv.getUint8(this.offset+0) === 0x01); }
  public set _1(value: boolean) { this.buffer.dv.setUint8(this.offset+0, value === true ? 0x01 : 0x00); }
  public get _2() { return new NPRPC.detail.Flat_nprpc_base.ObjectId_Direct(this.buffer, this.offset + 8); }
}
} // namespace Flat 
