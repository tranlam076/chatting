import { userController } from '../controllers';
// import UserController from '../controllers/group-controller';

export default class UserEvent {

    static async initialize (socket) {
        const updateStatus = await userController.updateOnlineStatus(socket.user.id, true);
        if(!updateStatus) {
            return new Error('Can not update online status')
        }
    }

    static async userDisconnect (userId) {
            const updateStatus = await userController.updateOnlineStatus(userId, false);
            if(!updateStatus) {
                return new Error('Can not update online status');
            }
    }
}