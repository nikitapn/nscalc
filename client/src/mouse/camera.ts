// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import { vec2, vec3, vec4, mat4 } from 'gl-matrix';
import { the_canvas } from 'mouse/gl';
import { math, Ray } from 'mouse/math';

// right-handed coordinate system

export class Camera {
	position: vec3;
	right: vec3;
	up: vec3;
	look: vec3;
	view: mat4;
	proj: mat4;

	constructor() {
		this.view = mat4.create();
		this.position = [0, 0, 1000];
		
		this.look = vec3.clone(this.position);
		vec3.negate(this.look, this.look);
		vec3.normalize(this.look, this.look);
		
		this.up = [0.0, 1.0, 0.0];
		
		this.right = vec3.create();
		vec3.cross(this.right, this.up, this.look);

		// perspective
		const fieldOfView = 45 * Math.PI / 180;
		const aspect = the_canvas.clientWidth / the_canvas.clientHeight;
		const zNear = 0.01;
		const zFar = 100000.0;
		
		this.proj = mat4.create();
		mat4.perspective(this.proj, fieldOfView, aspect, zNear, zFar);
		
		this.update();
	}

	rotate_yaw_pitch(yaw: number, pitch: number) {
		let r = mat4.create();
		mat4.fromRotation(r, -yaw, this.right);
		vec3.transformMat4(this.look, this.look, r);
		vec3.transformMat4(this.up, this.up, r);

		r = mat4.create();
		mat4.fromRotation(r, -pitch, this.up);
		vec3.transformMat4(this.right, this.right, r);
		vec3.transformMat4(this.look, this.look, r);
	}

	rotate_roll(roll: number) {
		let r = mat4.create();
		mat4.fromRotation(r, roll, this.look);
		vec3.transformMat4(this.up, this.up, r);
		vec3.transformMat4(this.right, this.right, r);
	}

	move_dx(dx: number) {
		vec3.scaleAndAdd(this.position, this.position, this.right, dx);
	}

	move_dy(dy: number) {
		vec3.scaleAndAdd(this.position, this.position, this.up, dy);
	}

	move_dz(dz: number) {
		vec3.scaleAndAdd(this.position, this.position, this.look, dz);
	}

	worldMatrix() {
		let world = mat4.create();

		world[0] = this.right[0];
		world[1] = this.right[1];
		world[2] = this.right[2];

		world[4] = this.up[0];
		world[5] = this.up[1];
		world[6] = this.up[2];

		world[8] = this.look[0];
		world[9] = this.look[1];
		world[10] = this.look[2];

		world[12] = -this.position[0];
		world[13] = -this.position[1];
		world[14] = -this.position[2];

		return world;
	}

	update() {
		this.view[0] = this.right[0];
		this.view[1] = this.up[0];
		this.view[2] = this.look[0];
		this.view[4] = this.right[1];
		this.view[5] = this.up[1];
		this.view[6] = this.look[1];
		this.view[8] = this.right[2];
		this.view[9] = this.up[2];
		this.view[10] = this.look[2];

		// to do: find the error with my camera
		this.view[12] = vec3.dot(this.position, this.right); 
		this.view[13] = vec3.dot(this.position, this.up);
		this.view[14] = vec3.dot(this.position, this.look);
	}

	rotation_matrix() {
		return mat4.fromValues(
			this.view[0], this.view[4], this.view[8], 0,
			this.view[1], this.view[5], this.view[9], 0,
			this.view[2], this.view[6], this.view[10], 0,
			0, 0, 0, 1
		);
	}
	
	screen_to_projection_window(screen_x: number, screen_y: number): vec3 {
		return [ 
			(2.0 * screen_x / the_canvas.clientWidth - 1) / this.proj[0],
			(-2.0 * screen_y / the_canvas.clientHeight + 1) / this.proj[5],
			1.0
		];
	}

	screen_to_xy_plane(screen_x: number, screen_y: number): vec2 {
		let inv = mat4.create();
		mat4.invert(inv, this.view);

		let ray = new Ray([0, 0, 0], this.screen_to_projection_window(screen_x, screen_y)); 
		
		let origin = vec4.fromValues(ray.origin[0], ray.origin[1], ray.origin[2], 1.0);
		let dir = vec4.fromValues(ray.direction[0], ray.direction[1], 1.0, 0.0);

		vec4.transformMat4(origin, origin, inv);
		vec4.transformMat4(dir, dir, inv);

		ray.origin = [origin[0], origin[1], origin[2]];
		ray.direction = [dir[0], dir[1], dir[2]];

		return ray.intersection_XY();
	}

}

export let camera: Camera = null;
export const init = (): void => {
	camera = new Camera();
}