import * as NPRPC from 'nprpc'

const u8enc = new TextEncoder();
const u8dec = new TextDecoder();

export const GUEST_ID = 2;
export const TARGET_ELEMENT_COUNT = 14;
export enum ELEMENT { //u32
  N_NO3,
  N_NH4,
  P,
  K,
  Ca,
  Mg,
  S,
  Cl,
  Fe,
  Zn,
  B,
  Mn,
  Cu,
  Mo,
  CO3,
  _P1,
  _P2,
  _P3,
  _P4,
  _P5,
  _P6,
  _P7,
  _P8,
  H,
  O,
  C,
  NH4,
  NO3,
  SO4,
  H2PO4
}

export interface Solution {
  id: number/*u32*/;
  userId: number/*u32*/;
  userName: string;
  name: string;
  elements: Float64Array;
}

export function marshal_Solution(buf: NPRPC.FlatBuffer, offset: number, data: Solution): void {
buf.dv.setUint32(offset + 0, data.id, true);
buf.dv.setUint32(offset + 4, data.userId, true);
NPRPC.marshal_string(buf, offset + 8, data.userName);
NPRPC.marshal_string(buf, offset + 16, data.name);
const __arr0 = new Float64Array(buf.array_buffer, offset + 24, 14);
__arr0.set(data.elements);
}

export function unmarshal_Solution(buf: NPRPC.FlatBuffer, offset: number): Solution {
const result = {} as Solution;
result.id = buf.dv.getUint32(offset + 0, true);
result.userId = buf.dv.getUint32(offset + 4, true);
result.userName = NPRPC.unmarshal_string(buf, offset + 8);
result.name = NPRPC.unmarshal_string(buf, offset + 16);
result.elements = new Float64Array(buf.array_buffer, offset + 24, 14);
return result;
}

export enum FertilizerBottle { //u8
  A,
  B,
  C
}

export enum FertilizerType { //u8
  Dry,
  Liquid,
  Solution
}

export interface Fertilizer {
  id: number/*u32*/;
  userId: number/*u32*/;
  userName: string;
  name: string;
  formula: string;
  elements: Float64Array;
  bottle: FertilizerBottle;
  type: FertilizerType;
  density: number/*f64*/;
  cost: number/*f64*/;
}

export function marshal_Fertilizer(buf: NPRPC.FlatBuffer, offset: number, data: Fertilizer): void {
buf.dv.setUint32(offset + 0, data.id, true);
buf.dv.setUint32(offset + 4, data.userId, true);
NPRPC.marshal_string(buf, offset + 8, data.userName);
NPRPC.marshal_string(buf, offset + 16, data.name);
NPRPC.marshal_string(buf, offset + 24, data.formula);
const __arr1 = new Float64Array(buf.array_buffer, offset + 32, 14);
__arr1.set(data.elements);
buf.dv.setUint8(offset + 144, data.bottle);
buf.dv.setUint8(offset + 145, data.type);
buf.dv.setFloat64(offset + 152, data.density, true);
buf.dv.setFloat64(offset + 160, data.cost, true);
}

export function unmarshal_Fertilizer(buf: NPRPC.FlatBuffer, offset: number): Fertilizer {
const result = {} as Fertilizer;
result.id = buf.dv.getUint32(offset + 0, true);
result.userId = buf.dv.getUint32(offset + 4, true);
result.userName = NPRPC.unmarshal_string(buf, offset + 8);
result.name = NPRPC.unmarshal_string(buf, offset + 16);
result.formula = NPRPC.unmarshal_string(buf, offset + 24);
result.elements = new Float64Array(buf.array_buffer, offset + 32, 14);
result.bottle = buf.dv.getUint8(offset + 144);
result.type = buf.dv.getUint8(offset + 145);
result.density = buf.dv.getFloat64(offset + 152, true);
result.cost = buf.dv.getFloat64(offset + 160, true);
return result;
}

export interface SolutionCursorPage {
  items: Array<Solution>;
  next_cursor?: string;
}

export function marshal_SolutionCursorPage(buf: NPRPC.FlatBuffer, offset: number, data: SolutionCursorPage): void {
NPRPC.marshal_struct_array(buf, offset + 0, data.items, marshal_Solution, 136, 8);
if (data.next_cursor !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 8, data.next_cursor, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 8, 0, true); // nullopt
}
}

export function unmarshal_SolutionCursorPage(buf: NPRPC.FlatBuffer, offset: number): SolutionCursorPage {
const result = {} as SolutionCursorPage;
result.items = NPRPC.unmarshal_struct_array(buf, offset + 0, unmarshal_Solution, 136);
if (buf.dv.getUint32(offset + 8, true) !== 0) {
  result.next_cursor = NPRPC.unmarshal_optional_struct(buf, offset + 8, NPRPC.unmarshal_string, 4);
} else {
  result.next_cursor = undefined;
}
return result;
}

export interface FertilizerCursorPage {
  items: Array<Fertilizer>;
  next_cursor?: string;
}

export function marshal_FertilizerCursorPage(buf: NPRPC.FlatBuffer, offset: number, data: FertilizerCursorPage): void {
NPRPC.marshal_struct_array(buf, offset + 0, data.items, marshal_Fertilizer, 168, 8);
if (data.next_cursor !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 8, data.next_cursor, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 8, 0, true); // nullopt
}
}

export function unmarshal_FertilizerCursorPage(buf: NPRPC.FlatBuffer, offset: number): FertilizerCursorPage {
const result = {} as FertilizerCursorPage;
result.items = NPRPC.unmarshal_struct_array(buf, offset + 0, unmarshal_Fertilizer, 168);
if (buf.dv.getUint32(offset + 8, true) !== 0) {
  result.next_cursor = NPRPC.unmarshal_optional_struct(buf, offset + 8, NPRPC.unmarshal_string, 4);
} else {
  result.next_cursor = undefined;
}
return result;
}

export interface CalculatorBootstrap {
  solutions: Array<Solution>;
  fertilizers: Array<Fertilizer>;
}

export function marshal_CalculatorBootstrap(buf: NPRPC.FlatBuffer, offset: number, data: CalculatorBootstrap): void {
NPRPC.marshal_struct_array(buf, offset + 0, data.solutions, marshal_Solution, 136, 8);
NPRPC.marshal_struct_array(buf, offset + 8, data.fertilizers, marshal_Fertilizer, 168, 8);
}

export function unmarshal_CalculatorBootstrap(buf: NPRPC.FlatBuffer, offset: number): CalculatorBootstrap {
const result = {} as CalculatorBootstrap;
result.solutions = NPRPC.unmarshal_struct_array(buf, offset + 0, unmarshal_Solution, 136);
result.fertilizers = NPRPC.unmarshal_struct_array(buf, offset + 8, unmarshal_Fertilizer, 168);
return result;
}

export interface TargetElement {
  value: number/*f64*/;
  valueBase: number/*f64*/;
  ratio: number/*f64*/;
}

export function marshal_TargetElement(buf: NPRPC.FlatBuffer, offset: number, data: TargetElement): void {
buf.dv.setFloat64(offset + 0, data.value, true);
buf.dv.setFloat64(offset + 8, data.valueBase, true);
buf.dv.setFloat64(offset + 16, data.ratio, true);
}

export function unmarshal_TargetElement(buf: NPRPC.FlatBuffer, offset: number): TargetElement {
const result = {} as TargetElement;
result.value = buf.dv.getFloat64(offset + 0, true);
result.valueBase = buf.dv.getFloat64(offset + 8, true);
result.ratio = buf.dv.getFloat64(offset + 16, true);
return result;
}

export interface Calculation {
  id: number/*u32*/;
  name: string;
  elements: string;
  fertilizersIds: string;
  volume: number/*f64*/;
  mode: boolean/*boolean*/;
}

export function marshal_Calculation(buf: NPRPC.FlatBuffer, offset: number, data: Calculation): void {
buf.dv.setUint32(offset + 0, data.id, true);
NPRPC.marshal_string(buf, offset + 4, data.name);
NPRPC.marshal_string(buf, offset + 12, data.elements);
NPRPC.marshal_string(buf, offset + 20, data.fertilizersIds);
buf.dv.setFloat64(offset + 32, data.volume, true);
buf.dv.setUint8(offset + 40, data.mode ? 1 : 0);
}

export function unmarshal_Calculation(buf: NPRPC.FlatBuffer, offset: number): Calculation {
const result = {} as Calculation;
result.id = buf.dv.getUint32(offset + 0, true);
result.name = NPRPC.unmarshal_string(buf, offset + 4);
result.elements = NPRPC.unmarshal_string(buf, offset + 12);
result.fertilizersIds = NPRPC.unmarshal_string(buf, offset + 20);
result.volume = buf.dv.getFloat64(offset + 32, true);
result.mode = buf.dv.getUint8(offset + 40) !== 0;
return result;
}

export interface Media {
  name: string;
  data: Uint8Array;
}

export function marshal_Media(buf: NPRPC.FlatBuffer, offset: number, data: Media): void {
NPRPC.marshal_string(buf, offset + 0, data.name);
NPRPC.marshal_typed_array(buf, offset + 8, data.data, 1, 1);
}

export function unmarshal_Media(buf: NPRPC.FlatBuffer, offset: number): Media {
const result = {} as Media;
result.name = NPRPC.unmarshal_string(buf, offset + 0);
result.data = NPRPC.unmarshal_typed_array(buf, offset + 8, Uint8Array) as Uint8Array;
return result;
}

