<svelte:options accessors/>

<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { Message, chat_messages } from 'misc/chat'
	import { chat } from 'rpc/rpc'
	import ChatMessage from './ChatMessage.svelte';
	import * as nscalc from 'rpc/nscalc'
	import { onMount } from 'svelte';

	let text;
	let input_str = "";
	let list: HTMLDivElement;

	export const onSend = () => {
		if (input_str.length == 0) return;
		chat.Send({timestamp: 0, str: input_str, attachment: {
			type: 0,
			name: input_str,
			data: [1, 2 , 3, 4] 
		}
	});
		chat_messages.update(ar => {ar.push({date: new Date(), str: input_str, sent_by_me: true}); return ar;})
		input_str = "";
		text.focus();
	}

	export const set_focus = () => {
		text.focus();
	}

	let unsubscribe = chat_messages.subscribe(() => {
		setTimeout(() => list.scrollTo(0, list.scrollHeight), 0);
	});

//	onMount(async () => {});

const on_paste = (evt) => {
	// Get the data of clipboard
  const clipboardItems = evt.clipboardData.items;
  const items = [].slice.call(clipboardItems).filter(function (item) {
		// Filter the image items only
		return item.type.indexOf('image') !== -1;
	});

	if (items.length === 0) {
		 return;
  }

  const item = items[0];
  // Get the blob of image
  const blob = item.getAsFile();
};
	

</script>

<style>
	.chat {
		margin: 40px;
		border-radius: 20px;
		padding-top: 1%;
		background-image: linear-gradient(rgb(249, 199, 142), rgb(5, 210, 179));
		width: 50%;

		scrollbar-width: initial;
		scroll-behavior: smooth;
		scrollbar-color: 'red';
		scroll-margin: 100px;
		scrollbar-arrow-color: blue;
		scrollbar-width: 100px;
		scrollbar-base-color: blueviolet;
	}

	.card-body {
		overflow-x: hidden;
		padding: 0;
		position: relative;
	}

	.direct-chat-messages {
		-webkit-transform: translate(0, 0);
		transform: translate(0, 0);
		height: 400px;
		overflow: auto;
		padding: 10px;
	
		transition: -webkit-transform .5s ease-in-out;
		transition: transform .5s ease-in-out;
		transition: transform .5s ease-in-out, -webkit-transform .5s ease-in-out;

		scrollbar-width: initial;
		scroll-behavior: smooth;
		scrollbar-color: 'red';
		scroll-margin: 100px;
		scrollbar-arrow-color: blue;
		scrollbar-width: 100px;
		scrollbar-base-color: blueviolet;
	}

	.controls {
		position: relative;
		padding: 1%;
		height: 50px;
	}

	.Absolute-Center {
  margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;
}

	.contacts-img {
		border-radius: 50%;
		width: 40px;
		height: 40px;
	}
	.contacts-name {
		margin-left: 15px;
		font-weight: 600;
	}

	:global(.vcentered) {
  	position: absolute;
  	top: 50%;
  	-webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
	}

  *
    :global(.shaped-outlined
      .mdc-notched-outline
      .mdc-notched-outline__leading) {
    border-radius: 28px 0 0 28px;
    width: 28px;
  }
  *
    :global(.shaped-outlined
      .mdc-notched-outline
      .mdc-notched-outline__trailing) {
    border-radius: 0 28px 28px 0;
  }
  * :global(.shaped-outlined .mdc-notched-outline .mdc-notched-outline__notch) {
    max-width: calc(100% - 28px * 2);
  }
  *
    :global(.shaped-outlined.mdc-text-field--with-leading-icon:not(.mdc-text-field--label-floating)
      .mdc-floating-label) {
    left: 16px;
  }
  * :global(.shaped-outlined + .mdc-text-field-helper-line) {
    padding-left: 32px;
    padding-right: 28px;
  }
</style>

<div class="chat">
	<div class="card-body">
		<div bind:this={list} class="direct-chat-messages">
			{#each $chat_messages as msg}
				<ChatMessage msg={msg}/>
			{/each}
		</div>
	</div>
	<div>
		<div class="controls">
			<Textfield style="float:left;width:100%;" 
				helperLine$style="width:100%;" 
				class="shaped-outlined vcentered" 
				variant="outlined" 
				bind:this={text} 
				bind:value={input_str} 
				on:paste={on_paste}
				label="Type a message..."/>
			<!--<Button class="vcentered" style="float:right;" on:click={onSend} variant="raised">
				<Label>Send</Label>
			</Button>-->
		</div>
	</div>
</div>