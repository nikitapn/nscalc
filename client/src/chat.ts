import { Updater, writable } from 'svelte/store'
import { chat, poa } from './rpc'
import * as NPRPC from './nprpc';
import * as npkcalc from './npkcalc'

export interface Message {
  date: number;
  str: string;
}

export let chat_messages = writable(new Array<Message>()); 

class ChatListenerImpl extends npkcalc._IChatListener_Servant implements npkcalc.IChatListener_Servant {
  OnMessage(msg: npkcalc.Flat_npkcalc.ChatMessage_Direct): void {
    chat_messages.update(updater => {updater.push({date: msg.date, str: msg.str}); return updater;} );
  }
}

export const connect_to_room = async () => {
  const oid = poa.activate_object(new ChatListenerImpl());
  chat.Connect(oid); 
}