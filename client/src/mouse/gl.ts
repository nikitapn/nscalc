// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

let gl: WebGL2RenderingContext = null;
let the_canvas: HTMLCanvasElement = null;

export const init = (canvas: HTMLCanvasElement): void => {
	the_canvas = canvas;
  gl = canvas.getContext("webgl2");
	if (gl === null) {
		throw "Unable to initialize WebGL. Your browser or machine may not support it.";
	}
}

export { the_canvas, gl }
