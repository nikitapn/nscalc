import * as React from 'react'
import { View } from './view'

import Chat from './gui/chat/Chat.svelte'

export class View_Chat extends View {
  ref = React.createRef<any>();
  chat: any;

  componentDidMount() {
    this.chat = new Chat({
      target: this.ref.current,
      props: {}
    });
  }
  
  paint(): JSX.Element {
    return (<div ref={this.ref}></div>);
  }
}

