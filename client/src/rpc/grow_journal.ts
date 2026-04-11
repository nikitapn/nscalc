import * as NPRPC from 'nprpc'

const u8enc = new TextEncoder();
const u8dec = new TextDecoder();

export type binary = Uint8Array;
export enum StoryVisibility { //u32
  Private,
  Unlisted,
  Public
}

export enum StoryStage { //u32
  Planning,
  Germination,
  Vegetative,
  Flowering,
  Harvest,
  Archived
}

export enum UpdateKind { //u32
  Note,
  Measurement,
  PhotoSet,
  Video
}

export enum MediaKind { //u32
  Image,
  Video
}

export enum MediaStatus { //u32
  PendingUpload,
  Uploading,
  Queued,
  Processing,
  Ready,
  Failed
}

export interface StoryPreview {
  id: bigint/*u64*/;
  slug: string;
  title: string;
  crop_name: string;
  cover_image_url?: string;
  solution_id?: number/*u32*/;
  solution_name?: string;
  author_name: string;
  visibility: StoryVisibility;
  stage: StoryStage;
  created_at: string;
  updated_at: string;
}

export function marshal_StoryPreview(buf: NPRPC.FlatBuffer, offset: number, data: StoryPreview): void {
buf.dv.setBigUint64(offset + 0, data.id, true);
NPRPC.marshal_string(buf, offset + 8, data.slug);
NPRPC.marshal_string(buf, offset + 16, data.title);
NPRPC.marshal_string(buf, offset + 24, data.crop_name);
if (data.cover_image_url !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 32, data.cover_image_url, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 32, 0, true); // nullopt
}
if (data.solution_id !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 36, data.solution_id, 'u32');
} else {
  buf.dv.setUint32(offset + 36, 0, true); // nullopt
}
if (data.solution_name !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 40, data.solution_name, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 40, 0, true); // nullopt
}
NPRPC.marshal_string(buf, offset + 44, data.author_name);
buf.dv.setUint32(offset + 52, data.visibility, true);
buf.dv.setUint32(offset + 56, data.stage, true);
NPRPC.marshal_string(buf, offset + 60, data.created_at);
NPRPC.marshal_string(buf, offset + 68, data.updated_at);
}

export function unmarshal_StoryPreview(buf: NPRPC.FlatBuffer, offset: number): StoryPreview {
const result = {} as StoryPreview;
result.id = buf.dv.getBigUint64(offset + 0, true);
result.slug = NPRPC.unmarshal_string(buf, offset + 8);
result.title = NPRPC.unmarshal_string(buf, offset + 16);
result.crop_name = NPRPC.unmarshal_string(buf, offset + 24);
if (buf.dv.getUint32(offset + 32, true) !== 0) {
  result.cover_image_url = NPRPC.unmarshal_optional_struct(buf, offset + 32, NPRPC.unmarshal_string, 4);
} else {
  result.cover_image_url = undefined;
}
if (buf.dv.getUint32(offset + 36, true) !== 0) {
  result.solution_id = NPRPC.unmarshal_optional_fundamental(buf, offset + 36, 'u32');
} else {
  result.solution_id = undefined;
}
if (buf.dv.getUint32(offset + 40, true) !== 0) {
  result.solution_name = NPRPC.unmarshal_optional_struct(buf, offset + 40, NPRPC.unmarshal_string, 4);
} else {
  result.solution_name = undefined;
}
result.author_name = NPRPC.unmarshal_string(buf, offset + 44);
result.visibility = buf.dv.getUint32(offset + 52, true);
result.stage = buf.dv.getUint32(offset + 56, true);
result.created_at = NPRPC.unmarshal_string(buf, offset + 60);
result.updated_at = NPRPC.unmarshal_string(buf, offset + 68);
return result;
}

export interface StoryPage {
  page: number/*u32*/;
  page_size: number/*u32*/;
  total_stories: number/*u32*/;
  stories: Array<StoryPreview>;
}

export function marshal_StoryPage(buf: NPRPC.FlatBuffer, offset: number, data: StoryPage): void {
buf.dv.setUint32(offset + 0, data.page, true);
buf.dv.setUint32(offset + 4, data.page_size, true);
buf.dv.setUint32(offset + 8, data.total_stories, true);
NPRPC.marshal_struct_array(buf, offset + 12, data.stories, marshal_StoryPreview, 80, 8);
}

export function unmarshal_StoryPage(buf: NPRPC.FlatBuffer, offset: number): StoryPage {
const result = {} as StoryPage;
result.page = buf.dv.getUint32(offset + 0, true);
result.page_size = buf.dv.getUint32(offset + 4, true);
result.total_stories = buf.dv.getUint32(offset + 8, true);
result.stories = NPRPC.unmarshal_struct_array(buf, offset + 12, unmarshal_StoryPreview, 80);
return result;
}

export interface StoryDetail {
  id: bigint/*u64*/;
  slug: string;
  title: string;
  crop_name: string;
  description: string;
  cover_image_url?: string;
  solution_id?: number/*u32*/;
  solution_name?: string;
  author_name: string;
  visibility: StoryVisibility;
  stage: StoryStage;
  created_at: string;
  updated_at: string;
}

export function marshal_StoryDetail(buf: NPRPC.FlatBuffer, offset: number, data: StoryDetail): void {
buf.dv.setBigUint64(offset + 0, data.id, true);
NPRPC.marshal_string(buf, offset + 8, data.slug);
NPRPC.marshal_string(buf, offset + 16, data.title);
NPRPC.marshal_string(buf, offset + 24, data.crop_name);
NPRPC.marshal_string(buf, offset + 32, data.description);
if (data.cover_image_url !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 40, data.cover_image_url, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 40, 0, true); // nullopt
}
if (data.solution_id !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 44, data.solution_id, 'u32');
} else {
  buf.dv.setUint32(offset + 44, 0, true); // nullopt
}
if (data.solution_name !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 48, data.solution_name, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 48, 0, true); // nullopt
}
NPRPC.marshal_string(buf, offset + 52, data.author_name);
buf.dv.setUint32(offset + 60, data.visibility, true);
buf.dv.setUint32(offset + 64, data.stage, true);
NPRPC.marshal_string(buf, offset + 68, data.created_at);
NPRPC.marshal_string(buf, offset + 76, data.updated_at);
}

export function unmarshal_StoryDetail(buf: NPRPC.FlatBuffer, offset: number): StoryDetail {
const result = {} as StoryDetail;
result.id = buf.dv.getBigUint64(offset + 0, true);
result.slug = NPRPC.unmarshal_string(buf, offset + 8);
result.title = NPRPC.unmarshal_string(buf, offset + 16);
result.crop_name = NPRPC.unmarshal_string(buf, offset + 24);
result.description = NPRPC.unmarshal_string(buf, offset + 32);
if (buf.dv.getUint32(offset + 40, true) !== 0) {
  result.cover_image_url = NPRPC.unmarshal_optional_struct(buf, offset + 40, NPRPC.unmarshal_string, 4);
} else {
  result.cover_image_url = undefined;
}
if (buf.dv.getUint32(offset + 44, true) !== 0) {
  result.solution_id = NPRPC.unmarshal_optional_fundamental(buf, offset + 44, 'u32');
} else {
  result.solution_id = undefined;
}
if (buf.dv.getUint32(offset + 48, true) !== 0) {
  result.solution_name = NPRPC.unmarshal_optional_struct(buf, offset + 48, NPRPC.unmarshal_string, 4);
} else {
  result.solution_name = undefined;
}
result.author_name = NPRPC.unmarshal_string(buf, offset + 52);
result.visibility = buf.dv.getUint32(offset + 60, true);
result.stage = buf.dv.getUint32(offset + 64, true);
result.created_at = NPRPC.unmarshal_string(buf, offset + 68);
result.updated_at = NPRPC.unmarshal_string(buf, offset + 76);
return result;
}

export interface MeasurementSnapshot {
  ec?: number/*f64*/;
  ph?: number/*f64*/;
  ppm?: number/*f64*/;
  solution_temperature_c?: number/*f64*/;
  air_temperature_c?: number/*f64*/;
  humidity_pct?: number/*f64*/;
  water_level_pct?: number/*f64*/;
  note?: string;
}

export function marshal_MeasurementSnapshot(buf: NPRPC.FlatBuffer, offset: number, data: MeasurementSnapshot): void {
if (data.ec !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 0, data.ec, 'f64');
} else {
  buf.dv.setUint32(offset + 0, 0, true); // nullopt
}
if (data.ph !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 4, data.ph, 'f64');
} else {
  buf.dv.setUint32(offset + 4, 0, true); // nullopt
}
if (data.ppm !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 8, data.ppm, 'f64');
} else {
  buf.dv.setUint32(offset + 8, 0, true); // nullopt
}
if (data.solution_temperature_c !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 12, data.solution_temperature_c, 'f64');
} else {
  buf.dv.setUint32(offset + 12, 0, true); // nullopt
}
if (data.air_temperature_c !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 16, data.air_temperature_c, 'f64');
} else {
  buf.dv.setUint32(offset + 16, 0, true); // nullopt
}
if (data.humidity_pct !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 20, data.humidity_pct, 'f64');
} else {
  buf.dv.setUint32(offset + 20, 0, true); // nullopt
}
if (data.water_level_pct !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 24, data.water_level_pct, 'f64');
} else {
  buf.dv.setUint32(offset + 24, 0, true); // nullopt
}
if (data.note !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 28, data.note, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 28, 0, true); // nullopt
}
}

