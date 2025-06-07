import * as NPRPC from '@/base'

const u8enc = new TextEncoder();
const u8dec = new TextDecoder();

export type oid_t = bigint/*u64*/;
export type poa_idx_t = number/*u16*/;
export type oflags_t = number/*u16*/;
export type uuid_t = Array<number/*u8*/>;
export type ifs_idx_t = number/*u8*/;
export type fn_idx_t = number/*u8*/;
export class ExceptionCommFailure extends NPRPC.Exception {
  constructor() { super("ExceptionCommFailure"); }
}

export namespace Flat_nprpc_base {
export class ExceptionCommFailure_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export class ExceptionTimeout extends NPRPC.Exception {
  constructor() { super("ExceptionTimeout"); }
}

export namespace Flat_nprpc_base {
export class ExceptionTimeout_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export class ExceptionObjectNotExist extends NPRPC.Exception {
  constructor() { super("ExceptionObjectNotExist"); }
}

export namespace Flat_nprpc_base {
export class ExceptionObjectNotExist_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export class ExceptionUnknownFunctionIndex extends NPRPC.Exception {
  constructor() { super("ExceptionUnknownFunctionIndex"); }
}

export namespace Flat_nprpc_base {
export class ExceptionUnknownFunctionIndex_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export class ExceptionUnknownMessageId extends NPRPC.Exception {
  constructor() { super("ExceptionUnknownMessageId"); }
}

export namespace Flat_nprpc_base {
export class ExceptionUnknownMessageId_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export class ExceptionUnsecuredObject extends NPRPC.Exception {
  constructor(public class_id?: string) { super("ExceptionUnsecuredObject"); }
}

export namespace Flat_nprpc_base {
export class ExceptionUnsecuredObject_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get class_id() {
    const offset = this.offset + 4;
    const n = this.buffer.dv.getUint32(offset + 4, true);
    return n > 0 ? u8dec.decode(new DataView(this.buffer.array_buffer, offset + this.buffer.dv.getUint32(offset, true), n)) : ""
  }
  public set class_id(str: string) {
    const bytes = u8enc.encode(str);
    const offset = NPRPC.Flat._alloc(this.buffer, this.offset + 4, bytes.length, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
export class ExceptionBadAccess extends NPRPC.Exception {
  constructor() { super("ExceptionBadAccess"); }
}

export namespace Flat_nprpc_base {
export class ExceptionBadAccess_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export class ExceptionBadInput extends NPRPC.Exception {
  constructor() { super("ExceptionBadInput"); }
}

export namespace Flat_nprpc_base {
export class ExceptionBadInput_Direct extends NPRPC.Flat.Flat {
  public get __ex_id() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set __ex_id(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
}
} // namespace Flat 
export const enum DebugLevel { //u32
  DebugLevel_Critical,
  DebugLevel_InactiveTimeout,
  DebugLevel_EveryCall,
  DebugLevel_EveryMessageContent,
  DebugLevel_TraceAll
}
export namespace detail { 
export interface ObjectIdLocal {
  poa_idx: poa_idx_t;
  object_id: oid_t;
}

export namespace Flat_nprpc_base {
export class ObjectIdLocal_Direct extends NPRPC.Flat.Flat {
  public get poa_idx() { return this.buffer.dv.getUint16(this.offset+0,true); }
  public set poa_idx(value: number) { this.buffer.dv.setUint16(this.offset+0,value,true); }
  public get object_id() { return this.buffer.dv.getBigUint64(this.offset+8,true); }
  public set object_id(value: bigint) { this.buffer.dv.setBigUint64(this.offset+8,value,true); }
}
} // namespace Flat 
export const enum ObjectFlag { //u32
  Lifespan = 0,
  Tethered = 1
}
export interface ObjectId {
  object_id: oid_t;
  poa_idx: poa_idx_t;
  flags: oflags_t;
  origin: uuid_t;
  class_id: string;
  urls: string;
}

export namespace Flat_nprpc_base {
export class ObjectId_Direct extends NPRPC.Flat.Flat {
  public get object_id() { return this.buffer.dv.getBigUint64(this.offset+0,true); }
  public set object_id(value: bigint) { this.buffer.dv.setBigUint64(this.offset+0,value,true); }
  public get poa_idx() { return this.buffer.dv.getUint16(this.offset+8,true); }
  public set poa_idx(value: number) { this.buffer.dv.setUint16(this.offset+8,value,true); }
  public get flags() { return this.buffer.dv.getUint16(this.offset+10,true); }
  public set flags(value: number) { this.buffer.dv.setUint16(this.offset+10,value,true); }
  public origin_d() { return new NPRPC.Flat.Array_Direct1_u8(this.buffer, this.offset + 12, 16); }
  public get class_id() {
    const offset = this.offset + 28;
    const n = this.buffer.dv.getUint32(offset + 4, true);
    return n > 0 ? u8dec.decode(new DataView(this.buffer.array_buffer, offset + this.buffer.dv.getUint32(offset, true), n)) : ""
  }
  public set class_id(str: string) {
    const bytes = u8enc.encode(str);
    const offset = NPRPC.Flat._alloc(this.buffer, this.offset + 28, bytes.length, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
  public get urls() {
    const offset = this.offset + 32;
    const n = this.buffer.dv.getUint32(offset + 4, true);
    return n > 0 ? u8dec.decode(new DataView(this.buffer.array_buffer, offset + this.buffer.dv.getUint32(offset, true), n)) : ""
  }
  public set urls(str: string) {
    const bytes = u8enc.encode(str);
    const offset = NPRPC.Flat._alloc(this.buffer, this.offset + 32, bytes.length, 1, 1);
    new Uint8Array(this.buffer.array_buffer, offset).set(bytes);
  }
}
} // namespace Flat 
} // namespace detail

export namespace impl { 
export const enum MessageId { //u32
  FunctionCall = 0,
  BlockResponse,
  AddReference,
  ReleaseObject,
  Success,
  Exception,
  Error_PoaNotExist,
  Error_ObjectNotExist,
  Error_CommFailure,
  Error_UnknownFunctionIdx,
  Error_UnknownMessageId,
  Error_BadAccess,
  Error_BadInput
}
export const enum MessageType { //u32
  Request = 0,
  Answer
}
export interface Header {
  size: number/*u32*/;
  msg_id: MessageId;
  msg_type: MessageType;
  reserved: number/*u32*/;
}

export namespace Flat_nprpc_base {
export class Header_Direct extends NPRPC.Flat.Flat {
  public get size() { return this.buffer.dv.getUint32(this.offset+0,true); }
  public set size(value: number) { this.buffer.dv.setUint32(this.offset+0,value,true); }
  public get msg_id() { return this.buffer.dv.getUint32(this.offset+4,true); }
  public set msg_id(value: MessageId) { this.buffer.dv.setUint32(this.offset+4,value,true); }
  public get msg_type() { return this.buffer.dv.getUint32(this.offset+8,true); }
  public set msg_type(value: MessageType) { this.buffer.dv.setUint32(this.offset+8,value,true); }
  public get reserved() { return this.buffer.dv.getUint32(this.offset+12,true); }
  public set reserved(value: number) { this.buffer.dv.setUint32(this.offset+12,value,true); }
}
} // namespace Flat 
export interface CallHeader {
  poa_idx: poa_idx_t;
  interface_idx: ifs_idx_t;
  function_idx: fn_idx_t;
  object_id: oid_t;
}

export namespace Flat_nprpc_base {
export class CallHeader_Direct extends NPRPC.Flat.Flat {
  public get poa_idx() { return this.buffer.dv.getUint16(this.offset+0,true); }
  public set poa_idx(value: number) { this.buffer.dv.setUint16(this.offset+0,value,true); }
  public get interface_idx() { return this.buffer.dv.getUint8(this.offset+2); }
  public set interface_idx(value: number) { this.buffer.dv.setUint8(this.offset+2,value); }
  public get function_idx() { return this.buffer.dv.getUint8(this.offset+3); }
  public set function_idx(value: number) { this.buffer.dv.setUint8(this.offset+3,value); }
  public get object_id() { return this.buffer.dv.getBigUint64(this.offset+8,true); }
  public set object_id(value: bigint) { this.buffer.dv.setBigUint64(this.offset+8,value,true); }
}
} // namespace Flat 
} // namespace impl


function nprpc_base_throw_exception(buf: NPRPC.FlatBuffer): void { 
  switch( buf.read_exception_number() ) {
  case 0:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionCommFailure_Direct(buf, 16);
    let ex = new ExceptionCommFailure();
    throw ex;
  }
  case 1:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionTimeout_Direct(buf, 16);
    let ex = new ExceptionTimeout();
    throw ex;
  }
  case 2:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionObjectNotExist_Direct(buf, 16);
    let ex = new ExceptionObjectNotExist();
    throw ex;
  }
  case 3:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionUnknownFunctionIndex_Direct(buf, 16);
    let ex = new ExceptionUnknownFunctionIndex();
    throw ex;
  }
  case 4:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionUnknownMessageId_Direct(buf, 16);
    let ex = new ExceptionUnknownMessageId();
    throw ex;
  }
  case 5:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionUnsecuredObject_Direct(buf, 16);
    let ex = new ExceptionUnsecuredObject();
  ex.class_id = ex_flat.class_id;
    throw ex;
  }
  case 6:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionBadAccess_Direct(buf, 16);
    let ex = new ExceptionBadAccess();
    throw ex;
  }
  case 7:
  {
    let ex_flat = new Flat_nprpc_base.ExceptionBadInput_Direct(buf, 16);
    let ex = new ExceptionBadInput();
    throw ex;
  }
  default:
    throw "unknown rpc exception";
  }
}
export namespace detail.helpers {
export const assign_from_flat_ObjectId = (src: Flat_nprpc_base.ObjectId_Direct): ObjectId => {
  let dest: ObjectId;
  (dest as any) = new Object();
  dest.object_id = src.object_id;
  dest.poa_idx = src.poa_idx;
  dest.flags = src.flags;
  {
  let vv = src.origin_d(), index_0 = 0;
  (dest.origin as Array<any>) = new Array<any>(vv.elements_size)
  for (let e of vv) {
  dest.origin[index_0] = e;
    ++index_0;
  }
  }
  dest.class_id = src.class_id;
  dest.urls = src.urls;
  return dest;
}
export const assign_from_ts_ObjectId = (dest: Flat_nprpc_base.ObjectId_Direct, src: ObjectId) => {
  dest.object_id = src.object_id;
  dest.poa_idx = src.poa_idx;
  dest.flags = src.flags;
  dest.origin_d().copy_from_ts_array(src.origin); 
  dest.class_id = src.class_id;
  dest.urls = src.urls;
}
} // namespace detail.helpers
