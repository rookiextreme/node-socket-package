let user_id = prompt('Enter A User Id');

//available channel currently
//CHAT
//Specify channel and user_id
let type = 'chat';

//An object of type websocket will be returned here
let ws = new WebSocket('ws://127.0.0.1:4000/start-server?channel=' + type + '&user=' + user_id);

let socketPackage = new SocketClass();
let open = socketPackage.openSocket(ws);

let initializeSocket = socketPackage.initializeSocket().then(
    function(value){
        open.send(JSON.stringify({
            type: 'get-all-user'
        }));
    }
);