export function unmarshal_MeasurementSnapshot(buf: NPRPC.FlatBuffer, offset: number): MeasurementSnapshot {
const result = {} as MeasurementSnapshot;
if (buf.dv.getUint32(offset + 0, true) !== 0) {
  result.ec = NPRPC.unmarshal_optional_fundamental(buf, offset + 0, 'f64');
} else {
  result.ec = undefined;
}
if (buf.dv.getUint32(offset + 4, true) !== 0) {
  result.ph = NPRPC.unmarshal_optional_fundamental(buf, offset + 4, 'f64');
} else {
  result.ph = undefined;
}
if (buf.dv.getUint32(offset + 8, true) !== 0) {
  result.ppm = NPRPC.unmarshal_optional_fundamental(buf, offset + 8, 'f64');
} else {
  result.ppm = undefined;
}
if (buf.dv.getUint32(offset + 12, true) !== 0) {
  result.solution_temperature_c = NPRPC.unmarshal_optional_fundamental(buf, offset + 12, 'f64');
} else {
  result.solution_temperature_c = undefined;
}
if (buf.dv.getUint32(offset + 16, true) !== 0) {
  result.air_temperature_c = NPRPC.unmarshal_optional_fundamental(buf, offset + 16, 'f64');
} else {
  result.air_temperature_c = undefined;
}
if (buf.dv.getUint32(offset + 20, true) !== 0) {
  result.humidity_pct = NPRPC.unmarshal_optional_fundamental(buf, offset + 20, 'f64');
} else {
  result.humidity_pct = undefined;
}
if (buf.dv.getUint32(offset + 24, true) !== 0) {
  result.water_level_pct = NPRPC.unmarshal_optional_fundamental(buf, offset + 24, 'f64');
} else {
  result.water_level_pct = undefined;
}
if (buf.dv.getUint32(offset + 28, true) !== 0) {
  result.note = NPRPC.unmarshal_optional_struct(buf, offset + 28, NPRPC.unmarshal_string, 4);
} else {
  result.note = undefined;
}
return result;
}

export interface MediaAsset {
  id: bigint/*u64*/;
  kind: MediaKind;
  status: MediaStatus;
  original_filename: string;
  mime_type: string;
  byte_size: bigint/*u64*/;
  width?: number/*u32*/;
  height?: number/*u32*/;
  duration_ms?: bigint/*u64*/;
  image_url?: string;
  poster_url?: string;
  dash_manifest_url?: string;
  created_at: string;
  error_message?: string;
}

export function marshal_MediaAsset(buf: NPRPC.FlatBuffer, offset: number, data: MediaAsset): void {
buf.dv.setBigUint64(offset + 0, data.id, true);
buf.dv.setUint32(offset + 8, data.kind, true);
buf.dv.setUint32(offset + 12, data.status, true);
NPRPC.marshal_string(buf, offset + 16, data.original_filename);
NPRPC.marshal_string(buf, offset + 24, data.mime_type);
buf.dv.setBigUint64(offset + 32, data.byte_size, true);
if (data.width !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 40, data.width, 'u32');
} else {
  buf.dv.setUint32(offset + 40, 0, true); // nullopt
}
if (data.height !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 44, data.height, 'u32');
} else {
  buf.dv.setUint32(offset + 44, 0, true); // nullopt
}
if (data.duration_ms !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 48, data.duration_ms, 'u64');
} else {
  buf.dv.setUint32(offset + 48, 0, true); // nullopt
}
if (data.image_url !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 52, data.image_url, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 52, 0, true); // nullopt
}
if (data.poster_url !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 56, data.poster_url, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 56, 0, true); // nullopt
}
if (data.dash_manifest_url !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 60, data.dash_manifest_url, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 60, 0, true); // nullopt
}
NPRPC.marshal_string(buf, offset + 64, data.created_at);
if (data.error_message !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 72, data.error_message, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 72, 0, true); // nullopt
}
}

export function unmarshal_MediaAsset(buf: NPRPC.FlatBuffer, offset: number): MediaAsset {
const result = {} as MediaAsset;
result.id = buf.dv.getBigUint64(offset + 0, true);
result.kind = buf.dv.getUint32(offset + 8, true);
result.status = buf.dv.getUint32(offset + 12, true);
result.original_filename = NPRPC.unmarshal_string(buf, offset + 16);
result.mime_type = NPRPC.unmarshal_string(buf, offset + 24);
result.byte_size = buf.dv.getBigUint64(offset + 32, true);
if (buf.dv.getUint32(offset + 40, true) !== 0) {
  result.width = NPRPC.unmarshal_optional_fundamental(buf, offset + 40, 'u32');
} else {
  result.width = undefined;
}
if (buf.dv.getUint32(offset + 44, true) !== 0) {
  result.height = NPRPC.unmarshal_optional_fundamental(buf, offset + 44, 'u32');
} else {
  result.height = undefined;
}
if (buf.dv.getUint32(offset + 48, true) !== 0) {
  result.duration_ms = NPRPC.unmarshal_optional_fundamental(buf, offset + 48, 'u64');
} else {
  result.duration_ms = undefined;
}
if (buf.dv.getUint32(offset + 52, true) !== 0) {
  result.image_url = NPRPC.unmarshal_optional_struct(buf, offset + 52, NPRPC.unmarshal_string, 4);
} else {
  result.image_url = undefined;
}
if (buf.dv.getUint32(offset + 56, true) !== 0) {
  result.poster_url = NPRPC.unmarshal_optional_struct(buf, offset + 56, NPRPC.unmarshal_string, 4);
} else {
  result.poster_url = undefined;
}
if (buf.dv.getUint32(offset + 60, true) !== 0) {
  result.dash_manifest_url = NPRPC.unmarshal_optional_struct(buf, offset + 60, NPRPC.unmarshal_string, 4);
} else {
  result.dash_manifest_url = undefined;
}
result.created_at = NPRPC.unmarshal_string(buf, offset + 64);
if (buf.dv.getUint32(offset + 72, true) !== 0) {
  result.error_message = NPRPC.unmarshal_optional_struct(buf, offset + 72, NPRPC.unmarshal_string, 4);
} else {
  result.error_message = undefined;
}
return result;
}

export interface StoryUpdate {
  id: bigint/*u64*/;
  story_id: bigint/*u64*/;
  author_name: string;
  title?: string;
  body: string;
  kind: UpdateKind;
  measurements?: MeasurementSnapshot;
  media: Array<MediaAsset>;
  created_at: string;
}

export function marshal_StoryUpdate(buf: NPRPC.FlatBuffer, offset: number, data: StoryUpdate): void {
buf.dv.setBigUint64(offset + 0, data.id, true);
buf.dv.setBigUint64(offset + 8, data.story_id, true);
NPRPC.marshal_string(buf, offset + 16, data.author_name);
if (data.title !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 24, data.title, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 24, 0, true); // nullopt
}
NPRPC.marshal_string(buf, offset + 28, data.body);
buf.dv.setUint32(offset + 36, data.kind, true);
if (data.measurements !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 40, data.measurements, marshal_MeasurementSnapshot, 32, 4);
} else {
  buf.dv.setUint32(offset + 40, 0, true); // nullopt
}
NPRPC.marshal_struct_array(buf, offset + 44, data.media, marshal_MediaAsset, 80, 8);
NPRPC.marshal_string(buf, offset + 52, data.created_at);
}

export function unmarshal_StoryUpdate(buf: NPRPC.FlatBuffer, offset: number): StoryUpdate {
const result = {} as StoryUpdate;
result.id = buf.dv.getBigUint64(offset + 0, true);
result.story_id = buf.dv.getBigUint64(offset + 8, true);
result.author_name = NPRPC.unmarshal_string(buf, offset + 16);
if (buf.dv.getUint32(offset + 24, true) !== 0) {
  result.title = NPRPC.unmarshal_optional_struct(buf, offset + 24, NPRPC.unmarshal_string, 4);
} else {
  result.title = undefined;
}
result.body = NPRPC.unmarshal_string(buf, offset + 28);
result.kind = buf.dv.getUint32(offset + 36, true);
if (buf.dv.getUint32(offset + 40, true) !== 0) {
  result.measurements = NPRPC.unmarshal_optional_struct(buf, offset + 40, unmarshal_MeasurementSnapshot, 4);
} else {
  result.measurements = undefined;
}
result.media = NPRPC.unmarshal_struct_array(buf, offset + 44, unmarshal_MediaAsset, 80);
result.created_at = NPRPC.unmarshal_string(buf, offset + 52);
return result;
}

