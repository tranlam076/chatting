export default class GroupEvent {

    static initialize (socket) {
        socket.on('messages', function (requestData, callback) {
            const { body, roomName, type } = requestData.data;
            switch (requestData.action) {
            }
        });
    }

}