import {groupController} from '../controllers';
// import GroupController from '../controllers/group-controller';

export default class GroupEvent {

    static async initialize(socket) {
        // Get all active group ID => socket.join(groupIds);
        const groupIds = await groupController.getActiveGroupIds(socket.user.id);
        for (const groupId of groupIds) {
            socket.join(groupId);
        }
        socket.on('rooms', async function (requestData, callback) {
            const groupInfo = await groupController.getListMembers(requestData.data.groupId);
            if (!groupInfo) {
                return callback (
                    {
                        Success: false,
                        Error: 'Couldnt find that group'
                    }
                );
            }
            const members = groupInfo.members.map(item => item.user);
            switch (requestData.action) {
                case 'join':
                    socket.broadcast.to(requestData.data.groupId).emit('rooms', {
                        action: 'join',
                        data: {
                            members: members
                        }
                    });
                    return callback(null, {
                        action: 'join',
                        data: {
                            members: members
                        }
                    });
            }
        });
    }

    static async userDisconnect(socket, userId) {
        socket.broadcast.emit('rooms', {
            action: 'userDisconnect',
            data: {
                userId: userId
            }
        });
    }

}