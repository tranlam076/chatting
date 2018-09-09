import {messageController} from '../controllers'
export default class GroupEvent {
    static initialize (socket) {
        socket.on('messages', async function (requestData, callback) {
            const groupId = requestData.data.groupId;
            switch (requestData.action) {
                case 'create':
                    const message = await messageController.createMessage({
                        body: {
                            body: requestData.data.body,
                            type: requestData.data.type
                        },
                        params: {
                            id: requestData.groupId
                        },
                        user: socket.user
                    });

                    socket.broadcast.to(groupId).emit('messages',{
                        action: 'create',
                        data: message
                    });
                    return callback(null, message);
            }
        });
    }

}