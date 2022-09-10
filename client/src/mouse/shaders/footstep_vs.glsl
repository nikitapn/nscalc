#version 300 es
precision mediump float;

in vec3 in_position;
in vec2 in_texture_coord;

uniform mat4 u_world;
uniform mat4 u_view;
uniform mat4 u_proj;

out vec2 v_texture_coord;

void main() {
	v_texture_coord = in_texture_coord;
	gl_Position = u_proj * u_view * u_world * vec4(in_position, 1.0);
}