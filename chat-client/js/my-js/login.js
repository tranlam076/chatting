
if (localStorage.getItem('token')) {
	window.location.href='room.html';
}

$('#btn-login').click(function () {
	const username = $('#input-username').val();
	const password = $('#input-password').val();
	const room = $('#input-room-name').val();
	callAPI('login', 'POST', {
		'content-type': 'json/application'
	}, {
		username,
		password,
		room
	})
	.then(responseData => {
		localStorage.setItem('token', responseData.data.token);
		localStorage.setItem('userId', responseData.data.id);
		localStorage.setItem('username', username);
		window.location.href='room.html?room=' + room;
	})
	.catch(e => {
		$('#error-message').text(e.responseJSON.error);
	})
});
