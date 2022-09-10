// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import { gl } from 'mouse/gl';
import { GLResourses } from "./texture"
import { quad_vertex_buffer, quad_normal_buffer, quad_index_buffer, quad_texture_coords_buffer } from './primitives';
import { Camera } from './camera';
import { Footstep } from 'mouse/footstep';
import { footsteps_texture } from 'mouse/assets';

import { shaders } from './shaders'

export class Renderer {
	private width: number;
	private height: number;

	footsteps: Footstep[];

	private render_footsteps(camera: Camera) {
		let footsteps = this.footsteps;
		if (footsteps.length === 0) return;

		let pinfo = shaders.footstep.use();

		gl.uniformMatrix4fv(pinfo.uniform_loc.u_proj, false, camera.proj);
		gl.uniformMatrix4fv(pinfo.uniform_loc.u_view, false, camera.view);

		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(pinfo.uniform_loc.u_sampler, 0);

		let ix_vertex = pinfo.attr_loc.in_position;
		let ix_texture = pinfo.attr_loc.in_texture_coord;
		let ix_footstep_age = pinfo.uniform_loc.foot_age;
		let ix_footstep_color = pinfo.uniform_loc.foot_color;

		GLResourses.bindTexture(footsteps_texture);

		gl.bindBuffer(gl.ARRAY_BUFFER, quad_vertex_buffer);
		gl.vertexAttribPointer(ix_vertex, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(ix_vertex);

		gl.bindBuffer(gl.ARRAY_BUFFER, quad_texture_coords_buffer);
		gl.vertexAttribPointer(ix_texture, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(ix_texture);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quad_index_buffer);

		let ix_world = pinfo.uniform_loc.u_world;
		this.footsteps.forEach((footstep: Footstep) => {
			gl.uniformMatrix4fv(ix_world, false, footstep.world);
			gl.uniform1f(ix_footstep_age, footstep.ttl);
			gl.uniform3fv(ix_footstep_color, footstep.color);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		});
	}

	public render(camera: Camera) {
		gl.viewport(0, 0, this.width, this.height);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		// render footsteps
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
		this.render_footsteps(camera);
	}

	constructor(width: number, height: number, footsteps: Array<Footstep>) {
		this.width = width;
		this.height = height;
		this.footsteps = footsteps;
	}
}