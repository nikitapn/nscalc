// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import { vec2, vec3, mat4 } from 'gl-matrix';

export class Footstep {
  world: mat4;
  ttl: number;
  color: vec3;

  constructor(color: vec3, pos: vec2, dir: vec2) {
    this.color = color;
    this.ttl = 128;
    
    let angle = Math.atan(dir[1] / dir[0]);

    if (dir[0] > 0 && dir[1] >= 0) {}
    else if (dir[0] > 0 && dir[1] < 0) angle += 2 * Math.PI;
    else if (dir[0] < 0) angle += Math.PI;

    let r = mat4.create();
    mat4.fromZRotation(r, angle + Math.PI / 2.0); // because my picture already rotated by 90 degrees
    
    let t = mat4.create();
    mat4.translate(t, t, [-pos[0], -pos[1], 0]);

    let world = mat4.create();
    mat4.scale(world, world, [ 50, 52, 1 ]);
    mat4.multiply(world, r, world);
    mat4.multiply(world, t, world);

    this.world = world;
  }
}

export let footsteps = new Array<Footstep>();