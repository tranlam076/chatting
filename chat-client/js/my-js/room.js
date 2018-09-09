const token = localStorage.getItem('token');
if (!token) {
	window.location.href='login.html';
} 
const socket = io('http://localhost:3030?token=' + token);

const urlString = window.location.href;
const url = new URL(urlString);
const groupId = url.searchParams.get('room');
$('#roomName').append(groupId);
localStorage.setItem('hasSeen', 'no');


socket.on('rooms', function (responseData) {
	switch(responseData.action) {
		case 'userDisconnect':
		appendUserOfflineToChat(responseData);
		break;
		// appendUsernameToChat(responseData.data.members);
		// break;
		case 'join':
		appendUsernameToChat(responseData.data.members);
		break;
	}
});

socket.on('messages', function (responseData) {
	switch (responseData.action) {
		case 'create':
		localStorage.setItem('hasSeen', 'no');
		appendMessageToBox(responseData);
		break;
		case 'typing':
		appendUserTypingToChat(responseData); //-------------------------------check typing here --------------
		break;
		case 'seen':
		appendUserHadSeenToChat(responseData);//-------------------------------checking read message here --------------
	}
});
jQuery(document).ready(function($) {
	socket.emit('rooms', {
		action: 'join',
		data: {
			groupId
		}
	}, function(error, responseData) {
		if (error) {
			console.log(error);
		} else {
			console.log(responseData.data.members)
			appendUsernameToChat(responseData.data.members);
		}
	});
});



$('#btn-sign-out').click(function () {
	localStorage.removeItem('token');
	window.location.href='login.html';

});

function appendUsernameToChat(usernameArray) {
	$('#list-user').empty();
	for (var user of usernameArray) {
		var setOnlineStatus = (user.isOnline)? '<i class="fa fa-circle online"></i> online' : '<i class="fa fa-circle offline"></i> offline' 
		if (user.id !== localStorage.getItem('userId')) { //---------------------------"use id to check", I'll do it after.
			$('#list-user').append(`
				<li class="clearfix">
				<div class="about">
				<div class="name">${user.username}</div>
				<div class="status ${user.id}">
				${setOnlineStatus}
				</div>
				</div>
				</li>
				`);
		}
	}
}

////// Send message feature ////
$('#btn-send').click(function (event) {
	const message = $('textarea#txt-message').val();
	const type = 'text';
	socket.emit('messages', {
		action: 'create',
		data: {
			type,
			body: message,
			groupId
		}
	}, function (error, responseData) {
		if (error) {
			return alert('Having error while sending!');
		}
		appendMessageToBox(responseData);
	});
});

function appendMessageToBox (responseData) {
	
	let wrapMessageClassName = 'message-data align-right';
	let messageClassName = 'message other-message float-right';
	if (responseData.data.senderName === localStorage.getItem('username')) {
		wrapMessageClassName = 'message-data';
		messageClassName = 'message my-message';	
	} else {

	}
	const messageTemplate = `
	<li class="clearfix">
	<div class="${wrapMessageClassName}">
	<span class="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
	<span class="message-data-name" >${responseData.data.senderName}</span> <i class="fa fa-circle me"></i>
	</div>
	<div class="${messageClassName}">
	${responseData.data.body}
	</div>
	</li>
	<span class="members-seen"></span>
	`;
	return $('.chat-history ul').append(messageTemplate);
}

/////// typing message and readed message feature//////
$('#txt-message').focus(function(event) {	

	var hadSeenMessage =  localStorage.getItem('hasSeen');
	if (hadSeenMessage === 'no') {
		socket.emit('messages', {
			action: 'seen',
			data: {
				groupId
			}
		}, function(error, responseData) {
			if (error) {
				console.log(error);
			} else {
				localStorage.setItem('hasSeen', 'yes')	
			//received an ack (no error)
		}
	});	
	}
	
	socket.emit(
		'messages', 
		{
			action: 'typing',
			data: {
				groupId,
				username: localStorage.getItem('username'),
				isTyping: true
			}
		},
		function(error, responseData) {
			if (error) {
				console.log(error);
			} else {
				//received an ack (no error)
			}
		}
	);
});

$('#txt-message').focusout(function(event) {	
	socket.emit('messages', {
		action: 'typing',
		data: {
			groupId,
			username: localStorage.getItem('username'),
			isTyping: false
		}
	}, function(error, responseData) {
		if (error) {
			console.log(error);
		} else {
			//received an ack (no error)
		}
	});
});

function appendUserTypingToChat(responseData) {
	// if (responseData.data.membersTyping.length > 0) {
	// 	$('.members-typing').text(responseData.data.membersTyping + ' is typing...')
	// } else {
	// 	$('.members-typing').text('');
	// }
}

function appendUserHadSeenToChat(responseData) {
	// $('.members-seen').text(responseData.data.membersSeen + ' had seen')
}

function appendUserOfflineToChat (responseData) {
	$('li.clearfix div.about div.'+ responseData.data.userId).html('<i class="fa fa-circle offline"></i> offline')
}
