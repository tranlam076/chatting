'use strict';

import {messageController} from '../controllers/index';
import {Authentication, Validation} from '../middlewares'

module.exports = (app) => {

	app.route('/groups/:id/messages')
		.get([Authentication.isAuth, Validation.validatePagination], messageController.getListMessages)
		.post([Authentication.isAuth], messageController.createMessage);
};