export enum AuthorizationFailed_Reason { //u8
  email_does_not_exist,
  incorrect_password,
  session_does_not_exist
}

export interface AuthorizationFailed_Data {
  __ex_id: number/*u32*/;
  reason: AuthorizationFailed_Reason;
}

export class AuthorizationFailed extends NPRPC.Exception {
  constructor(  public reason: AuthorizationFailed_Reason) { super("AuthorizationFailed"); }
}

export function marshal_AuthorizationFailed(buf: NPRPC.FlatBuffer, offset: number, data: AuthorizationFailed_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
buf.dv.setUint8(offset + 4, data.reason);
}
export function unmarshal_AuthorizationFailed(buf: NPRPC.FlatBuffer, offset: number): AuthorizationFailed {
const result = {} as AuthorizationFailed;
result.reason = buf.dv.getUint8(offset + 0);
return result;
}

export enum RegistrationFailed_Reason { //u8
  username_already_exist,
  email_already_registered,
  incorrect_code,
  invalid_username
}

export interface RegistrationFailed_Data {
  __ex_id: number/*u32*/;
  reason: RegistrationFailed_Reason;
}

export class RegistrationFailed extends NPRPC.Exception {
  constructor(  public reason: RegistrationFailed_Reason) { super("RegistrationFailed"); }
}

export function marshal_RegistrationFailed(buf: NPRPC.FlatBuffer, offset: number, data: RegistrationFailed_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
buf.dv.setUint8(offset + 4, data.reason);
}
export function unmarshal_RegistrationFailed(buf: NPRPC.FlatBuffer, offset: number): RegistrationFailed {
const result = {} as RegistrationFailed;
result.reason = buf.dv.getUint8(offset + 0);
return result;
}

export interface PermissionViolation_Data {
  __ex_id: number/*u32*/;
  msg: string;
}

export class PermissionViolation extends NPRPC.Exception {
  constructor(  public msg: string) { super("PermissionViolation"); }
}

export function marshal_PermissionViolation(buf: NPRPC.FlatBuffer, offset: number, data: PermissionViolation_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
NPRPC.marshal_string(buf, offset + 4, data.msg);
}
export function unmarshal_PermissionViolation(buf: NPRPC.FlatBuffer, offset: number): PermissionViolation {
const result = {} as PermissionViolation;
result.msg = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export interface InvalidArgument_Data {
  __ex_id: number/*u32*/;
  msg: string;
}

export class InvalidArgument extends NPRPC.Exception {
  constructor(  public msg: string) { super("InvalidArgument"); }
}

export function marshal_InvalidArgument(buf: NPRPC.FlatBuffer, offset: number, data: InvalidArgument_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
NPRPC.marshal_string(buf, offset + 4, data.msg);
}
export function unmarshal_InvalidArgument(buf: NPRPC.FlatBuffer, offset: number): InvalidArgument {
const result = {} as InvalidArgument;
result.msg = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export interface UserData {
  name: string;
  isAdmin: boolean/*boolean*/;
  sessionId: string;
  db: NPRPC.ObjectProxy;
}

export function marshal_UserData(buf: NPRPC.FlatBuffer, offset: number, data: UserData): void {
NPRPC.marshal_string(buf, offset + 0, data.name);
buf.dv.setUint8(offset + 8, data.isAdmin ? 1 : 0);
NPRPC.marshal_string(buf, offset + 12, data.sessionId);
NPRPC.detail.marshal_ObjectId(buf, offset + 24, data.db.data);
}

export function unmarshal_UserData(buf: NPRPC.FlatBuffer, offset: number, remote_endpoint: NPRPC.EndPoint): UserData {
const result = {} as UserData;
result.name = NPRPC.unmarshal_string(buf, offset + 0);
result.isAdmin = buf.dv.getUint8(offset + 8) !== 0;
result.sessionId = NPRPC.unmarshal_string(buf, offset + 12);
result.db = NPRPC.create_object_from_oid(NPRPC.detail.unmarshal_ObjectId(buf, offset + 24), remote_endpoint);
return result;
}

export interface SolutionElement {
  index: number/*u32*/;
  value: number/*f64*/;
}

export function marshal_SolutionElement(buf: NPRPC.FlatBuffer, offset: number, data: SolutionElement): void {
buf.dv.setUint32(offset + 0, data.index, true);
buf.dv.setFloat64(offset + 8, data.value, true);
}

export function unmarshal_SolutionElement(buf: NPRPC.FlatBuffer, offset: number): SolutionElement {
const result = {} as SolutionElement;
result.index = buf.dv.getUint32(offset + 0, true);
result.value = buf.dv.getFloat64(offset + 8, true);
return result;
}

export enum AlarmType { //u32
  Info,
  Warning,
  Critical
}

export interface Alarm {
  id: number/*u32*/;
  type: AlarmType;
  msg: string;
}

export function marshal_Alarm(buf: NPRPC.FlatBuffer, offset: number, data: Alarm): void {
buf.dv.setUint32(offset + 0, data.id, true);
buf.dv.setUint32(offset + 4, data.type, true);
NPRPC.marshal_string(buf, offset + 8, data.msg);
}

export function unmarshal_Alarm(buf: NPRPC.FlatBuffer, offset: number): Alarm {
const result = {} as Alarm;
result.id = buf.dv.getUint32(offset + 0, true);
result.type = buf.dv.getUint32(offset + 4, true);
result.msg = NPRPC.unmarshal_string(buf, offset + 8);
return result;
}

export enum ChatAttachmentType { //u32
  Picture,
  File
}

export interface ChatAttachment {
  type: ChatAttachmentType;
  name: string;
  data: Uint8Array;
}

export function marshal_ChatAttachment(buf: NPRPC.FlatBuffer, offset: number, data: ChatAttachment): void {
buf.dv.setUint32(offset + 0, data.type, true);
NPRPC.marshal_string(buf, offset + 4, data.name);
NPRPC.marshal_typed_array(buf, offset + 12, data.data, 1, 1);
}

export function unmarshal_ChatAttachment(buf: NPRPC.FlatBuffer, offset: number): ChatAttachment {
const result = {} as ChatAttachment;
result.type = buf.dv.getUint32(offset + 0, true);
result.name = NPRPC.unmarshal_string(buf, offset + 4);
result.data = NPRPC.unmarshal_typed_array(buf, offset + 12, Uint8Array) as Uint8Array;
return result;
}

export interface ChatMessage {
  timestamp: number/*u32*/;
  str: string;
  attachment?: ChatAttachment;
}

export function marshal_ChatMessage(buf: NPRPC.FlatBuffer, offset: number, data: ChatMessage): void {
buf.dv.setUint32(offset + 0, data.timestamp, true);
NPRPC.marshal_string(buf, offset + 4, data.str);
if (data.attachment !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 12, data.attachment, marshal_ChatAttachment, 20, 4);
} else {
  buf.dv.setUint32(offset + 12, 0, true); // nullopt
}
}

export function unmarshal_ChatMessage(buf: NPRPC.FlatBuffer, offset: number): ChatMessage {
const result = {} as ChatMessage;
result.timestamp = buf.dv.getUint32(offset + 0, true);
result.str = NPRPC.unmarshal_string(buf, offset + 4);
if (buf.dv.getUint32(offset + 12, true) !== 0) {
  result.attachment = NPRPC.unmarshal_optional_struct(buf, offset + 12, unmarshal_ChatAttachment, 4);
} else {
  result.attachment = undefined;
}
return result;
}

export interface Vector3 {
  x: number/*f32*/;
  y: number/*f32*/;
  z: number/*f32*/;
}

export function marshal_Vector3(buf: NPRPC.FlatBuffer, offset: number, data: Vector3): void {
buf.dv.setFloat32(offset + 0, data.x, true);
buf.dv.setFloat32(offset + 4, data.y, true);
buf.dv.setFloat32(offset + 8, data.z, true);
}

export function unmarshal_Vector3(buf: NPRPC.FlatBuffer, offset: number): Vector3 {
const result = {} as Vector3;
result.x = buf.dv.getFloat32(offset + 0, true);
result.y = buf.dv.getFloat32(offset + 4, true);
result.z = buf.dv.getFloat32(offset + 8, true);
return result;
}

export interface Vector2 {
  x: number/*f32*/;
  y: number/*f32*/;
}

export function marshal_Vector2(buf: NPRPC.FlatBuffer, offset: number, data: Vector2): void {
buf.dv.setFloat32(offset + 0, data.x, true);
buf.dv.setFloat32(offset + 4, data.y, true);
}

export function unmarshal_Vector2(buf: NPRPC.FlatBuffer, offset: number): Vector2 {
const result = {} as Vector2;
result.x = buf.dv.getFloat32(offset + 0, true);
result.y = buf.dv.getFloat32(offset + 4, true);
return result;
}

export interface Footstep {
  color: Vector3;
  idx: number/*u32*/;
  pos: Vector2;
  dir: Vector2;
}

export function marshal_Footstep(buf: NPRPC.FlatBuffer, offset: number, data: Footstep): void {
marshal_Vector3(buf, offset + 0, data.color);
buf.dv.setUint32(offset + 12, data.idx, true);
marshal_Vector2(buf, offset + 16, data.pos);
marshal_Vector2(buf, offset + 24, data.dir);
}

export function unmarshal_Footstep(buf: NPRPC.FlatBuffer, offset: number): Footstep {
const result = {} as Footstep;
result.color = unmarshal_Vector3(buf, offset + 0);
result.idx = buf.dv.getUint32(offset + 12, true);
result.pos = unmarshal_Vector2(buf, offset + 16);
result.dir = unmarshal_Vector2(buf, offset + 24);
return result;
}

export interface RealtimeClientEvent {
  footstep?: Footstep;
}

export function marshal_RealtimeClientEvent(buf: NPRPC.FlatBuffer, offset: number, data: RealtimeClientEvent): void {
if (data.footstep !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 0, data.footstep, marshal_Footstep, 32, 4);
} else {
  buf.dv.setUint32(offset + 0, 0, true); // nullopt
}
}

