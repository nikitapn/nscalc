// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as React from 'react'
import { View } from './view'

export class View_Links extends View {

	paint() : JSX.Element {
		return (<div className="links_content">
			<a target="_blank" rel="noopener noreferrer" href="https://charts.hydrosoft.uk">Cool charts</a>
			<br/>
			<a target="_blank" rel="noopener noreferrer" href="https://www.nouryon.com/globalassets/inriver/resources/article-micronutrients-nutrient-solutions-for-greenhouse-crops-global-en.pdf">The booklet</a>
		</div>);
	}
}