export interface UpdatePage {
  page: number/*u32*/;
  page_size: number/*u32*/;
  total_updates: number/*u32*/;
  updates: Array<StoryUpdate>;
}

export function marshal_UpdatePage(buf: NPRPC.FlatBuffer, offset: number, data: UpdatePage): void {
buf.dv.setUint32(offset + 0, data.page, true);
buf.dv.setUint32(offset + 4, data.page_size, true);
buf.dv.setUint32(offset + 8, data.total_updates, true);
NPRPC.marshal_struct_array(buf, offset + 12, data.updates, marshal_StoryUpdate, 64, 8);
}

export function unmarshal_UpdatePage(buf: NPRPC.FlatBuffer, offset: number): UpdatePage {
const result = {} as UpdatePage;
result.page = buf.dv.getUint32(offset + 0, true);
result.page_size = buf.dv.getUint32(offset + 4, true);
result.total_updates = buf.dv.getUint32(offset + 8, true);
result.updates = NPRPC.unmarshal_struct_array(buf, offset + 12, unmarshal_StoryUpdate, 64);
return result;
}

export interface CreateStoryRequest {
  title: string;
  crop_name: string;
  description: string;
  visibility: StoryVisibility;
  solution_id?: number/*u32*/;
}

export function marshal_CreateStoryRequest(buf: NPRPC.FlatBuffer, offset: number, data: CreateStoryRequest): void {
NPRPC.marshal_string(buf, offset + 0, data.title);
NPRPC.marshal_string(buf, offset + 8, data.crop_name);
NPRPC.marshal_string(buf, offset + 16, data.description);
buf.dv.setUint32(offset + 24, data.visibility, true);
if (data.solution_id !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 28, data.solution_id, 'u32');
} else {
  buf.dv.setUint32(offset + 28, 0, true); // nullopt
}
}

export function unmarshal_CreateStoryRequest(buf: NPRPC.FlatBuffer, offset: number): CreateStoryRequest {
const result = {} as CreateStoryRequest;
result.title = NPRPC.unmarshal_string(buf, offset + 0);
result.crop_name = NPRPC.unmarshal_string(buf, offset + 8);
result.description = NPRPC.unmarshal_string(buf, offset + 16);
result.visibility = buf.dv.getUint32(offset + 24, true);
if (buf.dv.getUint32(offset + 28, true) !== 0) {
  result.solution_id = NPRPC.unmarshal_optional_fundamental(buf, offset + 28, 'u32');
} else {
  result.solution_id = undefined;
}
return result;
}

export interface CreateUpdateRequest {
  story_id: bigint/*u64*/;
  title?: string;
  body: string;
  kind: UpdateKind;
  measurements?: MeasurementSnapshot;
}

export function marshal_CreateUpdateRequest(buf: NPRPC.FlatBuffer, offset: number, data: CreateUpdateRequest): void {
buf.dv.setBigUint64(offset + 0, data.story_id, true);
if (data.title !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 8, data.title, NPRPC.marshal_string, 8, 4);
} else {
  buf.dv.setUint32(offset + 8, 0, true); // nullopt
}
NPRPC.marshal_string(buf, offset + 12, data.body);
buf.dv.setUint32(offset + 20, data.kind, true);
if (data.measurements !== undefined) {
  NPRPC.marshal_optional_struct(buf, offset + 24, data.measurements, marshal_MeasurementSnapshot, 32, 4);
} else {
  buf.dv.setUint32(offset + 24, 0, true); // nullopt
}
}

export function unmarshal_CreateUpdateRequest(buf: NPRPC.FlatBuffer, offset: number): CreateUpdateRequest {
const result = {} as CreateUpdateRequest;
result.story_id = buf.dv.getBigUint64(offset + 0, true);
if (buf.dv.getUint32(offset + 8, true) !== 0) {
  result.title = NPRPC.unmarshal_optional_struct(buf, offset + 8, NPRPC.unmarshal_string, 4);
} else {
  result.title = undefined;
}
result.body = NPRPC.unmarshal_string(buf, offset + 12);
result.kind = buf.dv.getUint32(offset + 20, true);
if (buf.dv.getUint32(offset + 24, true) !== 0) {
  result.measurements = NPRPC.unmarshal_optional_struct(buf, offset + 24, unmarshal_MeasurementSnapshot, 4);
} else {
  result.measurements = undefined;
}
return result;
}

export interface UploadTarget {
  asset_id: bigint/*u64*/;
  upload_token: string;
  story_id: bigint/*u64*/;
  update_id?: bigint/*u64*/;
  kind: MediaKind;
  original_filename: string;
  mime_type: string;
}

export function marshal_UploadTarget(buf: NPRPC.FlatBuffer, offset: number, data: UploadTarget): void {
buf.dv.setBigUint64(offset + 0, data.asset_id, true);
NPRPC.marshal_string(buf, offset + 8, data.upload_token);
buf.dv.setBigUint64(offset + 16, data.story_id, true);
if (data.update_id !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 24, data.update_id, 'u64');
} else {
  buf.dv.setUint32(offset + 24, 0, true); // nullopt
}
buf.dv.setUint32(offset + 28, data.kind, true);
NPRPC.marshal_string(buf, offset + 32, data.original_filename);
NPRPC.marshal_string(buf, offset + 40, data.mime_type);
}

export function unmarshal_UploadTarget(buf: NPRPC.FlatBuffer, offset: number): UploadTarget {
const result = {} as UploadTarget;
result.asset_id = buf.dv.getBigUint64(offset + 0, true);
result.upload_token = NPRPC.unmarshal_string(buf, offset + 8);
result.story_id = buf.dv.getBigUint64(offset + 16, true);
if (buf.dv.getUint32(offset + 24, true) !== 0) {
  result.update_id = NPRPC.unmarshal_optional_fundamental(buf, offset + 24, 'u64');
} else {
  result.update_id = undefined;
}
result.kind = buf.dv.getUint32(offset + 28, true);
result.original_filename = NPRPC.unmarshal_string(buf, offset + 32);
result.mime_type = NPRPC.unmarshal_string(buf, offset + 40);
return result;
}

export interface UploadProgress {
  asset_id: bigint/*u64*/;
  bytes_received: bigint/*u64*/;
}

export function marshal_UploadProgress(buf: NPRPC.FlatBuffer, offset: number, data: UploadProgress): void {
buf.dv.setBigUint64(offset + 0, data.asset_id, true);
buf.dv.setBigUint64(offset + 8, data.bytes_received, true);
}

export function unmarshal_UploadProgress(buf: NPRPC.FlatBuffer, offset: number): UploadProgress {
const result = {} as UploadProgress;
result.asset_id = buf.dv.getBigUint64(offset + 0, true);
result.bytes_received = buf.dv.getBigUint64(offset + 8, true);
return result;
}

export interface StoryStreamClientEvent {
  typing_update_id?: bigint/*u64*/;
}

export function marshal_StoryStreamClientEvent(buf: NPRPC.FlatBuffer, offset: number, data: StoryStreamClientEvent): void {
if (data.typing_update_id !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 0, data.typing_update_id, 'u64');
} else {
  buf.dv.setUint32(offset + 0, 0, true); // nullopt
}
}

export function unmarshal_StoryStreamClientEvent(buf: NPRPC.FlatBuffer, offset: number): StoryStreamClientEvent {
const result = {} as StoryStreamClientEvent;
if (buf.dv.getUint32(offset + 0, true) !== 0) {
  result.typing_update_id = NPRPC.unmarshal_optional_fundamental(buf, offset + 0, 'u64');
} else {
  result.typing_update_id = undefined;
}
return result;
}

export type StoryStreamPayload =
  | { kind: 'update'; value: StoryUpdate }
  | { kind: 'media'; value: MediaAsset }
  | { kind: 'progress'; value: UploadProgress };

export function marshal_StoryStreamPayload(buf: NPRPC.FlatBuffer, offset: number, data: StoryStreamPayload): void {
switch (data.kind) {
case 'update': {
buf.dv.setUint32(offset, 0, true);
NPRPC.marshal_optional_struct(buf, offset + 4, data.value, marshal_StoryUpdate, 64, 8);
break;
}
case 'media': {
buf.dv.setUint32(offset, 1, true);
NPRPC.marshal_optional_struct(buf, offset + 4, data.value, marshal_MediaAsset, 80, 8);
break;
}
case 'progress': {
buf.dv.setUint32(offset, 2, true);
NPRPC.marshal_optional_struct(buf, offset + 4, data.value, marshal_UploadProgress, 16, 8);
break;
}
}
}

