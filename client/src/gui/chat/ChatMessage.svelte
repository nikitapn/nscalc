<script lang="ts">
	import { Message } from 'misc/chat';

	export let msg: Message;
    //export let nameChatPartner;
    //export let profilePicChatPartner;
    //export let nameMe;
    //export let profilePicMe;
		//export let message;
    //export let timestamp;		
	  //export let timeRead;
		
		// This should use timestamp, but its simplified for the demo.
		//export let isToday;
	const format_date = (date: Date) => {
		return date.toLocaleString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: false});
	}
</script>


<style>
.direct-chat-msg,
.direct-chat-text {
	display: block;
}

.direct-chat-msg {
	margin-bottom: 1px;
}

.direct-chat-msg:before,
.direct-chat-msg:after {
	content: " ";
	display: table;
}

.direct-chat-msg:after {
	clear: both;
}

.direct-chat-text {
	border-radius: 5px;
	position: relative;
	padding: 5px 10px;
	background: #303030;
	margin: 0px 0 0px 50px;
	color: rgb(255, 255, 255);
	margin-right: 50px;
	width: fit-content;
	border-radius: 20px;
}

.direct-chat-text:after,
.direct-chat-text:before {
/*	position: absolute;
	right: 100%;
	top: 15px;
	border: solid transparent;
	border-right-color: #d2d6de;
	content: ' ';
	height: 0;
	width: 0;
	pointer-events: none;*/
}

.direct-chat-text:after {
	border-width: 5px;
	margin-top: -5px;
}

.direct-chat-text:before {
	border-width: 6px;
	margin-top: -6px;
}

.right .direct-chat-text {
	margin-right: 50px;
	margin-left: auto;
}

.my_bk {
	background: #1570FF;
}


.right .direct-chat-text:after,
.right .direct-chat-text:before {
	right: auto;
	left: 100%;
	border-right-color: transparent;
	border-left-color: #d2d6de;
}

/*
img {
	border-radius: 50%;
	float: left;
	width: 40px;
	height: 40px;
}

.right img {
	float: right;
}
	
.direct-chat-infos {
	font-size: .8rem;	
}

.direct-chat-name {
	font-weight: 600;
}

.direct-chat-timestamp {
	margin-left: 50px;
	margin-right: 50px;
	color: #999;

	margin-bottom: 0;
}
	
.read-icon {
	color: #007bff;
}
	
.un-read-icon {
	color: #8f8f8f8f;
}
*/

</style>

<div class="direct-chat-msg" class:right="{msg.sent_by_me}">
  <!-- <div class="direct-chat-infos clearfix">

	 <span class="direct-chat-timestamp" class:float-left="{sentByMe}" class:float-right="{!sentByMe}">
					{format_date(msg.date)}
			{#if sentByMe === true}
					<span class={((timeRead === 0) ? 'un-' : '') + 'read-icon'}><Fa icon={faCheckDouble} /></span>
			{/if}
			</span>
    </div> -->
		
    <!-- <img class="direct-chat-img" src="{sentByMe==true?profilePicMe:profilePicChatPartner}" alt="pic">-->
    <div class="direct-chat-text" class:my_bk="{msg.sent_by_me}">
			<span>{msg.str}</span>
	</div>
</div>