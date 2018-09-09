import GroupEvent from './group-event';
import UserEvent from './user-event';
import MessageEvent from './message-event';
import { Authentication } from '../middlewares';
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

export default class SocketInitialization {

    static connect (io) {
        io
            .use(async (socket, next) => {
                try {
                    await Authentication.authenticateSocket(socket);
                    next();
                } catch (e) {
                    return next(e);
                }
            })
            .on('connection', function (socket) {
                console.log('-----------Socket connect------------');
                localStorage.setItem(socket.id, socket.user.id);
                UserEvent.initialize(socket);
                GroupEvent.initialize(socket);
                MessageEvent.initialize(socket);
                // Handle disconnect
                socket.on('disconnect', function () {
                    console.log('-----------Socket disconnect------------');
                    UserEvent.userDisconnect(localStorage.getItem(socket.id));
                    GroupEvent.userDisconnect(socket, localStorage.getItem(socket.id));
                });
            });
    }

}