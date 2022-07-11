import * as React from 'react'
import * as npkcalc from 'rpc/npkcalc'
import { TabPane, Menu, MenuButton } from 'gui/view/tab_menu'
import { View_NutrientSolutions } from 'gui/view/view_solutions'
import { View_Fertilizers } from 'gui/view/view_fertilizers'
import { View_Calculator } from 'gui/view/view_calculator'
import { View_Links } from 'gui/view/view_links'
import { View_Chat } from 'gui/view/view_chat'
import { LoginPanel } from 'gui/misc/LoginPanel'
import { observer } from 'mobx-react'
import { alarms, Alarm } from 'misc/alarm'
import global from 'misc/global'

@observer
class AlarmEntry extends React.Component<{ alarm: Alarm }, {}> {
	alarm: Alarm;

	handle_onClick() {
		if (this.props.alarm.confirmed) return;
		this.props.alarm.confirmed = true;
		
		let idx = alarms.findIndex(x => this.props.alarm === x);
		alarms.splice(idx, 1);

		for (let i = 0; i < alarms.length; ++i) {
			if (alarms[i].confirmed) {
				if (i < 8) alarms.splice(i, 0, this.props.alarm);
				return
			}
		}

		alarms.push(this.props.alarm);
	}

	render() : JSX.Element {
		let style;
		switch(this.props.alarm.type) {
				case npkcalc.AlarmType.Info: style = "alarm alarm_info"; break;
				case npkcalc.AlarmType.Warning: style = "alarm alarm_warning"; break;
				case npkcalc.AlarmType.Critical: style = "alarm alarm_critical"; break;
		}
		if (this.props.alarm.confirmed) style += " alarm_confirmed";
		return (
			<div className={style} onClick={this.handle_onClick.bind(this)}>
				<img className="alarm_bell" src={global.icons.bell}/>
				<div className="alarm_entry_text">{this.props.alarm.msg}</div>
			</div>
		);
	}
} 

@observer
class Alarms extends React.Component {
	render() : JSX.Element {
		return (
			<div className="alarms_bar">
				{
					alarms.map((alarm: Alarm) => {
						return <AlarmEntry key={alarm.id} alarm={alarm}/>
					})
				}
			</div>
		);
	}
}

export class AppReact extends TabPane {
	constructor(props:any) {
		super(props);
		this.add_view(View_Calculator, "CALCULATOR", true);
		this.add_view(View_NutrientSolutions, "SOLUTIONS", false);
		this.add_view(View_Fertilizers, "FERTILIZERS", false);
		this.add_view(View_Links, "LINKS", false);
		this.add_view(View_Chat, "CHAT", false);
	}
	componentDidMount() {
		super.componentDidMount();
		let this_ = this;
		document.addEventListener("new_calculation", () => {window.scrollTo(0, 0); this_.select_view(0)});
	}
	render() {
		let { view_builder } = this.state;
		if (view_builder.length === 0) return (<div key="nc"></div>);
		return (
			<div key="hc">
				<div style={{display: 'flex'}}>
				<Menu className={this.props.menu_className} ref={this.menu} active_index={this.active_index_after_adding} items=
				{
					view_builder.map((x, index) => {
					return {
						name: x.tab_name, 
						ref: React.createRef<MenuButton>(),
						onclick: () => { this.handle_select_view(this.views[index]) },
						oncloseclick: () => { this.remove_view(index) }
					};})
				}/>
				<LoginPanel className="wlogin"/>
			</div>
				<div className="main">
					{
						view_builder.map((x, index) => { return (x.create(index)) })
					}
				</div>
			<Alarms/>
			</div>
		);
	}
}