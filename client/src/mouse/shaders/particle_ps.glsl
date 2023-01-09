#version 300 es
precision mediump float;

in vec2 v_texture_coord;

uniform vec4 u_color;
uniform sampler2D u_sampler;

out vec4 fragColor;

void main() {
    float alpha = texture(u_sampler, v_texture_coord).w;
    vec4 color;
    color.xyz = u_color.xyz;
    color.w = u_color.w * alpha;
    fragColor = color;
}