// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import { vec2, vec4, mat4 } from 'gl-matrix';

export class Particle {
  position: vec2;
  velocity: vec2;
  color: vec4;
  ttl: number;
  world: mat4;
  alpha: number;

  constructor(position: vec2, velocity: vec2, color: vec4) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.alpha = color[3];
    this.world = this.get_world();
  }

  get_world(): mat4 {
    let t = mat4.create();
    mat4.translate(t, t, [-this.position[0], -this.position[1], 0]);

    let world = mat4.create();
    mat4.scale(world, world, [ 14, 14, 1 ]);
    mat4.multiply(world, t, world);

    return world;
  }

  update(dt: number, acceleration: vec2, k_alpha: number = 1.0) {
    let tmp = vec2.create();

    vec2.mul(tmp, acceleration, [dt, dt]);
    vec2.add(this.velocity, this.velocity, tmp);

    vec2.mul(tmp, this.velocity, [dt, dt]);
    vec2.add(this.position, this.position, tmp);

    this.world = this.get_world();
    this.color[3] = this.alpha * k_alpha;
  }
}