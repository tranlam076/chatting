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
                return callback(
                    {
                        Success: false,
                        Error: 'Couldn\'t find that group'
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
                case 'create':
                    const group = await groupController.createGroup({
                        body: {
                            name: requestData.data.body,
                            type: requestData.data.type,
                            memberIds: requestData.data.memberIds,
                            partnerId: requestData.data.partnerId,
                        },
                        user: socket.user
                    });

                    if (group.partnerId !== null) {
                        socket.join(group.partnerId);
                        socket.broadcast.to(group.partnerId).emit('rooms', {
                            action: 'create',
                            data: group
                        });
                        return callback(null, group);
                    } else if (group.memberGroupIds !== undefined && group.memberGroupIds.length > 0) {
                        for (let memberId of group.memberGroupIds) {
                            socket.join(memberId);
                            socket.broadcast.to(memberId).emit('rooms', {
                                action: 'create',
                                data: group
                            });
                        }
                        return callback(null, group);
                    }
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