export function unmarshal_RealtimeClientEvent(buf: NPRPC.FlatBuffer, offset: number): RealtimeClientEvent {
const result = {} as RealtimeClientEvent;
if (buf.dv.getUint32(offset + 0, true) !== 0) {
  result.footstep = NPRPC.unmarshal_optional_struct(buf, offset + 0, unmarshal_Footstep, 4);
} else {
  result.footstep = undefined;
}
return result;
}

export interface RealtimeServerEvent {
  data_changed_idx?: number/*u32*/;
  alarm?: Alarm;
  footstep?: Footstep;
}

export function marshal_RealtimeServerEvent(buf: NPRPC.FlatBuffer, offset: number, data: RealtimeServerEvent): void {
if (data.data_changed_idx !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 0, data.data_changed_idx, 'u32');
} else {
  buf.dv.setUint32(offset + 0, 0, true); // nullopt
}
if (data.alarm !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 4, data.alarm, marshal_Alarm, 16, 4);
} else {
  buf.dv.setUint32(offset + 4, 0, true); // nullopt
}
if (data.footstep !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 8, data.footstep, marshal_Footstep, 32, 4);
} else {
  buf.dv.setUint32(offset + 8, 0, true); // nullopt
}
}

export function unmarshal_RealtimeServerEvent(buf: NPRPC.FlatBuffer, offset: number): RealtimeServerEvent {
const result = {} as RealtimeServerEvent;
if (buf.dv.getUint32(offset + 0, true) !== 0) {
  result.data_changed_idx = NPRPC.unmarshal_optional_fundamental(buf, offset + 0, 'u32');
} else {
  result.data_changed_idx = undefined;
}
if (buf.dv.getUint32(offset + 4, true) !== 0) {
  result.alarm = NPRPC.unmarshal_optional_struct(buf, offset + 4, unmarshal_Alarm, 4);
} else {
  result.alarm = undefined;
}
if (buf.dv.getUint32(offset + 8, true) !== 0) {
  result.footstep = NPRPC.unmarshal_optional_struct(buf, offset + 8, unmarshal_Footstep, 4);
} else {
  result.footstep = undefined;
}
return result;
}

