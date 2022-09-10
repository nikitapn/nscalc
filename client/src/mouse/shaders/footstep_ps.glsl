#version 300 es
precision mediump float;

in vec2 v_texture_coord;

uniform sampler2D u_sampler;
uniform float foot_age;
uniform vec3 foot_color;

out vec4 fragColor;

void main() {
    vec4 color = texture(u_sampler, v_texture_coord);
    color.xyz = foot_color;
    color.w *= foot_age / 128.0;
    fragColor = color;
}