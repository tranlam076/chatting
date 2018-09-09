const HOST = 'http://localhost:3030';

function callAPI (path, method, headers, body) {
	return new Promise((resolve, reject) => {
		var request = $.ajax({
		  url: `${HOST}/${path}`,
		  type: method,
		  data: body,
		  dataType: 'json'
		});
		request.done(function(responseData) {
			return resolve(responseData);
		});
		request.fail(function(error, textStatus) {
		  return reject(error);
		});
	});
}