export class Authorizator extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IAuthorizator_Servant {
    return _IAuthorizator_Servant;
  }


  public async LogIn(login: /*in*/string, password: /*in*/string): Promise<UserData> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(176);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 0);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M1(buf, 32, {_1: login, _2: password});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'LogIn',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{login:login,password:password},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M2(buf, 16, this.endpoint);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async LogInWithSessionId(session_id: /*in*/string): Promise<UserData> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(168);
    buf.commit(40);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 1);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M3(buf, 32, {_1: session_id});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'LogInWithSessionId',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{session_id:session_id},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M2(buf, 16, this.endpoint);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async LogOut(session_id: /*in*/string): Promise<boolean/*boolean*/> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(168);
    buf.commit(40);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 2);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M3(buf, 32, {_1: session_id});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:2,method_name:'LogOut',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{session_id:session_id},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M4(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async CheckUsername(username: /*in*/string): Promise<boolean/*boolean*/> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(168);
    buf.commit(40);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 3);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M3(buf, 32, {_1: username});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:3,method_name:'CheckUsername',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{username:username},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M4(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async CheckEmail(email: /*in*/string): Promise<boolean/*boolean*/> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(168);
    buf.commit(40);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 4);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M3(buf, 32, {_1: email});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:4,method_name:'CheckEmail',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{email:email},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M4(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async RegisterStepOne(username: /*in*/string, email: /*in*/string, password: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 3 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(184);
    buf.commit(56);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 5);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M5(buf, 32, {_1: username, _2: email, _3: password});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:5,method_name:'RegisterStepOne',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{username:username,email:email,password:password},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async RegisterStepTwo(username: /*in*/string, code: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 6);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M6(buf, 32, {_1: username, _2: code});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:6,method_name:'RegisterStepTwo',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{username:username,code:code},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }

  // HTTP Transport (alternative to WebSocket)
  public readonly http = {
    LogIn: async (login: /*in*/string, password: /*in*/string): Promise<UserData> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(176);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 0);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M1(buf, 32, {_1: login, _2: password});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:0,method_name:'LogIn',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{login:login,password:password},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M2(buf, 16, this.endpoint);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    LogInWithSessionId: async (session_id: /*in*/string): Promise<UserData> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(168);
      buf.commit(40);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 1);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M3(buf, 32, {_1: session_id});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:1,method_name:'LogInWithSessionId',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{session_id:session_id},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M2(buf, 16, this.endpoint);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    LogOut: async (session_id: /*in*/string): Promise<boolean/*boolean*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(168);
      buf.commit(40);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 2);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M3(buf, 32, {_1: session_id});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:2,method_name:'LogOut',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{session_id:session_id},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M4(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    CheckUsername: async (username: /*in*/string): Promise<boolean/*boolean*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(168);
      buf.commit(40);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 3);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M3(buf, 32, {_1: username});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:3,method_name:'CheckUsername',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{username:username},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M4(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    CheckEmail: async (email: /*in*/string): Promise<boolean/*boolean*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(168);
      buf.commit(40);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 4);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M3(buf, 32, {_1: email});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:4,method_name:'CheckEmail',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{email:email},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M4(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    RegisterStepOne: async (username: /*in*/string, email: /*in*/string, password: /*in*/string): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(184);
      buf.commit(56);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 5);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M5(buf, 32, {_1: username, _2: email, _3: password});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:5,method_name:'RegisterStepOne',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{username:username,email:email,password:password},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    RegisterStepTwo: async (username: /*in*/string, code: /*in*/number): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(172);
      buf.commit(44);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 6);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M6(buf, 32, {_1: username, _2: code});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IAuthorizator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:6,method_name:'RegisterStepTwo',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{username:username,code:code},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    }
  };
}
export interface IAuthorizator_Servant
{
  LogIn(login: /*in*/string, password: /*in*/string): UserData;
  LogInWithSessionId(session_id: /*in*/string): UserData;
  LogOut(session_id: /*in*/string): boolean/*boolean*/;
  CheckUsername(username: /*in*/string): boolean/*boolean*/;
  CheckEmail(email: /*in*/string): boolean/*boolean*/;
  RegisterStepOne(username: /*in*/string, email: /*in*/string, password: /*in*/string): void;
  RegisterStepTwo(username: /*in*/string, code: /*in*/number): void;
}
export class _IAuthorizator_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "nscalc/nscalc.Authorizator"; }
  public readonly get_class = () => { return _IAuthorizator_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IAuthorizator_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IAuthorizator_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IAuthorizator_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    // Read CallHeader directly
    const function_idx = buf.dv.getUint8(16 + 3);
    switch(function_idx) {
      case 0: {
        const ia = unmarshal_nscalc_M1(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(216);
        obuf.commit(88);
        let __ret_val: UserData = {} as UserData;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IAuthorizator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:0,method_name:'LogIn',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).LogIn(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof AuthorizationFailed) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(24);
            obuf.commit(24);
            const ex_data = {__ex_id: 0, reason: e.reason};
            marshal_AuthorizationFailed(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const out_data = {_1: __ret_val};
        marshal_nscalc_M2(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 1: {
        const ia = unmarshal_nscalc_M3(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(216);
        obuf.commit(88);
        let __ret_val: UserData = {} as UserData;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IAuthorizator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:1,method_name:'LogInWithSessionId',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).LogInWithSessionId(ia._1);
        }
        catch(e) {
          if (e instanceof AuthorizationFailed) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(24);
            obuf.commit(24);
            const ex_data = {__ex_id: 0, reason: e.reason};
            marshal_AuthorizationFailed(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const out_data = {_1: __ret_val};
        marshal_nscalc_M2(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 2: {
        const ia = unmarshal_nscalc_M3(buf, 32);
        let __ret_val: boolean/*boolean*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IAuthorizator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:2,method_name:'LogOut',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).LogOut(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(17);
        obuf.commit(17);
        const out_data = {_1: __ret_val};
        marshal_nscalc_M4(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 3: {
        const ia = unmarshal_nscalc_M3(buf, 32);
        let __ret_val: boolean/*boolean*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IAuthorizator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:3,method_name:'CheckUsername',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).CheckUsername(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(17);
        obuf.commit(17);
        const out_data = {_1: __ret_val};
        marshal_nscalc_M4(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 4: {
        const ia = unmarshal_nscalc_M3(buf, 32);
        let __ret_val: boolean/*boolean*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IAuthorizator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:4,method_name:'CheckEmail',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).CheckEmail(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(17);
        obuf.commit(17);
        const out_data = {_1: __ret_val};
        marshal_nscalc_M4(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 5: {
        const ia = unmarshal_nscalc_M5(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IAuthorizator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:5,method_name:'RegisterStepOne',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).RegisterStepOne(ia._1, ia._2, ia._3);
        }
        catch(e) {
          if (e instanceof RegistrationFailed) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(24);
            obuf.commit(24);
            const ex_data = {__ex_id: 1, reason: e.reason};
            marshal_RegistrationFailed(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 6: {
        const ia = unmarshal_nscalc_M6(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IAuthorizator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:6,method_name:'RegisterStepTwo',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).RegisterStepTwo(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof RegistrationFailed) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(24);
            obuf.commit(24);
            const ex_data = {__ex_id: 1, reason: e.reason};
            marshal_RegistrationFailed(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
  static _dispatch_stream(obj: _IAuthorizator_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
    const function_idx = init.func_idx;
    const conn = NPRPC.rpc.get_connection(remote_endpoint);
    switch(function_idx) {
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
}

export class RegisteredUser extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IRegisteredUser_Servant {
    return _IRegisteredUser_Servant;
  }


  public async GetMyCalculations(calculations: /*out*/NPRPC.ref<Array<Calculation>>): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(32);
    buf.commit(32);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 0);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'GetMyCalculations',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M7(buf, 16);
    calculations.value = out._1;
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async AddSolution(name: /*in*/string, elements: /*in*/Float64Array/*14*/): Promise<number/*u32*/> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(280);
    buf.commit(152);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 1);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M8(buf, 32, {_1: name, _2: elements});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'AddSolution',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{name:name,elements:elements},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M9(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async SetSolutionName(id: /*in*/number, name: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 2);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M10(buf, 32, {_1: id, _2: name});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:2,method_name:'SetSolutionName',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{id:id,name:name},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async SetSolutionElements(id: /*in*/number, name: /*in*/Array<SolutionElement>): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 3);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M11(buf, 32, {_1: id, _2: name});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:3,method_name:'SetSolutionElements',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{id:id,name:name},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async DeleteSolution(id: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 4);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M9(buf, 32, {_1: id});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:4,method_name:'DeleteSolution',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{id:id},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async AddFertilizer(name: /*in*/string, formula: /*in*/string): Promise<number/*u32*/> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(176);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 5);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M1(buf, 32, {_1: name, _2: formula});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:5,method_name:'AddFertilizer',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{name:name,formula:formula},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M9(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async SetFertilizerName(id: /*in*/number, name: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 6);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M10(buf, 32, {_1: id, _2: name});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:6,method_name:'SetFertilizerName',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{id:id,name:name},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async SetFertilizerFormula(id: /*in*/number, name: /*in*/string): Promise<void> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(172);
    buf.commit(44);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 7);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M10(buf, 32, {_1: id, _2: name});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:7,method_name:'SetFertilizerFormula',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{id:id,name:name},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async DeleteFertilizer(id: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 8);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M9(buf, 32, {_1: id});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:8,method_name:'DeleteFertilizer',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{id:id},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      nscalc_throw_exception(buf);
    }
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async UpdateCalculation(calculation: /*in*/Calculation): Promise<number/*u32*/> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(208);
    buf.commit(80);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 9);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M12(buf, 32, {_1: calculation});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:9,method_name:'UpdateCalculation',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{calculation:calculation},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_nscalc_M9(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async DeleteCalculation(id: /*in*/number): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 10);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M9(buf, 32, {_1: id});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:10,method_name:'DeleteCalculation',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{id:id},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }

  // HTTP Transport (alternative to WebSocket)
  public readonly http = {
    GetMyCalculations: async (): Promise<Array<Calculation>> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(32);
      buf.commit(32);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 0);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:0,method_name:'GetMyCalculations',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M7(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    AddSolution: async (name: /*in*/string, elements: /*in*/Float64Array/*14*/): Promise<number/*u32*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(280);
      buf.commit(152);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 1);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M8(buf, 32, {_1: name, _2: elements});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:1,method_name:'AddSolution',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{name:name,elements:elements},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M9(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    SetSolutionName: async (id: /*in*/number, name: /*in*/string): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(172);
      buf.commit(44);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 2);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M10(buf, 32, {_1: id, _2: name});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:2,method_name:'SetSolutionName',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{id:id,name:name},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    SetSolutionElements: async (id: /*in*/number, name: /*in*/Array<SolutionElement>): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(172);
      buf.commit(44);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 3);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M11(buf, 32, {_1: id, _2: name});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:3,method_name:'SetSolutionElements',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{id:id,name:name},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    DeleteSolution: async (id: /*in*/number): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(36);
      buf.commit(36);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 4);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M9(buf, 32, {_1: id});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:4,method_name:'DeleteSolution',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{id:id},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    AddFertilizer: async (name: /*in*/string, formula: /*in*/string): Promise<number/*u32*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(176);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 5);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M1(buf, 32, {_1: name, _2: formula});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:5,method_name:'AddFertilizer',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{name:name,formula:formula},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M9(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    SetFertilizerName: async (id: /*in*/number, name: /*in*/string): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(172);
      buf.commit(44);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 6);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M10(buf, 32, {_1: id, _2: name});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:6,method_name:'SetFertilizerName',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{id:id,name:name},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    SetFertilizerFormula: async (id: /*in*/number, name: /*in*/string): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(172);
      buf.commit(44);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 7);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M10(buf, 32, {_1: id, _2: name});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:7,method_name:'SetFertilizerFormula',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{id:id,name:name},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    DeleteFertilizer: async (id: /*in*/number): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(36);
      buf.commit(36);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 8);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M9(buf, 32, {_1: id});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:8,method_name:'DeleteFertilizer',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{id:id},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply == 1) nscalc_throw_exception(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    UpdateCalculation: async (calculation: /*in*/Calculation): Promise<number/*u32*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(208);
      buf.commit(80);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 9);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M12(buf, 32, {_1: calculation});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:9,method_name:'UpdateCalculation',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{calculation:calculation},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_nscalc_M9(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    DeleteCalculation: async (id: /*in*/number): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(36);
      buf.commit(36);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 10);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M9(buf, 32, {_1: id});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:10,method_name:'DeleteCalculation',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{id:id},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    }
  };
}
export interface IRegisteredUser_Servant
{
  GetMyCalculations(calculations: /*out*/NPRPC.ref<Array<Calculation>>): void;
  AddSolution(name: /*in*/string, elements: /*in*/Float64Array/*14*/): number/*u32*/;
  SetSolutionName(id: /*in*/number, name: /*in*/string): void;
  SetSolutionElements(id: /*in*/number, name: /*in*/Array<SolutionElement>): void;
  DeleteSolution(id: /*in*/number): void;
  AddFertilizer(name: /*in*/string, formula: /*in*/string): number/*u32*/;
  SetFertilizerName(id: /*in*/number, name: /*in*/string): void;
  SetFertilizerFormula(id: /*in*/number, name: /*in*/string): void;
  DeleteFertilizer(id: /*in*/number): void;
  UpdateCalculation(calculation: /*in*/Calculation): number/*u32*/;
  DeleteCalculation(id: /*in*/number): void;
}
export class _IRegisteredUser_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "nscalc/nscalc.RegisteredUser"; }
  public readonly get_class = () => { return _IRegisteredUser_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IRegisteredUser_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IRegisteredUser_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IRegisteredUser_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    // Read CallHeader directly
    const function_idx = buf.dv.getUint8(16 + 3);
    switch(function_idx) {
      case 0: {
        const _out_1 = NPRPC.make_ref<Array<Calculation>>();
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(152);
        obuf.commit(24);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:0,method_name:'GetMyCalculations',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:{}});
        (obj as any).GetMyCalculations(        _out_1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const out_data = {_1: _out_1.value};
        marshal_nscalc_M7(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 1: {
        const ia = unmarshal_nscalc_M8(buf, 32);
        let __ret_val: number/*u32*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:1,method_name:'AddSolution',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).AddSolution(ia._1, ia._2);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(20);
        obuf.commit(20);
        const out_data = {_1: __ret_val};
        marshal_nscalc_M9(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 2: {
        const ia = unmarshal_nscalc_M10(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:2,method_name:'SetSolutionName',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).SetSolutionName(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof PermissionViolation) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 2, msg: e.msg};
            marshal_PermissionViolation(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 3: {
        const ia = unmarshal_nscalc_M11(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:3,method_name:'SetSolutionElements',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).SetSolutionElements(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof PermissionViolation) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 2, msg: e.msg};
            marshal_PermissionViolation(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 4: {
        const ia = unmarshal_nscalc_M9(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:4,method_name:'DeleteSolution',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).DeleteSolution(ia._1);
        }
        catch(e) {
          if (e instanceof PermissionViolation) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 2, msg: e.msg};
            marshal_PermissionViolation(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 5: {
        const ia = unmarshal_nscalc_M1(buf, 32);
        let __ret_val: number/*u32*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:5,method_name:'AddFertilizer',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).AddFertilizer(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof InvalidArgument) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 3, msg: e.msg};
            marshal_InvalidArgument(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(20);
        obuf.commit(20);
        const out_data = {_1: __ret_val};
        marshal_nscalc_M9(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 6: {
        const ia = unmarshal_nscalc_M10(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:6,method_name:'SetFertilizerName',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).SetFertilizerName(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof PermissionViolation) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 2, msg: e.msg};
            marshal_PermissionViolation(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 7: {
        const ia = unmarshal_nscalc_M10(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:7,method_name:'SetFertilizerFormula',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).SetFertilizerFormula(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof PermissionViolation) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 2, msg: e.msg};
            marshal_PermissionViolation(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          if (e instanceof InvalidArgument) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 3, msg: e.msg};
            marshal_InvalidArgument(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 8: {
        const ia = unmarshal_nscalc_M9(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:8,method_name:'DeleteFertilizer',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          (obj as any).DeleteFertilizer(ia._1);
        }
        catch(e) {
          if (e instanceof PermissionViolation) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 2, msg: e.msg};
            marshal_PermissionViolation(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          throw e;
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 9: {
        const ia = unmarshal_nscalc_M12(buf, 32);
        let __ret_val: number/*u32*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:9,method_name:'UpdateCalculation',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).UpdateCalculation(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(20);
        obuf.commit(20);
        const out_data = {_1: __ret_val};
        marshal_nscalc_M9(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 10: {
        const ia = unmarshal_nscalc_M9(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IRegisteredUser_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:10,method_name:'DeleteCalculation',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        (obj as any).DeleteCalculation(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
  static _dispatch_stream(obj: _IRegisteredUser_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
    const function_idx = init.func_idx;
    const conn = NPRPC.rpc.get_connection(remote_endpoint);
    switch(function_idx) {
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
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(36);
    buf.commit(36);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 0);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M9(buf, 32, {_1: idx});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IDataObserver_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'DataChanged',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{idx:idx},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async OnAlarm(alarm: /*in*/Alarm): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(176);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 1);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M13(buf, 32, {_1: alarm});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IDataObserver_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'OnAlarm',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{alarm:alarm},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }
  public async OnFootstep(footstep: /*in*/Footstep): Promise<void> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(64);
    buf.commit(64);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 2);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_nscalc_M14(buf, 32, {_1: footstep});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IDataObserver_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:2,method_name:'OnFootstep',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{footstep:footstep},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != 0) {
      console.log("received an unusual reply for function with no output arguments");
    }
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
  }

  // HTTP Transport (alternative to WebSocket)
  public readonly http = {
    DataChanged: async (idx: /*in*/number): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(36);
      buf.commit(36);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 0);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M9(buf, 32, {_1: idx});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IDataObserver_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:0,method_name:'DataChanged',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{idx:idx},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    OnAlarm: async (alarm: /*in*/Alarm): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(176);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 1);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M13(buf, 32, {_1: alarm});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IDataObserver_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:1,method_name:'OnAlarm',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{alarm:alarm},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    },
    OnFootstep: async (footstep: /*in*/Footstep): Promise<void> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(64);
      buf.commit(64);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 2);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_nscalc_M14(buf, 32, {_1: footstep});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IDataObserver_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:2,method_name:'OnFootstep',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{footstep:footstep},request_bytes:buf.size});

      const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'include',
        body: buf.array_buffer
      }
);

      if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
      const response_data = await response.arrayBuffer();
      buf.set_buffer(response_data);

      let std_reply = NPRPC.handle_standart_reply(buf);
      if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
    }
  };
}
export interface IDataObserver_Servant
{
  DataChanged(idx: /*in*/number): void;
  OnAlarm(alarm: /*in*/Alarm): void;
  OnFootstep(footstep: /*in*/Footstep): void;
}
export class _IDataObserver_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "nscalc/nscalc.DataObserver"; }
  public readonly get_class = () => { return _IDataObserver_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IDataObserver_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IDataObserver_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IDataObserver_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    // Read CallHeader directly
    const function_idx = buf.dv.getUint8(16 + 3);
    switch(function_idx) {
      case 0: {
        const ia = unmarshal_nscalc_M9(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IDataObserver_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:0,method_name:'DataChanged',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        (obj as any).DataChanged(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 1: {
        const ia = unmarshal_nscalc_M13(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IDataObserver_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:1,method_name:'OnAlarm',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        (obj as any).OnAlarm(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      case 2: {
        const ia = unmarshal_nscalc_M14(buf, 32);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IDataObserver_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:2,method_name:'OnFootstep',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        (obj as any).OnFootstep(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        break;
      }
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
  static _dispatch_stream(obj: _IDataObserver_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
    const function_idx = init.func_idx;
    const conn = NPRPC.rpc.get_connection(remote_endpoint);
    switch(function_idx) {
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
}

export class Realtime extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IRealtime_Servant {
    return _IRealtime_Servant;
  }


  public async Connect(session_id: /*in*/string): Promise<NPRPC.BidiStream<RealtimeClientEvent, RealtimeServerEvent>> {
    const interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const conn = NPRPC.rpc.get_connection(this.endpoint);
    const stream_id = conn.stream_manager.generate_stream_id();
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(184);
    buf.commit(56);
    buf.write_msg_id(NPRPC.impl.MessageId.StreamInitialization);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    NPRPC.impl.marshal_StreamInit(buf, 16, {
      stream_id,
      poa_idx: this.data.poa_idx,
      interface_idx,
      object_id: this.data.object_id,
      func_idx: 0,
      stream_kind: NPRPC.impl.StreamKind.Bidi
    });
    marshal_nscalc_M3(buf, 48, {_1: session_id});
    buf.write_len(buf.size);
    (globalThis as any).__nprpc_debug?.stream_start({direction:'client',class_id:_IRealtime_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'Connect',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},stream_id:String(stream_id),stream_kind:'bidi',request_args:{session_id:session_id},request_bytes:buf.size});
    return await NPRPC.rpc.open_bidi_stream(this.endpoint, buf, stream_id, this.timeout, ((value: RealtimeClientEvent) => { const buf = NPRPC.FlatBuffer.create(132); buf.commit(4); marshal_RealtimeClientEvent(buf, 0, value); return new Uint8Array(buf.array_buffer, 0, buf.size); }), ((data: Uint8Array) => unmarshal_RealtimeServerEvent(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0)));
  }

  // HTTP Transport (alternative to WebSocket)
  public readonly http = {

  };
}
export interface IRealtime_Servant
{
  Connect(session_id: /*in*/string, stream: NPRPC.BidiStream<RealtimeServerEvent, RealtimeClientEvent>): void | Promise<void>;
}
export class _IRealtime_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "nscalc/nscalc.Realtime"; }
  public readonly get_class = () => { return _IRealtime_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IRealtime_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IRealtime_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IRealtime_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    // Read CallHeader directly
    const function_idx = buf.dv.getUint8(16 + 3);
    switch(function_idx) {
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
  static _dispatch_stream(obj: _IRealtime_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
    const function_idx = init.func_idx;
    const conn = NPRPC.rpc.get_connection(remote_endpoint);
    switch(function_idx) {
      case 0: {
        const ia = unmarshal_nscalc_M3(buf, 48);
        (globalThis as any).__nprpc_debug?.stream_start({direction:'server',class_id:_IRealtime_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:init.interface_idx,func_idx:0,method_name:'Connect',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},stream_id:String(init.stream_id),stream_kind:'bidi',request_args:ia,request_bytes:buf.size});
        const stream = conn.stream_manager.create_bidi_stream(init.stream_id, ((value: RealtimeServerEvent) => { const buf = NPRPC.FlatBuffer.create(140); buf.commit(12); marshal_RealtimeServerEvent(buf, 0, value); return new Uint8Array(buf.array_buffer, 0, buf.size); }), ((data: Uint8Array) => unmarshal_RealtimeClientEvent(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0)));
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        void (async () => {
          try {
            await (obj as any).Connect(ia._1, stream);
          } catch (e) {
            stream.writer.abort();
            stream.reader.cancel();
            console.error('Stream handler failed', e);
          }
          })();
          return;
        }
        default:
          NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
      }
    }
  }

  export class Chat extends NPRPC.ObjectProxy {
    public static get servant_t(): new() => _IChat_Servant {
      return _IChat_Servant;
    }


    public async Connect(session_id: /*in*/string): Promise<NPRPC.BidiStream<ChatMessage, ChatMessage>> {
      const interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
      const conn = NPRPC.rpc.get_connection(this.endpoint);
      const stream_id = conn.stream_manager.generate_stream_id();
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(184);
      buf.commit(56);
      buf.write_msg_id(NPRPC.impl.MessageId.StreamInitialization);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      NPRPC.impl.marshal_StreamInit(buf, 16, {
        stream_id,
        poa_idx: this.data.poa_idx,
        interface_idx,
        object_id: this.data.object_id,
        func_idx: 0,
        stream_kind: NPRPC.impl.StreamKind.Bidi
      });
      marshal_nscalc_M3(buf, 48, {_1: session_id});
      buf.write_len(buf.size);
      (globalThis as any).__nprpc_debug?.stream_start({direction:'client',class_id:_IChat_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'Connect',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},stream_id:String(stream_id),stream_kind:'bidi',request_args:{session_id:session_id},request_bytes:buf.size});
      return await NPRPC.rpc.open_bidi_stream(this.endpoint, buf, stream_id, this.timeout, ((value: ChatMessage) => { const buf = NPRPC.FlatBuffer.create(144); buf.commit(16); marshal_ChatMessage(buf, 0, value); return new Uint8Array(buf.array_buffer, 0, buf.size); }), ((data: Uint8Array) => unmarshal_ChatMessage(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0)));
    }

    // HTTP Transport (alternative to WebSocket)
    public readonly http = {

    };
  }
  export interface IChat_Servant
  {
    Connect(session_id: /*in*/string, stream: NPRPC.BidiStream<ChatMessage, ChatMessage>): void | Promise<void>;
  }
  export class _IChat_Servant extends NPRPC.ObjectServant {
    public static _get_class(): string { return "nscalc/nscalc.Chat"; }
    public readonly get_class = () => { return _IChat_Servant._get_class(); }
    public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
      _IChat_Servant._dispatch(this, buf, remote_endpoint, from_parent);
    }
    public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
      _IChat_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
    }
    static _dispatch(obj: _IChat_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
      // Read CallHeader directly
      const function_idx = buf.dv.getUint8(16 + 3);
      switch(function_idx) {
        default:
          NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
      }
    }
    static _dispatch_stream(obj: _IChat_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
      const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
      const function_idx = init.func_idx;
      const conn = NPRPC.rpc.get_connection(remote_endpoint);
      switch(function_idx) {
        case 0: {
          const ia = unmarshal_nscalc_M3(buf, 48);
          (globalThis as any).__nprpc_debug?.stream_start({direction:'server',class_id:_IChat_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:init.interface_idx,func_idx:0,method_name:'Connect',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},stream_id:String(init.stream_id),stream_kind:'bidi',request_args:ia,request_bytes:buf.size});
          const stream = conn.stream_manager.create_bidi_stream(init.stream_id, ((value: ChatMessage) => { const buf = NPRPC.FlatBuffer.create(144); buf.commit(16); marshal_ChatMessage(buf, 0, value); return new Uint8Array(buf.array_buffer, 0, buf.size); }), ((data: Uint8Array) => unmarshal_ChatMessage(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0)));
          NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
          void (async () => {
            try {
              await (obj as any).Connect(ia._1, stream);
            } catch (e) {
              stream.writer.abort();
              stream.reader.cancel();
              console.error('Stream handler failed', e);
            }
            })();
            return;
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


      public async GetData(solutions: /*out*/NPRPC.ref<Array<Solution>>, fertilizers: /*out*/NPRPC.ref<Array<Fertilizer>>): Promise<void> {
        let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(32);
        buf.commit(32);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 0);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'GetData',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_nscalc_M15(buf, 16);
        solutions.value = out._1;
        fertilizers.value = out._2;
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
      }
      public async GetCalculatorBootstrap(solution_limit: /*in*/number, fertilizer_limit: /*in*/number): Promise<CalculatorBootstrap> {
        let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(40);
        buf.commit(40);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 1);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        marshal_nscalc_M16(buf, 32, {_1: solution_limit, _2: fertilizer_limit});
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'GetCalculatorBootstrap',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{solution_limit:solution_limit,fertilizer_limit:fertilizer_limit},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_nscalc_M17(buf, 16);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
        return out._1;
      }
      public async ListSolutionsPage(query: /*in*/string, author: /*in*/string, cursor: /*in*/string, limit: /*in*/number): Promise<SolutionCursorPage> {
        let interface_idx = (arguments.length == 4 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(188);
        buf.commit(60);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 2);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        marshal_nscalc_M18(buf, 32, {_1: query, _2: author, _3: cursor, _4: limit});
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:2,method_name:'ListSolutionsPage',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{query:query,author:author,cursor:cursor,limit:limit},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_nscalc_M19(buf, 16);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
        return out._1;
      }
      public async ListFertilizersPage(query: /*in*/string, cursor: /*in*/string, limit: /*in*/number): Promise<FertilizerCursorPage> {
        let interface_idx = (arguments.length == 3 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(180);
        buf.commit(52);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 3);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        marshal_nscalc_M20(buf, 32, {_1: query, _2: cursor, _3: limit});
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:3,method_name:'ListFertilizersPage',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{query:query,cursor:cursor,limit:limit},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_nscalc_M21(buf, 16);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
        return out._1;
      }
      public async Subscribe(obj: /*in*/NPRPC.ObjectId): Promise<void> {
        let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(208);
        buf.commit(80);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 4);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        marshal_nscalc_M22(buf, 32, {_1: obj});
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:4,method_name:'Subscribe',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{obj:obj},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != 0) {
          console.log("received an unusual reply for function with no output arguments");
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
      }
      public async GetGuestCalculations(calculations: /*out*/NPRPC.ref<Array<Calculation>>): Promise<void> {
        let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(32);
        buf.commit(32);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 5);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:5,method_name:'GetGuestCalculations',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_nscalc_M7(buf, 16);
        calculations.value = out._1;
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
      }
      public async SendFootstep(footstep: /*in*/Footstep): Promise<void> {
        let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(64);
        buf.commit(64);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 6);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        marshal_nscalc_M14(buf, 32, {_1: footstep});
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:6,method_name:'SendFootstep',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{footstep:footstep},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != 0) {
          console.log("received an unusual reply for function with no output arguments");
        }
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
      }

      // HTTP Transport (alternative to WebSocket)
      public readonly http = {
        GetData: async (): Promise<{ solutions: Array<Solution>, fertilizers: Array<Fertilizer> }> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(32);
          buf.commit(32);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 0);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:0,method_name:'GetData',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_nscalc_M15(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return { solutions: out._1,  fertilizers: out._2 };
        },
        GetCalculatorBootstrap: async (solution_limit: /*in*/number, fertilizer_limit: /*in*/number): Promise<CalculatorBootstrap> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(40);
          buf.commit(40);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 1);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          marshal_nscalc_M16(buf, 32, {_1: solution_limit, _2: fertilizer_limit});
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:1,method_name:'GetCalculatorBootstrap',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{solution_limit:solution_limit,fertilizer_limit:fertilizer_limit},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_nscalc_M17(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return out._1;
        },
        ListSolutionsPage: async (query: /*in*/string, author: /*in*/string, cursor: /*in*/string, limit: /*in*/number): Promise<SolutionCursorPage> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(188);
          buf.commit(60);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 2);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          marshal_nscalc_M18(buf, 32, {_1: query, _2: author, _3: cursor, _4: limit});
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:2,method_name:'ListSolutionsPage',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{query:query,author:author,cursor:cursor,limit:limit},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_nscalc_M19(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return out._1;
        },
        ListFertilizersPage: async (query: /*in*/string, cursor: /*in*/string, limit: /*in*/number): Promise<FertilizerCursorPage> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(180);
          buf.commit(52);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 3);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          marshal_nscalc_M20(buf, 32, {_1: query, _2: cursor, _3: limit});
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:3,method_name:'ListFertilizersPage',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{query:query,cursor:cursor,limit:limit},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_nscalc_M21(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return out._1;
        },
        Subscribe: async (obj: /*in*/NPRPC.ObjectId): Promise<void> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(208);
          buf.commit(80);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 4);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          marshal_nscalc_M22(buf, 32, {_1: obj});
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:4,method_name:'Subscribe',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{obj:obj},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
        },
        GetGuestCalculations: async (): Promise<Array<Calculation>> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(32);
          buf.commit(32);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 5);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:5,method_name:'GetGuestCalculations',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_nscalc_M7(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return out._1;
        },
        SendFootstep: async (footstep: /*in*/Footstep): Promise<void> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(64);
          buf.commit(64);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 6);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          marshal_nscalc_M14(buf, 32, {_1: footstep});
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ICalculator_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:6,method_name:'SendFootstep',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{footstep:footstep},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != 0) throw new NPRPC.Exception("Unexpected reply");
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size});
        }
      };
    }
    export interface ICalculator_Servant
    {
      GetData(solutions: /*out*/NPRPC.ref<Array<Solution>>, fertilizers: /*out*/NPRPC.ref<Array<Fertilizer>>): void;
      GetCalculatorBootstrap(solution_limit: /*in*/number, fertilizer_limit: /*in*/number): CalculatorBootstrap;
      ListSolutionsPage(query: /*in*/string, author: /*in*/string, cursor: /*in*/string, limit: /*in*/number): SolutionCursorPage;
      ListFertilizersPage(query: /*in*/string, cursor: /*in*/string, limit: /*in*/number): FertilizerCursorPage;
      Subscribe(obj: /*in*/NPRPC.ObjectProxy): void;
      GetGuestCalculations(calculations: /*out*/NPRPC.ref<Array<Calculation>>): void;
      SendFootstep(footstep: /*in*/Footstep): void;
    }
    export class _ICalculator_Servant extends NPRPC.ObjectServant {
      public static _get_class(): string { return "nscalc/nscalc.Calculator"; }
      public readonly get_class = () => { return _ICalculator_Servant._get_class(); }
      public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
        _ICalculator_Servant._dispatch(this, buf, remote_endpoint, from_parent);
      }
      public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
        _ICalculator_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
      }
      static _dispatch(obj: _ICalculator_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
        // Read CallHeader directly
        const function_idx = buf.dv.getUint8(16 + 3);
        switch(function_idx) {
          case 0: {
            const _out_1 = NPRPC.make_ref<Array<Solution>>();
            const _out_2 = NPRPC.make_ref<Array<Fertilizer>>();
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(160);
            obuf.commit(32);
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ICalculator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:0,method_name:'GetData',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:{}});
            (obj as any).GetData(            _out_1,             _out_2);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            const out_data = {_1: _out_1.value, _2: _out_2.value};
            marshal_nscalc_M15(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          case 1: {
            const ia = unmarshal_nscalc_M16(buf, 32);
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(160);
            obuf.commit(32);
            let __ret_val: CalculatorBootstrap = {} as CalculatorBootstrap;
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ICalculator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:1,method_name:'GetCalculatorBootstrap',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
            __ret_val = (obj as any).GetCalculatorBootstrap(ia._1, ia._2);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            const out_data = {_1: __ret_val};
            marshal_nscalc_M17(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          case 2: {
            const ia = unmarshal_nscalc_M18(buf, 32);
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(156);
            obuf.commit(28);
            let __ret_val: SolutionCursorPage = {} as SolutionCursorPage;
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ICalculator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:2,method_name:'ListSolutionsPage',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
            __ret_val = (obj as any).ListSolutionsPage(ia._1, ia._2, ia._3, ia._4);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            const out_data = {_1: __ret_val};
            marshal_nscalc_M19(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          case 3: {
            const ia = unmarshal_nscalc_M20(buf, 32);
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(156);
            obuf.commit(28);
            let __ret_val: FertilizerCursorPage = {} as FertilizerCursorPage;
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ICalculator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:3,method_name:'ListFertilizersPage',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
            __ret_val = (obj as any).ListFertilizersPage(ia._1, ia._2, ia._3);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            const out_data = {_1: __ret_val};
            marshal_nscalc_M21(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          case 4: {
            const ia = unmarshal_nscalc_M22(buf, 32);
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ICalculator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:4,method_name:'Subscribe',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
            (obj as any).Subscribe(NPRPC.create_object_from_oid(ia._1, remote_endpoint));
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
            break;
          }
          case 5: {
            const _out_1 = NPRPC.make_ref<Array<Calculation>>();
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(152);
            obuf.commit(24);
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ICalculator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:5,method_name:'GetGuestCalculations',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:{}});
            (obj as any).GetGuestCalculations(            _out_1);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            const out_data = {_1: _out_1.value};
            marshal_nscalc_M7(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          case 6: {
            const ia = unmarshal_nscalc_M14(buf, 32);
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ICalculator_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:6,method_name:'SendFootstep',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
            (obj as any).SendFootstep(ia._1);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
            break;
          }
          default:
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
        }
      }
      static _dispatch_stream(obj: _ICalculator_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
        const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
        const function_idx = init.func_idx;
        const conn = NPRPC.rpc.get_connection(remote_endpoint);
        switch(function_idx) {
          default:
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
        }
      }
    }

    export class SiteEventService extends NPRPC.ObjectProxy {
      public static get servant_t(): new() => _ISiteEventService_Servant {
        return _ISiteEventService_Servant;
      }


      public async GetSiteEventConfig(): Promise<string> {
        let interface_idx = (arguments.length == 0 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(32);
        buf.commit(32);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 0);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ISiteEventService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'GetSiteEventConfig',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_nscalc_M3(buf, 16);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
        return out._1;
      }
      public async SetSiteEventConfig(session_id: /*in*/string, config_json: /*in*/string): Promise<string> {
        let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(176);
        buf.commit(48);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 1);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        marshal_nscalc_M1(buf, 32, {_1: session_id, _2: config_json});
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ISiteEventService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'SetSiteEventConfig',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{session_id:session_id,config_json:config_json},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply == 1)        {
          nscalc_throw_exception(buf);
        }
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_nscalc_M3(buf, 16);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
        return out._1;
      }

      // HTTP Transport (alternative to WebSocket)
      public readonly http = {
        GetSiteEventConfig: async (): Promise<string> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(32);
          buf.commit(32);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 0);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ISiteEventService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:0,method_name:'GetSiteEventConfig',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_nscalc_M3(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return out._1;
        },
        SetSiteEventConfig: async (session_id: /*in*/string, config_json: /*in*/string): Promise<string> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(176);
          buf.commit(48);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 1);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          marshal_nscalc_M1(buf, 32, {_1: session_id, _2: config_json});
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_ISiteEventService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:1,method_name:'SetSiteEventConfig',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{session_id:session_id,config_json:config_json},request_bytes:buf.size});

          const url = `http${this.endpoint.is_ssl() ? 's' : ''}://${this.endpoint.hostname}:${this.endpoint.port}/rpc`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            credentials: 'include',
            body: buf.array_buffer
          }
);

          if (!response.ok) throw new NPRPC.Exception(`HTTP error: ${response.status}`);
          const response_data = await response.arrayBuffer();
          buf.set_buffer(response_data);

          let std_reply = NPRPC.handle_standart_reply(buf);
          if (std_reply == 1) nscalc_throw_exception(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_nscalc_M3(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return out._1;
        }
      };
    }
    export interface ISiteEventService_Servant
    {
      GetSiteEventConfig(): string;
      SetSiteEventConfig(session_id: /*in*/string, config_json: /*in*/string): string;
    }
    export class _ISiteEventService_Servant extends NPRPC.ObjectServant {
      public static _get_class(): string { return "nscalc/nscalc.SiteEventService"; }
      public readonly get_class = () => { return _ISiteEventService_Servant._get_class(); }
      public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
        _ISiteEventService_Servant._dispatch(this, buf, remote_endpoint, from_parent);
      }
      public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
        _ISiteEventService_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
      }
      static _dispatch(obj: _ISiteEventService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
        // Read CallHeader directly
        const function_idx = buf.dv.getUint8(16 + 3);
        switch(function_idx) {
          case 0: {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(152);
            obuf.commit(24);
            let __ret_val: string = '';
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ISiteEventService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:0,method_name:'GetSiteEventConfig',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:{}});
            __ret_val = (obj as any).GetSiteEventConfig();
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            const out_data = {_1: __ret_val};
            marshal_nscalc_M3(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          case 1: {
            const ia = unmarshal_nscalc_M1(buf, 32);
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(152);
            obuf.commit(24);
            let __ret_val: string = '';
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_ISiteEventService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:1,method_name:'SetSiteEventConfig',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
            try {
              __ret_val = (obj as any).SetSiteEventConfig(ia._1, ia._2);
            }
            catch(e) {
              if (e instanceof AuthorizationFailed) {
                const obuf = buf;
                obuf.consume(obuf.size);
                obuf.prepare(24);
                obuf.commit(24);
                const ex_data = {__ex_id: 0, reason: e.reason};
                marshal_AuthorizationFailed(obuf, 16, ex_data);
                obuf.write_len(obuf.size);
                obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
                obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
                (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
                return;
              }
              if (e instanceof PermissionViolation) {
                const obuf = buf;
                obuf.consume(obuf.size);
                obuf.prepare(28);
                obuf.commit(28);
                const ex_data = {__ex_id: 2, msg: e.msg};
                marshal_PermissionViolation(obuf, 16, ex_data);
                obuf.write_len(obuf.size);
                obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
                obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
                (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
                return;
              }
              if (e instanceof InvalidArgument) {
                const obuf = buf;
                obuf.consume(obuf.size);
                obuf.prepare(28);
                obuf.commit(28);
                const ex_data = {__ex_id: 3, msg: e.msg};
                marshal_InvalidArgument(obuf, 16, ex_data);
                obuf.write_len(obuf.size);
                obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
                obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
                (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
                return;
              }
              throw e;
            }
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
            const out_data = {_1: __ret_val};
            marshal_nscalc_M3(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          default:
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
        }
      }
      static _dispatch_stream(obj: _ISiteEventService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
        const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
        const function_idx = init.func_idx;
        const conn = NPRPC.rpc.get_connection(remote_endpoint);
        switch(function_idx) {
          default:
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
        }
      }
    }


    function nscalc_throw_exception(buf: NPRPC.FlatBuffer): void { 
      switch( buf.read_exception_number() ) {
        case 0:
        {
          let ex_obj = unmarshal_AuthorizationFailed(buf, 16 + 4);
          throw new AuthorizationFailed(ex_obj.reason);
        }
        case 1:
        {
          let ex_obj = unmarshal_RegistrationFailed(buf, 16 + 4);
          throw new RegistrationFailed(ex_obj.reason);
        }
        case 2:
        {
          let ex_obj = unmarshal_PermissionViolation(buf, 16 + 4);
          throw new PermissionViolation(ex_obj.msg);
        }
        case 3:
        {
          let ex_obj = unmarshal_InvalidArgument(buf, 16 + 4);
          throw new InvalidArgument(ex_obj.msg);
        }
        default:
          throw "unknown rpc exception";
      }
    }
export interface nscalc_M1 {
  _1: string;
  _2: string;
  }

  export function marshal_nscalc_M1(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M1): void {
  NPRPC.marshal_string(buf, offset + 0, data._1);
  NPRPC.marshal_string(buf, offset + 8, data._2);
}

export function unmarshal_nscalc_M1(buf: NPRPC.FlatBuffer, offset: number): nscalc_M1 {
const result = {} as nscalc_M1;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
result._2 = NPRPC.unmarshal_string(buf, offset + 8);
return result;
}

export interface nscalc_M2 {
  _1: UserData;
}

export function marshal_nscalc_M2(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M2): void {
marshal_UserData(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M2(buf: NPRPC.FlatBuffer, offset: number, remote_endpoint: NPRPC.EndPoint): nscalc_M2 {
const result = {} as nscalc_M2;
result._1 = unmarshal_UserData(buf, offset + 0, remote_endpoint);
return result;
}

export interface nscalc_M3 {
  _1: string;
}

export function marshal_nscalc_M3(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M3): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M3(buf: NPRPC.FlatBuffer, offset: number): nscalc_M3 {
const result = {} as nscalc_M3;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export interface nscalc_M4 {
  _1: boolean/*boolean*/;
}

export function marshal_nscalc_M4(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M4): void {
buf.dv.setUint8(offset + 0, data._1 ? 1 : 0);
}

export function unmarshal_nscalc_M4(buf: NPRPC.FlatBuffer, offset: number): nscalc_M4 {
const result = {} as nscalc_M4;
result._1 = buf.dv.getUint8(offset + 0) !== 0;
return result;
}

export interface nscalc_M5 {
  _1: string;
  _2: string;
  _3: string;
}

export function marshal_nscalc_M5(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M5): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
NPRPC.marshal_string(buf, offset + 8, data._2);
NPRPC.marshal_string(buf, offset + 16, data._3);
}

export function unmarshal_nscalc_M5(buf: NPRPC.FlatBuffer, offset: number): nscalc_M5 {
const result = {} as nscalc_M5;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
result._2 = NPRPC.unmarshal_string(buf, offset + 8);
result._3 = NPRPC.unmarshal_string(buf, offset + 16);
return result;
}

export interface nscalc_M6 {
  _1: string;
  _2: number/*u32*/;
}

export function marshal_nscalc_M6(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M6): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
buf.dv.setUint32(offset + 8, data._2, true);
}

export function unmarshal_nscalc_M6(buf: NPRPC.FlatBuffer, offset: number): nscalc_M6 {
const result = {} as nscalc_M6;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
result._2 = buf.dv.getUint32(offset + 8, true);
return result;
}

export interface nscalc_M7 {
  _1: Array<Calculation>;
}

export function marshal_nscalc_M7(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M7): void {
NPRPC.marshal_struct_array(buf, offset + 0, data._1, marshal_Calculation, 48, 8);
}

export function unmarshal_nscalc_M7(buf: NPRPC.FlatBuffer, offset: number): nscalc_M7 {
const result = {} as nscalc_M7;
result._1 = NPRPC.unmarshal_struct_array(buf, offset + 0, unmarshal_Calculation, 48);
return result;
}

export interface nscalc_M8 {
  _1: string;
  _2: Float64Array;
}

export function marshal_nscalc_M8(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M8): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
const __arr2 = new Float64Array(buf.array_buffer, offset + 8, 14);
__arr2.set(data._2);
}

export function unmarshal_nscalc_M8(buf: NPRPC.FlatBuffer, offset: number): nscalc_M8 {
const result = {} as nscalc_M8;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
result._2 = new Float64Array(buf.array_buffer, offset + 8, 14);
return result;
}

export interface nscalc_M9 {
  _1: number/*u32*/;
}

export function marshal_nscalc_M9(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M9): void {
buf.dv.setUint32(offset + 0, data._1, true);
}

export function unmarshal_nscalc_M9(buf: NPRPC.FlatBuffer, offset: number): nscalc_M9 {
const result = {} as nscalc_M9;
result._1 = buf.dv.getUint32(offset + 0, true);
return result;
}

export interface nscalc_M10 {
  _1: number/*u32*/;
  _2: string;
}

export function marshal_nscalc_M10(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M10): void {
buf.dv.setUint32(offset + 0, data._1, true);
NPRPC.marshal_string(buf, offset + 4, data._2);
}

export function unmarshal_nscalc_M10(buf: NPRPC.FlatBuffer, offset: number): nscalc_M10 {
const result = {} as nscalc_M10;
result._1 = buf.dv.getUint32(offset + 0, true);
result._2 = NPRPC.unmarshal_string(buf, offset + 4);
return result;
}

export interface nscalc_M11 {
  _1: number/*u32*/;
  _2: Array<SolutionElement>;
}

export function marshal_nscalc_M11(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M11): void {
buf.dv.setUint32(offset + 0, data._1, true);
NPRPC.marshal_struct_array(buf, offset + 4, data._2, marshal_SolutionElement, 16, 8);
}

export function unmarshal_nscalc_M11(buf: NPRPC.FlatBuffer, offset: number): nscalc_M11 {
const result = {} as nscalc_M11;
result._1 = buf.dv.getUint32(offset + 0, true);
result._2 = NPRPC.unmarshal_struct_array(buf, offset + 4, unmarshal_SolutionElement, 16);
return result;
}

export interface nscalc_M12 {
  _1: Calculation;
}

export function marshal_nscalc_M12(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M12): void {
marshal_Calculation(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M12(buf: NPRPC.FlatBuffer, offset: number): nscalc_M12 {
const result = {} as nscalc_M12;
result._1 = unmarshal_Calculation(buf, offset + 0);
return result;
}

export interface nscalc_M13 {
  _1: Alarm;
}

export function marshal_nscalc_M13(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M13): void {
marshal_Alarm(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M13(buf: NPRPC.FlatBuffer, offset: number): nscalc_M13 {
const result = {} as nscalc_M13;
result._1 = unmarshal_Alarm(buf, offset + 0);
return result;
}

export interface nscalc_M14 {
  _1: Footstep;
}

export function marshal_nscalc_M14(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M14): void {
marshal_Footstep(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M14(buf: NPRPC.FlatBuffer, offset: number): nscalc_M14 {
const result = {} as nscalc_M14;
result._1 = unmarshal_Footstep(buf, offset + 0);
return result;
}

export interface nscalc_M15 {
  _1: Array<Solution>;
  _2: Array<Fertilizer>;
}

export function marshal_nscalc_M15(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M15): void {
NPRPC.marshal_struct_array(buf, offset + 0, data._1, marshal_Solution, 136, 8);
NPRPC.marshal_struct_array(buf, offset + 8, data._2, marshal_Fertilizer, 168, 8);
}

export function unmarshal_nscalc_M15(buf: NPRPC.FlatBuffer, offset: number): nscalc_M15 {
const result = {} as nscalc_M15;
result._1 = NPRPC.unmarshal_struct_array(buf, offset + 0, unmarshal_Solution, 136);
result._2 = NPRPC.unmarshal_struct_array(buf, offset + 8, unmarshal_Fertilizer, 168);
return result;
}

export interface nscalc_M16 {
  _1: number/*u32*/;
  _2: number/*u32*/;
}

export function marshal_nscalc_M16(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M16): void {
buf.dv.setUint32(offset + 0, data._1, true);
buf.dv.setUint32(offset + 4, data._2, true);
}

export function unmarshal_nscalc_M16(buf: NPRPC.FlatBuffer, offset: number): nscalc_M16 {
const result = {} as nscalc_M16;
result._1 = buf.dv.getUint32(offset + 0, true);
result._2 = buf.dv.getUint32(offset + 4, true);
return result;
}

export interface nscalc_M17 {
  _1: CalculatorBootstrap;
}

export function marshal_nscalc_M17(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M17): void {
marshal_CalculatorBootstrap(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M17(buf: NPRPC.FlatBuffer, offset: number): nscalc_M17 {
const result = {} as nscalc_M17;
result._1 = unmarshal_CalculatorBootstrap(buf, offset + 0);
return result;
}

export interface nscalc_M18 {
  _1: string;
  _2: string;
  _3: string;
  _4: number/*u32*/;
}

export function marshal_nscalc_M18(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M18): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
NPRPC.marshal_string(buf, offset + 8, data._2);
NPRPC.marshal_string(buf, offset + 16, data._3);
buf.dv.setUint32(offset + 24, data._4, true);
}

export function unmarshal_nscalc_M18(buf: NPRPC.FlatBuffer, offset: number): nscalc_M18 {
const result = {} as nscalc_M18;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
result._2 = NPRPC.unmarshal_string(buf, offset + 8);
result._3 = NPRPC.unmarshal_string(buf, offset + 16);
result._4 = buf.dv.getUint32(offset + 24, true);
return result;
}

export interface nscalc_M19 {
  _1: SolutionCursorPage;
}

export function marshal_nscalc_M19(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M19): void {
marshal_SolutionCursorPage(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M19(buf: NPRPC.FlatBuffer, offset: number): nscalc_M19 {
const result = {} as nscalc_M19;
result._1 = unmarshal_SolutionCursorPage(buf, offset + 0);
return result;
}

export interface nscalc_M20 {
  _1: string;
  _2: string;
  _3: number/*u32*/;
}

export function marshal_nscalc_M20(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M20): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
NPRPC.marshal_string(buf, offset + 8, data._2);
buf.dv.setUint32(offset + 16, data._3, true);
}

export function unmarshal_nscalc_M20(buf: NPRPC.FlatBuffer, offset: number): nscalc_M20 {
const result = {} as nscalc_M20;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
result._2 = NPRPC.unmarshal_string(buf, offset + 8);
result._3 = buf.dv.getUint32(offset + 16, true);
return result;
}

export interface nscalc_M21 {
  _1: FertilizerCursorPage;
}

export function marshal_nscalc_M21(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M21): void {
marshal_FertilizerCursorPage(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M21(buf: NPRPC.FlatBuffer, offset: number): nscalc_M21 {
const result = {} as nscalc_M21;
result._1 = unmarshal_FertilizerCursorPage(buf, offset + 0);
return result;
}

export interface nscalc_M22 {
  _1: NPRPC.ObjectId;
}

export function marshal_nscalc_M22(buf: NPRPC.FlatBuffer, offset: number, data: nscalc_M22): void {
NPRPC.detail.marshal_ObjectId(buf, offset + 0, data._1);
}

export function unmarshal_nscalc_M22(buf: NPRPC.FlatBuffer, offset: number): nscalc_M22 {
const result = {} as nscalc_M22;
result._1 = NPRPC.detail.unmarshal_ObjectId(buf, offset + 0);
return result;
}

