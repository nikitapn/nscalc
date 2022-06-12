import { Updater, writable } from 'svelte/store'
import { chat, poa } from './rpc'
import * as NPRPC from './nprpc';
import * as npkcalc from './npkcalc'

export interface Message {
  date: Date;
  str: string;
  sent_by_me: boolean;
}

export let chat_messages = writable(new Array<Message>()); 

class ChatParticipantImpl extends npkcalc._IChatParticipant_Servant implements npkcalc.IChatParticipant_Servant {
  OnMessage(msg: npkcalc.Flat_npkcalc.ChatMessage_Direct): void {
    chat_messages.update(updater => {updater.push({date: new Date(msg.timestamp*60*1000), str: msg.str, sent_by_me: false}); return updater;} );
  }
}

export const connect_to_room = async () => {
  const oid = poa.activate_object(new ChatParticipantImpl());
  chat.Connect(oid); 
}

let i = 0;
(document as any).send_test = async () => {
  setTimeout(async () => {
    chat.Send({timestamp: 0, str: "test_" + (i++)});
    (document as any).send_test();
  }, 250);
}