export function unmarshal_StoryStreamPayload(buf: NPRPC.FlatBuffer, offset: number): StoryStreamPayload {
const kind = buf.dv.getUint32(offset, true);
const arm_offset = (offset + 4) + buf.dv.getUint32(offset + 4, true);
switch (kind) {
case 0: return { kind: 'update', value: unmarshal_StoryUpdate(buf, arm_offset) };
case 1: return { kind: 'media', value: unmarshal_MediaAsset(buf, arm_offset) };
case 2: return { kind: 'progress', value: unmarshal_UploadProgress(buf, arm_offset) };
default: throw new NPRPC.Exception('Invalid variant discriminant: ' + kind);
}
}

export interface StoryStreamServerEvent {
  story_id?: bigint/*u64*/;
  payload: StoryStreamPayload;
}

export function marshal_StoryStreamServerEvent(buf: NPRPC.FlatBuffer, offset: number, data: StoryStreamServerEvent): void {
if (data.story_id !== undefined) {
  NPRPC.marshal_optional_fundamental(buf, offset + 0, data.story_id, 'u64');
} else {
  buf.dv.setUint32(offset + 0, 0, true); // nullopt
}
marshal_StoryStreamPayload(buf, offset + 4, data.payload);
}

export function unmarshal_StoryStreamServerEvent(buf: NPRPC.FlatBuffer, offset: number): StoryStreamServerEvent {
const result = {} as StoryStreamServerEvent;
if (buf.dv.getUint32(offset + 0, true) !== 0) {
  result.story_id = NPRPC.unmarshal_optional_fundamental(buf, offset + 0, 'u64');
} else {
  result.story_id = undefined;
}
result.payload = unmarshal_StoryStreamPayload(buf, offset + 4);
return result;
}

export interface NotFound_Data {
  __ex_id: number/*u32*/;
  msg: string;
}

export class NotFound extends NPRPC.Exception {
  constructor(  public msg: string) { super("NotFound"); }
}

