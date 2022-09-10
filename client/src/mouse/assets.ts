// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import { Texture, GLResourses } from 'mouse/texture'

export let footsteps_texture: Texture = null;
export const init = () => {
	footsteps_texture = GLResourses.loadTexture('img/footsteps.png');
}

