// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

import * as React from 'react'
import { View } from './view'

export class View_Books extends View {

	paint() : JSX.Element {
		return (<div style={{fontSize: "36px", justifyContent: "center", alignContent: "center"}}>
			<div>
				<a href="/calc/books/kudra_2.pdf">kudra_2.pdf</a>
			</div>
			<div>
				<a href="/calc/books/NUTRIENT_SOLUTIONS_FOR_GREENHOUSE_CROPS.pdf">NUTRIENT SOLUTIONS FOR GREENHOUSE CROPS.pdf</a>
			</div>
			<div>
				<a href="/calc/books/SQM-Crop_Kit_Tomato_L-EN.pdf">SQM-Crop_Kit_Tomato_L-EN.pdf</a>
			</div>
			<div>
				<a href="/calc/books/SQM-Crop_Kit_Tomato_L-RU.pdf">SQM-Crop_Kit_Tomato_L-RU.pdf</a>
			</div>
			<div>
				<a href="/calc/books/tomato.pdf">перевод точки роста помидор.pdf</a>
			</div>
			<div>
				<a href="/calc/books/mir_tomata.djvu">Ахатов А.К., Мир томата глазами фитопатолога, 2010.djvu</a>
			</div>
		</div>);
	}
}