export function marshal_NotFound(buf: NPRPC.FlatBuffer, offset: number, data: NotFound_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
NPRPC.marshal_string(buf, offset + 4, data.msg);
}
export function unmarshal_NotFound(buf: NPRPC.FlatBuffer, offset: number): NotFound {
const result = {} as NotFound;
result.msg = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export interface UploadRejected_Data {
  __ex_id: number/*u32*/;
  msg: string;
}

export class UploadRejected extends NPRPC.Exception {
  constructor(  public msg: string) { super("UploadRejected"); }
}

export function marshal_UploadRejected(buf: NPRPC.FlatBuffer, offset: number, data: UploadRejected_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
NPRPC.marshal_string(buf, offset + 4, data.msg);
}
export function unmarshal_UploadRejected(buf: NPRPC.FlatBuffer, offset: number): UploadRejected {
const result = {} as UploadRejected;
result.msg = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export interface ProcessingFailed_Data {
  __ex_id: number/*u32*/;
  msg: string;
}

export class ProcessingFailed extends NPRPC.Exception {
  constructor(  public msg: string) { super("ProcessingFailed"); }
}

export function marshal_ProcessingFailed(buf: NPRPC.FlatBuffer, offset: number, data: ProcessingFailed_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
NPRPC.marshal_string(buf, offset + 4, data.msg);
}
export function unmarshal_ProcessingFailed(buf: NPRPC.FlatBuffer, offset: number): ProcessingFailed {
const result = {} as ProcessingFailed;
result.msg = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export interface PermissionDenied_Data {
  __ex_id: number/*u32*/;
  msg: string;
}

export class PermissionDenied extends NPRPC.Exception {
  constructor(  public msg: string) { super("PermissionDenied"); }
}

export function marshal_PermissionDenied(buf: NPRPC.FlatBuffer, offset: number, data: PermissionDenied_Data): void {
buf.dv.setUint32(offset + 0, data.__ex_id, true);
NPRPC.marshal_string(buf, offset + 4, data.msg);
}
export function unmarshal_PermissionDenied(buf: NPRPC.FlatBuffer, offset: number): PermissionDenied {
const result = {} as PermissionDenied;
result.msg = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export class JournalService extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IJournalService_Servant {
    return _IJournalService_Servant;
  }


  public async ListStories(page: /*in*/number, page_size: /*in*/number): Promise<StoryPage> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(40);
    buf.commit(40);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 0);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M1(buf, 32, {_1: page, _2: page_size});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'ListStories',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{page:page,page_size:page_size},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M2(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async GetStory(slug: /*in*/string): Promise<StoryDetail> {
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
    marshal_grow_journal_M3(buf, 32, {_1: slug});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'GetStory',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{slug:slug},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M4(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async ListUpdates(story_id: /*in*/bigint, page: /*in*/number, page_size: /*in*/number): Promise<UpdatePage> {
    let interface_idx = (arguments.length == 3 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(48);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 2);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M5(buf, 32, {_1: story_id, _2: page, _3: page_size});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:2,method_name:'ListUpdates',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{story_id:story_id,page:page,page_size:page_size},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M6(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async CreateStory(req: /*in*/CreateStoryRequest): Promise<StoryDetail> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(192);
    buf.commit(64);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 3);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M7(buf, 32, {_1: req});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:3,method_name:'CreateStory',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{req:req},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M4(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async CreateUpdate(req: /*in*/CreateUpdateRequest): Promise<StoryUpdate> {
    let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(192);
    buf.commit(64);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 4);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M8(buf, 32, {_1: req});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:4,method_name:'CreateUpdate',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{req:req},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M9(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async DeleteStory(session_id: /*in*/string, story_id: /*in*/bigint): Promise<boolean/*boolean*/> {
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
    marshal_grow_journal_M10(buf, 32, {_1: session_id, _2: story_id});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:5,method_name:'DeleteStory',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{session_id:session_id,story_id:story_id},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M11(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async CreateImageUpload(story_id: /*in*/bigint, update_id: /*in*/bigint, filename: /*in*/string, mime_type: /*in*/string): Promise<UploadTarget> {
    let interface_idx = (arguments.length == 4 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(192);
    buf.commit(64);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 6);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M12(buf, 32, {_1: story_id, _2: update_id, _3: filename, _4: mime_type});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:6,method_name:'CreateImageUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{story_id:story_id,update_id:update_id,filename:filename,mime_type:mime_type},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M13(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async CreateVideoUpload(story_id: /*in*/bigint, update_id: /*in*/bigint, filename: /*in*/string, mime_type: /*in*/string): Promise<UploadTarget> {
    let interface_idx = (arguments.length == 4 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(192);
    buf.commit(64);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 7);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M12(buf, 32, {_1: story_id, _2: update_id, _3: filename, _4: mime_type});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:7,method_name:'CreateVideoUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{story_id:story_id,update_id:update_id,filename:filename,mime_type:mime_type},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M13(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async AttachAsset(update_id: /*in*/bigint, asset_id: /*in*/bigint): Promise<StoryUpdate> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(48);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 8);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M14(buf, 32, {_1: update_id, _2: asset_id});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:8,method_name:'AttachAsset',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{update_id:update_id,asset_id:asset_id},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M9(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }

  // HTTP Transport (alternative to WebSocket)
  public readonly http = {
    ListStories: async (page: /*in*/number, page_size: /*in*/number): Promise<StoryPage> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(40);
      buf.commit(40);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 0);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M1(buf, 32, {_1: page, _2: page_size});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:0,method_name:'ListStories',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{page:page,page_size:page_size},request_bytes:buf.size});

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
      const out = unmarshal_grow_journal_M2(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    GetStory: async (slug: /*in*/string): Promise<StoryDetail> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(168);
      buf.commit(40);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 1);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M3(buf, 32, {_1: slug});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:1,method_name:'GetStory',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{slug:slug},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M4(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    ListUpdates: async (story_id: /*in*/bigint, page: /*in*/number, page_size: /*in*/number): Promise<UpdatePage> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(48);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 2);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M5(buf, 32, {_1: story_id, _2: page, _3: page_size});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:2,method_name:'ListUpdates',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{story_id:story_id,page:page,page_size:page_size},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M6(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    CreateStory: async (req: /*in*/CreateStoryRequest): Promise<StoryDetail> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(192);
      buf.commit(64);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 3);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M7(buf, 32, {_1: req});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:3,method_name:'CreateStory',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{req:req},request_bytes:buf.size});

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
      const out = unmarshal_grow_journal_M4(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    CreateUpdate: async (req: /*in*/CreateUpdateRequest): Promise<StoryUpdate> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(192);
      buf.commit(64);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 4);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M8(buf, 32, {_1: req});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:4,method_name:'CreateUpdate',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{req:req},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M9(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    DeleteStory: async (session_id: /*in*/string, story_id: /*in*/bigint): Promise<boolean/*boolean*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(176);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 5);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M10(buf, 32, {_1: session_id, _2: story_id});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:5,method_name:'DeleteStory',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{session_id:session_id,story_id:story_id},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M11(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    CreateImageUpload: async (story_id: /*in*/bigint, update_id: /*in*/bigint, filename: /*in*/string, mime_type: /*in*/string): Promise<UploadTarget> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(192);
      buf.commit(64);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 6);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M12(buf, 32, {_1: story_id, _2: update_id, _3: filename, _4: mime_type});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:6,method_name:'CreateImageUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{story_id:story_id,update_id:update_id,filename:filename,mime_type:mime_type},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M13(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    CreateVideoUpload: async (story_id: /*in*/bigint, update_id: /*in*/bigint, filename: /*in*/string, mime_type: /*in*/string): Promise<UploadTarget> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(192);
      buf.commit(64);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 7);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M12(buf, 32, {_1: story_id, _2: update_id, _3: filename, _4: mime_type});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:7,method_name:'CreateVideoUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{story_id:story_id,update_id:update_id,filename:filename,mime_type:mime_type},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M13(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    AttachAsset: async (update_id: /*in*/bigint, asset_id: /*in*/bigint): Promise<StoryUpdate> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(48);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 8);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M14(buf, 32, {_1: update_id, _2: asset_id});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IJournalService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:8,method_name:'AttachAsset',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{update_id:update_id,asset_id:asset_id},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M9(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    }
  };
}
export interface IJournalService_Servant
{
  ListStories(page: /*in*/number, page_size: /*in*/number): StoryPage;
  GetStory(slug: /*in*/string): StoryDetail;
  ListUpdates(story_id: /*in*/bigint, page: /*in*/number, page_size: /*in*/number): UpdatePage;
  CreateStory(req: /*in*/CreateStoryRequest): StoryDetail;
  CreateUpdate(req: /*in*/CreateUpdateRequest): StoryUpdate;
  DeleteStory(session_id: /*in*/string, story_id: /*in*/bigint): boolean/*boolean*/;
  CreateImageUpload(story_id: /*in*/bigint, update_id: /*in*/bigint, filename: /*in*/string, mime_type: /*in*/string): UploadTarget;
  CreateVideoUpload(story_id: /*in*/bigint, update_id: /*in*/bigint, filename: /*in*/string, mime_type: /*in*/string): UploadTarget;
  AttachAsset(update_id: /*in*/bigint, asset_id: /*in*/bigint): StoryUpdate;
}
export class _IJournalService_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "grow_journal/grow_journal.JournalService"; }
  public readonly get_class = () => { return _IJournalService_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IJournalService_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IJournalService_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IJournalService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    // Read CallHeader directly
    const function_idx = buf.dv.getUint8(16 + 3);
    switch(function_idx) {
      case 0: {
        const ia = unmarshal_grow_journal_M1(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(164);
        obuf.commit(36);
        let __ret_val: StoryPage = {} as StoryPage;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:0,method_name:'ListStories',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).ListStories(ia._1, ia._2);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const out_data = {_1: __ret_val};
        marshal_grow_journal_M2(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 1: {
        const ia = unmarshal_grow_journal_M3(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(232);
        obuf.commit(104);
        let __ret_val: StoryDetail = {} as StoryDetail;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:1,method_name:'GetStory',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).GetStory(ia._1);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
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
        marshal_grow_journal_M4(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 2: {
        const ia = unmarshal_grow_journal_M5(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(164);
        obuf.commit(36);
        let __ret_val: UpdatePage = {} as UpdatePage;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:2,method_name:'ListUpdates',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).ListUpdates(ia._1, ia._2, ia._3);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
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
        marshal_grow_journal_M6(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 3: {
        const ia = unmarshal_grow_journal_M7(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(232);
        obuf.commit(104);
        let __ret_val: StoryDetail = {} as StoryDetail;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:3,method_name:'CreateStory',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).CreateStory(ia._1);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const out_data = {_1: __ret_val};
        marshal_grow_journal_M4(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 4: {
        const ia = unmarshal_grow_journal_M8(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(208);
        obuf.commit(80);
        let __ret_val: StoryUpdate = {} as StoryUpdate;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:4,method_name:'CreateUpdate',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).CreateUpdate(ia._1);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
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
        marshal_grow_journal_M9(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 5: {
        const ia = unmarshal_grow_journal_M10(buf, 32);
        let __ret_val: boolean/*boolean*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:5,method_name:'DeleteStory',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).DeleteStory(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          if (e instanceof PermissionDenied) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 3, msg: e.msg};
            marshal_PermissionDenied(obuf, 16, ex_data);
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
        obuf.prepare(17);
        obuf.commit(17);
        const out_data = {_1: __ret_val};
        marshal_grow_journal_M11(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 6: {
        const ia = unmarshal_grow_journal_M12(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(192);
        obuf.commit(64);
        let __ret_val: UploadTarget = {} as UploadTarget;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:6,method_name:'CreateImageUpload',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).CreateImageUpload(ia._1, ia._2, ia._3, ia._4);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          if (e instanceof UploadRejected) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 1, msg: e.msg};
            marshal_UploadRejected(obuf, 16, ex_data);
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
        marshal_grow_journal_M13(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 7: {
        const ia = unmarshal_grow_journal_M12(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(192);
        obuf.commit(64);
        let __ret_val: UploadTarget = {} as UploadTarget;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:7,method_name:'CreateVideoUpload',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).CreateVideoUpload(ia._1, ia._2, ia._3, ia._4);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          if (e instanceof UploadRejected) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 1, msg: e.msg};
            marshal_UploadRejected(obuf, 16, ex_data);
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
        marshal_grow_journal_M13(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 8: {
        const ia = unmarshal_grow_journal_M14(buf, 32);
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(208);
        obuf.commit(80);
        let __ret_val: StoryUpdate = {} as StoryUpdate;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IJournalService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:8,method_name:'AttachAsset',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).AttachAsset(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
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
        marshal_grow_journal_M9(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
  static _dispatch_stream(obj: _IJournalService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
    const function_idx = init.func_idx;
    const conn = NPRPC.rpc.get_connection(remote_endpoint);
    switch(function_idx) {
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
}

export class UploadService extends NPRPC.ObjectProxy {
  public static get servant_t(): new() => _IUploadService_Servant {
    return _IUploadService_Servant;
  }


  public async UploadAsset(asset_id: /*in*/bigint, upload_token: /*in*/string): Promise<NPRPC.StreamWriter<binary>> {
    const interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const conn = NPRPC.rpc.get_connection(this.endpoint);
    const stream_id = conn.stream_manager.generate_stream_id();
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(192);
    buf.commit(64);
    buf.write_msg_id(NPRPC.impl.MessageId.StreamInitialization);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    NPRPC.impl.marshal_StreamInit(buf, 16, {
      stream_id,
      poa_idx: this.data.poa_idx,
      interface_idx,
      object_id: this.data.object_id,
      func_idx: 0,
      stream_kind: NPRPC.impl.StreamKind.Client
    });
    marshal_grow_journal_M15(buf, 48, {_1: asset_id, _2: upload_token});
    buf.write_len(buf.size);
    (globalThis as any).__nprpc_debug?.stream_start({direction:'client',class_id:_IUploadService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'UploadAsset',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},stream_id:String(stream_id),stream_kind:'client',request_args:{asset_id:asset_id,upload_token:upload_token},request_bytes:buf.size});
    return await NPRPC.rpc.open_client_stream(this.endpoint, buf, stream_id, this.timeout, ((value: Uint8Array) => { const buf = NPRPC.FlatBuffer.create(8 + value.byteLength); buf.commit(8); NPRPC.marshal_typed_array(buf, 0, value, 1, 1); return new Uint8Array(buf.array_buffer, 0, buf.size); }));
  }
  public async FinishUpload(asset_id: /*in*/bigint, upload_token: /*in*/string): Promise<UploadProgress> {
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
    marshal_grow_journal_M15(buf, 32, {_1: asset_id, _2: upload_token});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IUploadService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'FinishUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{asset_id:asset_id,upload_token:upload_token},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply == 1)    {
      grow_journal_throw_exception(buf);
    }
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M16(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }
  public async AbortUpload(asset_id: /*in*/bigint, upload_token: /*in*/string): Promise<boolean/*boolean*/> {
    let interface_idx = (arguments.length == 2 ? 0 : arguments[arguments.length - 1]);
    const buf = NPRPC.FlatBuffer.create();
    buf.prepare(176);
    buf.commit(48);
    buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
    buf.write_msg_type(NPRPC.impl.MessageType.Request);
    // Write CallHeader directly
    buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
    buf.dv.setUint8(16 + 2, interface_idx);
    buf.dv.setUint8(16 + 3, 2);
    buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
    marshal_grow_journal_M15(buf, 32, {_1: asset_id, _2: upload_token});
    buf.write_len(buf.size);
    const __dbg_t0 = Date.now();
    const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IUploadService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:2,method_name:'AbortUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{asset_id:asset_id,upload_token:upload_token},request_bytes:buf.size});
    await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
    let std_reply = NPRPC.handle_standart_reply(buf);
    if (std_reply != -1) {
      console.log("received an unusual reply for function with output arguments");
      throw new NPRPC.Exception("Unknown Error");
    }
    const out = unmarshal_grow_journal_M11(buf, 16);
    (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
    return out._1;
  }

  // HTTP Transport (alternative to WebSocket)
  public readonly http = {
    FinishUpload: async (asset_id: /*in*/bigint, upload_token: /*in*/string): Promise<UploadProgress> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(176);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 1);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M15(buf, 32, {_1: asset_id, _2: upload_token});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IUploadService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:1,method_name:'FinishUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{asset_id:asset_id,upload_token:upload_token},request_bytes:buf.size});

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
      if (std_reply == 1) grow_journal_throw_exception(buf);
      if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
      const out = unmarshal_grow_journal_M16(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    },
    AbortUpload: async (asset_id: /*in*/bigint, upload_token: /*in*/string): Promise<boolean/*boolean*/> => {
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(176);
      buf.commit(48);
      buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
      buf.write_msg_type(NPRPC.impl.MessageType.Request);
      buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
      buf.dv.setUint8(16 + 2, 0);
      buf.dv.setUint8(16 + 3, 2);
      buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
      marshal_grow_journal_M15(buf, 32, {_1: asset_id, _2: upload_token});
      buf.write_len(buf.size);

      const __dbg_t0 = Date.now();
      const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IUploadService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:2,method_name:'AbortUpload',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{asset_id:asset_id,upload_token:upload_token},request_bytes:buf.size});

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
      const out = unmarshal_grow_journal_M11(buf, 16);
      (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
      return out._1;
    }
  };
}
export interface IUploadService_Servant
{
  UploadAsset(asset_id: /*in*/bigint, upload_token: /*in*/string, data: NPRPC.StreamReader<binary>): void | Promise<void>;
  FinishUpload(asset_id: /*in*/bigint, upload_token: /*in*/string): UploadProgress;
  AbortUpload(asset_id: /*in*/bigint, upload_token: /*in*/string): boolean/*boolean*/;
}
export class _IUploadService_Servant extends NPRPC.ObjectServant {
  public static _get_class(): string { return "grow_journal/grow_journal.UploadService"; }
  public readonly get_class = () => { return _IUploadService_Servant._get_class(); }
  public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IUploadService_Servant._dispatch(this, buf, remote_endpoint, from_parent);
  }
  public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
    _IUploadService_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
  }
  static _dispatch(obj: _IUploadService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    // Read CallHeader directly
    const function_idx = buf.dv.getUint8(16 + 3);
    switch(function_idx) {
      case 1: {
        const ia = unmarshal_grow_journal_M15(buf, 32);
        let __ret_val: UploadProgress = {} as UploadProgress;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IUploadService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:1,method_name:'FinishUpload',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        try {
          __ret_val = (obj as any).FinishUpload(ia._1, ia._2);
        }
        catch(e) {
          if (e instanceof NotFound) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 0, msg: e.msg};
            marshal_NotFound(obuf, 16, ex_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
            return;
          }
          if (e instanceof UploadRejected) {
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(28);
            obuf.commit(28);
            const ex_data = {__ex_id: 1, msg: e.msg};
            marshal_UploadRejected(obuf, 16, ex_data);
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
        obuf.prepare(32);
        obuf.commit(32);
        const out_data = {_1: __ret_val};
        marshal_grow_journal_M16(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      case 2: {
        const ia = unmarshal_grow_journal_M15(buf, 32);
        let __ret_val: boolean/*boolean*/;
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IUploadService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:2,method_name:'AbortUpload',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
        __ret_val = (obj as any).AbortUpload(ia._1, ia._2);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0});
        const obuf = buf;
        obuf.consume(obuf.size);
        obuf.prepare(17);
        obuf.commit(17);
        const out_data = {_1: __ret_val};
        marshal_grow_journal_M11(obuf, 16, out_data);
        obuf.write_len(obuf.size);
        obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
        obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
        break;
      }
      default:
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
    }
  }
  static _dispatch_stream(obj: _IUploadService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
    const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
    const function_idx = init.func_idx;
    const conn = NPRPC.rpc.get_connection(remote_endpoint);
    switch(function_idx) {
      case 0: {
        const ia = unmarshal_grow_journal_M15(buf, 48);
        (globalThis as any).__nprpc_debug?.stream_start({direction:'server',class_id:_IUploadService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:init.interface_idx,func_idx:0,method_name:'UploadAsset',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},stream_id:String(init.stream_id),stream_kind:'client',request_args:ia,request_bytes:buf.size});
        const reader = conn.stream_manager.create_reader(init.stream_id, ((data: Uint8Array) => NPRPC.unmarshal_typed_array(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0, Uint8Array) as Uint8Array));
        NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
        void (async () => {
          try {
            await (obj as any).UploadAsset(ia._1, ia._2, reader);
          } catch (e) {
            reader.cancel();
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

  export class StoryStreamService extends NPRPC.ObjectProxy {
    public static get servant_t(): new() => _IStoryStreamService_Servant {
      return _IStoryStreamService_Servant;
    }


    public async WatchStory(story_id: /*in*/bigint): Promise<NPRPC.BidiStream<StoryStreamClientEvent, StoryStreamServerEvent>> {
      const interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
      const conn = NPRPC.rpc.get_connection(this.endpoint);
      const stream_id = conn.stream_manager.generate_stream_id();
      const buf = NPRPC.FlatBuffer.create();
      buf.prepare(56);
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
      marshal_grow_journal_M17(buf, 48, {_1: story_id});
      buf.write_len(buf.size);
      (globalThis as any).__nprpc_debug?.stream_start({direction:'client',class_id:_IStoryStreamService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'WatchStory',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},stream_id:String(stream_id),stream_kind:'bidi',request_args:{story_id:story_id},request_bytes:buf.size});
      return await NPRPC.rpc.open_bidi_stream(this.endpoint, buf, stream_id, this.timeout, ((value: StoryStreamClientEvent) => { const buf = NPRPC.FlatBuffer.create(132); buf.commit(4); marshal_StoryStreamClientEvent(buf, 0, value); return new Uint8Array(buf.array_buffer, 0, buf.size); }), ((data: Uint8Array) => unmarshal_StoryStreamServerEvent(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0)));
    }

    // HTTP Transport (alternative to WebSocket)
    public readonly http = {

    };
  }
  export interface IStoryStreamService_Servant
  {
    WatchStory(story_id: /*in*/bigint, stream: NPRPC.BidiStream<StoryStreamServerEvent, StoryStreamClientEvent>): void | Promise<void>;
  }
  export class _IStoryStreamService_Servant extends NPRPC.ObjectServant {
    public static _get_class(): string { return "grow_journal/grow_journal.StoryStreamService"; }
    public readonly get_class = () => { return _IStoryStreamService_Servant._get_class(); }
    public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
      _IStoryStreamService_Servant._dispatch(this, buf, remote_endpoint, from_parent);
    }
    public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
      _IStoryStreamService_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
    }
    static _dispatch(obj: _IStoryStreamService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
      // Read CallHeader directly
      const function_idx = buf.dv.getUint8(16 + 3);
      switch(function_idx) {
        default:
          NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
      }
    }
    static _dispatch_stream(obj: _IStoryStreamService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
      const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
      const function_idx = init.func_idx;
      const conn = NPRPC.rpc.get_connection(remote_endpoint);
      switch(function_idx) {
        case 0: {
          const ia = unmarshal_grow_journal_M17(buf, 48);
          (globalThis as any).__nprpc_debug?.stream_start({direction:'server',class_id:_IStoryStreamService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:init.interface_idx,func_idx:0,method_name:'WatchStory',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},stream_id:String(init.stream_id),stream_kind:'bidi',request_args:ia,request_bytes:buf.size});
          const stream = conn.stream_manager.create_bidi_stream(init.stream_id, ((value: StoryStreamServerEvent) => { const buf = NPRPC.FlatBuffer.create(140); buf.commit(12); marshal_StoryStreamServerEvent(buf, 0, value); return new Uint8Array(buf.array_buffer, 0, buf.size); }), ((data: Uint8Array) => unmarshal_StoryStreamClientEvent(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0)));
          NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
          void (async () => {
            try {
              await (obj as any).WatchStory(ia._1, stream);
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

    export class MediaService extends NPRPC.ObjectProxy {
      public static get servant_t(): new() => _IMediaService_Servant {
        return _IMediaService_Servant;
      }


      public async GetVideoDashManifest(asset_id: /*in*/bigint): Promise<string> {
        let interface_idx = (arguments.length == 1 ? 0 : arguments[arguments.length - 1]);
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(40);
        buf.commit(40);
        buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        // Write CallHeader directly
        buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
        buf.dv.setUint8(16 + 2, interface_idx);
        buf.dv.setUint8(16 + 3, 0);
        buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
        marshal_grow_journal_M17(buf, 32, {_1: asset_id});
        buf.write_len(buf.size);
        const __dbg_t0 = Date.now();
        const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IMediaService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:0,method_name:'GetVideoDashManifest',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},request_args:{asset_id:asset_id},request_bytes:buf.size});
        await NPRPC.rpc.call(this.endpoint, buf, this.timeout);
        let std_reply = NPRPC.handle_standart_reply(buf);
        if (std_reply == 1)        {
          grow_journal_throw_exception(buf);
        }
        if (std_reply != -1) {
          console.log("received an unusual reply for function with output arguments");
          throw new NPRPC.Exception("Unknown Error");
        }
        const out = unmarshal_grow_journal_M3(buf, 16);
        (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
        return out._1;
      }
      public async GetVideoDashSegmentRange(asset_id: /*in*/bigint, byte_offset: /*in*/bigint, byte_length: /*in*/bigint, representation: /*in*/string): Promise<NPRPC.StreamReader<binary>> {
        const interface_idx = (arguments.length == 4 ? 0 : arguments[arguments.length - 1]);
        const conn = NPRPC.rpc.get_connection(this.endpoint);
        const stream_id = conn.stream_manager.generate_stream_id();
        const buf = NPRPC.FlatBuffer.create();
        buf.prepare(208);
        buf.commit(80);
        buf.write_msg_id(NPRPC.impl.MessageId.StreamInitialization);
        buf.write_msg_type(NPRPC.impl.MessageType.Request);
        NPRPC.impl.marshal_StreamInit(buf, 16, {
          stream_id,
          poa_idx: this.data.poa_idx,
          interface_idx,
          object_id: this.data.object_id,
          func_idx: 1,
          stream_kind: NPRPC.impl.StreamKind.Server
        });
        marshal_grow_journal_M18(buf, 48, {_1: asset_id, _2: byte_offset, _3: byte_length, _4: representation});
        buf.write_len(buf.size);
        (globalThis as any).__nprpc_debug?.stream_start({direction:'client',class_id:_IMediaService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx,func_idx:1,method_name:'GetVideoDashSegmentRange',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:NPRPC.EndPoint.to_string(this.endpoint.type).replace('://','') as any},stream_id:String(stream_id),stream_kind:'server',request_args:{asset_id:asset_id,byte_offset:byte_offset,byte_length:byte_length,representation:representation},request_bytes:buf.size});
        return await NPRPC.rpc.open_server_stream(this.endpoint, buf, stream_id, this.timeout, ((data: Uint8Array) => NPRPC.unmarshal_typed_array(NPRPC.FlatBuffer.from_array_buffer(data.slice().buffer), 0, Uint8Array) as Uint8Array));
      }

      // HTTP Transport (alternative to WebSocket)
      public readonly http = {
        GetVideoDashManifest: async (asset_id: /*in*/bigint): Promise<string> => {
          const buf = NPRPC.FlatBuffer.create();
          buf.prepare(40);
          buf.commit(40);
          buf.write_msg_id(NPRPC.impl.MessageId.FunctionCall);
          buf.write_msg_type(NPRPC.impl.MessageType.Request);
          buf.dv.setUint16(16 + 0, this.data.poa_idx, true);
          buf.dv.setUint8(16 + 2, 0);
          buf.dv.setUint8(16 + 3, 0);
          buf.dv.setBigUint64(16 + 8, this.data.object_id, true);
          marshal_grow_journal_M17(buf, 32, {_1: asset_id});
          buf.write_len(buf.size);

          const __dbg_t0 = Date.now();
          const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'client',class_id:_IMediaService_Servant._get_class(),poa_idx:this.data.poa_idx,object_id:String(this.data.object_id),interface_idx:0,func_idx:0,method_name:'GetVideoDashManifest',endpoint:{hostname:this.endpoint.hostname,port:this.endpoint.port,transport:'http'},request_args:{asset_id:asset_id},request_bytes:buf.size});

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
          if (std_reply == 1) grow_journal_throw_exception(buf);
          if (std_reply != -1) throw new NPRPC.Exception("Unexpected reply");
          const out = unmarshal_grow_journal_M3(buf, 16);
          (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'success',duration_ms:Date.now()-__dbg_t0,response_bytes:buf.size,response_args:out});
          return out._1;
        }
      };
    }
    export interface IMediaService_Servant
    {
      GetVideoDashManifest(asset_id: /*in*/bigint): string;
      GetVideoDashSegmentRange(asset_id: /*in*/bigint, byte_offset: /*in*/bigint, byte_length: /*in*/bigint, representation: /*in*/string): AsyncIterable<binary> | Iterable<binary> | Promise<AsyncIterable<binary> | Iterable<binary>>;
    }
    export class _IMediaService_Servant extends NPRPC.ObjectServant {
      public static _get_class(): string { return "grow_journal/grow_journal.MediaService"; }
      public readonly get_class = () => { return _IMediaService_Servant._get_class(); }
      public readonly dispatch = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
        _IMediaService_Servant._dispatch(this, buf, remote_endpoint, from_parent);
      }
      public readonly dispatch_stream = (buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean) => {
        _IMediaService_Servant._dispatch_stream(this, buf, remote_endpoint, from_parent);
      }
      static _dispatch(obj: _IMediaService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
        // Read CallHeader directly
        const function_idx = buf.dv.getUint8(16 + 3);
        switch(function_idx) {
          case 0: {
            const ia = unmarshal_grow_journal_M17(buf, 32);
            const obuf = buf;
            obuf.consume(obuf.size);
            obuf.prepare(152);
            obuf.commit(24);
            let __ret_val: string = '';
            const __dbg_t0 = Date.now();
            const __dbg_id = (globalThis as any).__nprpc_debug?.call_start({direction:'server',class_id:_IMediaService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:0,func_idx:0,method_name:'GetVideoDashManifest',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},request_args:ia});
            try {
              __ret_val = (obj as any).GetVideoDashManifest(ia._1);
            }
            catch(e) {
              if (e instanceof NotFound) {
                const obuf = buf;
                obuf.consume(obuf.size);
                obuf.prepare(28);
                obuf.commit(28);
                const ex_data = {__ex_id: 0, msg: e.msg};
                marshal_NotFound(obuf, 16, ex_data);
                obuf.write_len(obuf.size);
                obuf.write_msg_id(NPRPC.impl.MessageId.Exception);
                obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
                (globalThis as any).__nprpc_debug?.call_end(__dbg_id,{status:'error',duration_ms:Date.now()-__dbg_t0,error:String(e)});
                return;
              }
              if (e instanceof ProcessingFailed) {
                const obuf = buf;
                obuf.consume(obuf.size);
                obuf.prepare(28);
                obuf.commit(28);
                const ex_data = {__ex_id: 2, msg: e.msg};
                marshal_ProcessingFailed(obuf, 16, ex_data);
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
            marshal_grow_journal_M3(obuf, 16, out_data);
            obuf.write_len(obuf.size);
            obuf.write_msg_id(NPRPC.impl.MessageId.BlockResponse);
            obuf.write_msg_type(NPRPC.impl.MessageType.Answer);
            break;
          }
          default:
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Error_UnknownFunctionIdx);
        }
      }
      static _dispatch_stream(obj: _IMediaService_Servant, buf: NPRPC.FlatBuffer, remote_endpoint: NPRPC.EndPoint, from_parent: boolean): void {
        const init = NPRPC.impl.unmarshal_StreamInit(buf, 16);
        const function_idx = init.func_idx;
        const conn = NPRPC.rpc.get_connection(remote_endpoint);
        switch(function_idx) {
          case 1: {
            const ia = unmarshal_grow_journal_M18(buf, 48);
            (globalThis as any).__nprpc_debug?.stream_start({direction:'server',class_id:_IMediaService_Servant._get_class(),poa_idx:obj.poa.index,object_id:String(obj.oid),interface_idx:init.interface_idx,func_idx:1,method_name:'GetVideoDashSegmentRange',endpoint:{hostname:remote_endpoint.hostname,port:remote_endpoint.port,transport:NPRPC.EndPoint.to_string(remote_endpoint.type).replace('://','') as any},stream_id:String(init.stream_id),stream_kind:'server',request_args:ia,request_bytes:buf.size});
            const writer = conn.stream_manager.create_writer(init.stream_id, ((value: Uint8Array) => { const buf = NPRPC.FlatBuffer.create(8 + value.byteLength); buf.commit(8); NPRPC.marshal_typed_array(buf, 0, value, 1, 1); return new Uint8Array(buf.array_buffer, 0, buf.size); }));
            NPRPC.make_simple_answer(buf, NPRPC.impl.MessageId.Success);
            void (async () => {
              try {
                const source = await (obj as any).GetVideoDashSegmentRange(ia._1, ia._2, ia._3, ia._4);
                for await (const chunk of source as any) {
                  await writer.write(chunk);
                }
                writer.close();
              } catch (e) {
                writer.abort();
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


      function grow_journal_throw_exception(buf: NPRPC.FlatBuffer): void { 
        switch( buf.read_exception_number() ) {
          case 0:
          {
            let ex_obj = unmarshal_NotFound(buf, 16 + 4);
            throw new NotFound(ex_obj.msg);
          }
          case 1:
          {
            let ex_obj = unmarshal_UploadRejected(buf, 16 + 4);
            throw new UploadRejected(ex_obj.msg);
          }
          case 2:
          {
            let ex_obj = unmarshal_ProcessingFailed(buf, 16 + 4);
            throw new ProcessingFailed(ex_obj.msg);
          }
          case 3:
          {
            let ex_obj = unmarshal_PermissionDenied(buf, 16 + 4);
            throw new PermissionDenied(ex_obj.msg);
          }
          default:
            throw "unknown rpc exception";
        }
      }
export interface grow_journal_M1 {
  _1: number/*u32*/;
  _2: number/*u32*/;
    }

    export function marshal_grow_journal_M1(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M1): void {
    buf.dv.setUint32(offset + 0, data._1, true);
    buf.dv.setUint32(offset + 4, data._2, true);
  }

  export function unmarshal_grow_journal_M1(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M1 {
  const result = {} as grow_journal_M1;
  result._1 = buf.dv.getUint32(offset + 0, true);
  result._2 = buf.dv.getUint32(offset + 4, true);
  return result;
}

export interface grow_journal_M2 {
  _1: StoryPage;
}

export function marshal_grow_journal_M2(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M2): void {
marshal_StoryPage(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M2(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M2 {
const result = {} as grow_journal_M2;
result._1 = unmarshal_StoryPage(buf, offset + 0);
return result;
}

export interface grow_journal_M3 {
  _1: string;
}

export function marshal_grow_journal_M3(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M3): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M3(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M3 {
const result = {} as grow_journal_M3;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
return result;
}

export interface grow_journal_M4 {
  _1: StoryDetail;
}

export function marshal_grow_journal_M4(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M4): void {
marshal_StoryDetail(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M4(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M4 {
const result = {} as grow_journal_M4;
result._1 = unmarshal_StoryDetail(buf, offset + 0);
return result;
}

export interface grow_journal_M5 {
  _1: bigint/*u64*/;
  _2: number/*u32*/;
  _3: number/*u32*/;
}

export function marshal_grow_journal_M5(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M5): void {
buf.dv.setBigUint64(offset + 0, data._1, true);
buf.dv.setUint32(offset + 8, data._2, true);
buf.dv.setUint32(offset + 12, data._3, true);
}

export function unmarshal_grow_journal_M5(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M5 {
const result = {} as grow_journal_M5;
result._1 = buf.dv.getBigUint64(offset + 0, true);
result._2 = buf.dv.getUint32(offset + 8, true);
result._3 = buf.dv.getUint32(offset + 12, true);
return result;
}

export interface grow_journal_M6 {
  _1: UpdatePage;
}

export function marshal_grow_journal_M6(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M6): void {
marshal_UpdatePage(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M6(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M6 {
const result = {} as grow_journal_M6;
result._1 = unmarshal_UpdatePage(buf, offset + 0);
return result;
}

export interface grow_journal_M7 {
  _1: CreateStoryRequest;
}

export function marshal_grow_journal_M7(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M7): void {
marshal_CreateStoryRequest(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M7(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M7 {
const result = {} as grow_journal_M7;
result._1 = unmarshal_CreateStoryRequest(buf, offset + 0);
return result;
}

export interface grow_journal_M8 {
  _1: CreateUpdateRequest;
}

export function marshal_grow_journal_M8(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M8): void {
marshal_CreateUpdateRequest(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M8(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M8 {
const result = {} as grow_journal_M8;
result._1 = unmarshal_CreateUpdateRequest(buf, offset + 0);
return result;
}

export interface grow_journal_M9 {
  _1: StoryUpdate;
}

export function marshal_grow_journal_M9(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M9): void {
marshal_StoryUpdate(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M9(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M9 {
const result = {} as grow_journal_M9;
result._1 = unmarshal_StoryUpdate(buf, offset + 0);
return result;
}

export interface grow_journal_M10 {
  _1: string;
  _2: bigint/*u64*/;
}

export function marshal_grow_journal_M10(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M10): void {
NPRPC.marshal_string(buf, offset + 0, data._1);
buf.dv.setBigUint64(offset + 8, data._2, true);
}

export function unmarshal_grow_journal_M10(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M10 {
const result = {} as grow_journal_M10;
result._1 = NPRPC.unmarshal_string(buf, offset + 0);
result._2 = buf.dv.getBigUint64(offset + 8, true);
return result;
}

export interface grow_journal_M11 {
  _1: boolean/*boolean*/;
}

export function marshal_grow_journal_M11(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M11): void {
buf.dv.setUint8(offset + 0, data._1 ? 1 : 0);
}

export function unmarshal_grow_journal_M11(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M11 {
const result = {} as grow_journal_M11;
result._1 = buf.dv.getUint8(offset + 0) !== 0;
return result;
}

export interface grow_journal_M12 {
  _1: bigint/*u64*/;
  _2: bigint/*u64*/;
  _3: string;
  _4: string;
}

export function marshal_grow_journal_M12(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M12): void {
buf.dv.setBigUint64(offset + 0, data._1, true);
buf.dv.setBigUint64(offset + 8, data._2, true);
NPRPC.marshal_string(buf, offset + 16, data._3);
NPRPC.marshal_string(buf, offset + 24, data._4);
}

export function unmarshal_grow_journal_M12(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M12 {
const result = {} as grow_journal_M12;
result._1 = buf.dv.getBigUint64(offset + 0, true);
result._2 = buf.dv.getBigUint64(offset + 8, true);
result._3 = NPRPC.unmarshal_string(buf, offset + 16);
result._4 = NPRPC.unmarshal_string(buf, offset + 24);
return result;
}

export interface grow_journal_M13 {
  _1: UploadTarget;
}

export function marshal_grow_journal_M13(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M13): void {
marshal_UploadTarget(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M13(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M13 {
const result = {} as grow_journal_M13;
result._1 = unmarshal_UploadTarget(buf, offset + 0);
return result;
}

export interface grow_journal_M14 {
  _1: bigint/*u64*/;
  _2: bigint/*u64*/;
}

export function marshal_grow_journal_M14(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M14): void {
buf.dv.setBigUint64(offset + 0, data._1, true);
buf.dv.setBigUint64(offset + 8, data._2, true);
}

export function unmarshal_grow_journal_M14(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M14 {
const result = {} as grow_journal_M14;
result._1 = buf.dv.getBigUint64(offset + 0, true);
result._2 = buf.dv.getBigUint64(offset + 8, true);
return result;
}

export interface grow_journal_M15 {
  _1: bigint/*u64*/;
  _2: string;
}

export function marshal_grow_journal_M15(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M15): void {
buf.dv.setBigUint64(offset + 0, data._1, true);
NPRPC.marshal_string(buf, offset + 8, data._2);
}

export function unmarshal_grow_journal_M15(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M15 {
const result = {} as grow_journal_M15;
result._1 = buf.dv.getBigUint64(offset + 0, true);
result._2 = NPRPC.unmarshal_string(buf, offset + 8);
return result;
}

export interface grow_journal_M16 {
  _1: UploadProgress;
}

export function marshal_grow_journal_M16(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M16): void {
marshal_UploadProgress(buf, offset + 0, data._1);
}

export function unmarshal_grow_journal_M16(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M16 {
const result = {} as grow_journal_M16;
result._1 = unmarshal_UploadProgress(buf, offset + 0);
return result;
}

export interface grow_journal_M17 {
  _1: bigint/*u64*/;
}

export function marshal_grow_journal_M17(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M17): void {
buf.dv.setBigUint64(offset + 0, data._1, true);
}

export function unmarshal_grow_journal_M17(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M17 {
const result = {} as grow_journal_M17;
result._1 = buf.dv.getBigUint64(offset + 0, true);
return result;
}

export interface grow_journal_M18 {
  _1: bigint/*u64*/;
  _2: bigint/*u64*/;
  _3: bigint/*u64*/;
  _4: string;
}

export function marshal_grow_journal_M18(buf: NPRPC.FlatBuffer, offset: number, data: grow_journal_M18): void {
buf.dv.setBigUint64(offset + 0, data._1, true);
buf.dv.setBigUint64(offset + 8, data._2, true);
buf.dv.setBigUint64(offset + 16, data._3, true);
NPRPC.marshal_string(buf, offset + 24, data._4);
}

export function unmarshal_grow_journal_M18(buf: NPRPC.FlatBuffer, offset: number): grow_journal_M18 {
const result = {} as grow_journal_M18;
result._1 = buf.dv.getBigUint64(offset + 0, true);
result._2 = buf.dv.getBigUint64(offset + 8, true);
result._3 = buf.dv.getBigUint64(offset + 16, true);
result._4 = NPRPC.unmarshal_string(buf, offset + 24);
return result;
}

