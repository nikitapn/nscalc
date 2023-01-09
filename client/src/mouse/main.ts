// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import { vec2, vec3 } from 'gl-matrix'
import { the_canvas, init as init_gl } from 'mouse/gl';
import { Renderer } from 'mouse/renderer'
import { Footstep, footsteps } from 'mouse/footstep';
import { firework_system } from 'mouse/fireworks';
import { init as init_primitives } from 'mouse/primitives'
import { init as init_camera, camera } from 'mouse/camera';
import { init as init_assets } from 'mouse/assets';
import { init as init_shaders} from 'mouse/shaders';
import { Timer } from 'mouse/timer'
import { calculator } from 'rpc/rpc';


export let renderer: Renderer = null;

interface Color {
	x: number;
	y: number;
	z: number;
}

let footstep_color: Color = null;
let timer: Timer;

export const init = (canvas: HTMLCanvasElement) => {
	init_gl(canvas);
	init_shaders();
	init_primitives();
	init_camera();
	init_assets();

	footstep_color = { x: Math.random(), y: Math.random(), z: Math.random() };

	renderer = new Renderer(
		the_canvas.width, 
		the_canvas.height, 
		footsteps, 
		firework_system.fireworks
	);

	timer = new Timer();


	document.addEventListener("mousemove", on_mouse_move);
	//setTimeout(tick, 30);
	the_loop();
}

let stop = true;


let t = 0;
const the_loop = (): void => {
	timer.update();

	if (t > 16) firework_system.stop = true;
	firework_system.update(timer);
	
	renderer.render(camera);
	requestAnimationFrame(the_loop);
	//if (!stop) requestAnimationFrame(the_loop);
	t += timer.dt;
}

const tick = (): void => {
	setTimeout(tick, 30);

	let k = footsteps.length;
	
	if (k === 0) {
		stop = true;
		return;
	}
	
	for (let i = 0; i < k; ++i) {
		if (--footsteps[i].ttl == 0) {
			if (k <= footsteps.length) {
				[ footsteps[i], footsteps[k - 1] ] =  [ footsteps[k - 1], footsteps[i] ];
			}
			k--;
		}
	}

	if (k != footsteps.length) footsteps.splice(k);

	if (stop == true) {
		stop = false;
		requestAnimationFrame(the_loop);
	}
}

let cnt = 0;
let prev_pos: vec2 = [0, 0];
let footstep_cnt = 0;
const on_mouse_move = (ev: MouseEvent) => {
	if (cnt++ === 0) {
		prev_pos = camera.screen_to_xy_plane(ev.clientX, ev.clientY);
		return;
	}

	if (cnt % 32 !== 0) return;

	let pos = camera.screen_to_xy_plane(ev.clientX, ev.clientY);
	let dir = vec2.fromValues(pos[0] - prev_pos[0], pos[1] - prev_pos[1]);

	let distance = vec2.distance(prev_pos, pos);
	if (distance >= 128) {
		vec2.normalize(dir, dir);
		dir[0] *= 64;
		dir[1] *= 64;
		while (distance - 64 > 0) {
			distance -= 64;
			vec2.add(prev_pos, prev_pos, dir);
			//footsteps.push(new Footstep([1, 0, 0], footstep_cnt++, prev_pos, dir));
			calculator.SendFootstep({ 
				color: footstep_color,
				idx: footstep_cnt++,
				pos: {x: prev_pos[0], y: prev_pos[1]}, 
				dir: {x: dir[0], y: dir[1]}
			});
		}
	} else{
		//footsteps.push(new Footstep([1, 0, 0], footstep_cnt++, pos, dir));
		calculator.SendFootstep({ 
			color: footstep_color, 
			idx: footstep_cnt++,
			pos: {x: pos[0], y: pos[1]}, 
			dir: {x: dir[0], y: dir[1]}
		});
	}
	prev_pos = pos;
}