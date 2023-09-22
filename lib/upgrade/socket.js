import { WebSocketServer } from "ws";

var serverList = new Map();

function heartbeat() {
    this.isAlive = true;
}

function checkAvailableServer(type){
    let server = serverList.get(type);
    
    if(!server){
        return createNewServer(type);
    }
    
    return server.id;
}

function createNewServer(type){
    let s = new WebSocketServer({ noServer: true });
    let id = Object.keys(serverList).length + 1;
    serverList.set(type, {
        id: id,
        type: type,
        server: s,
        client: new Map()
    });

    return id;
}

function upgradeConn(request, socket, head,id, type, username){
    let s = serverList.get(type);

    if(id == s.id){
        let serve = s.server;
        serve.handleUpgrade(request, socket, head, function done(ws) {
            s.client.set(username, ws);
            serve.emit('connection', ws, request);
        });

        serve.on('connection', (ws, request) => {
            console.log('Connected');
        });
    }
}

function serveClient(type, username){
    let s = serverList.get(type);
    if(s){
        let clientSocket = s.client.get(username);
        clientSocket.on('message', (pData)=> {
            let data = JSON.parse(pData);
            if(data.type == 'start-ping'){
                clientSocket.on('pong', heartbeat);
            }

            //For Chat
            if(data.type == 'send-chat'){
                let receiver = s.client.get(data.data.sendto);
                receiver.send(JSON.stringify({
                    username : data.data.sendto,
                    sendby: data.data.sendby,
                    message : data.data.message
                }));
            }
        })

        const interval = setInterval(function ping() {
            if (clientSocket.isAlive === false) return ws.terminate();
          
            clientSocket.isAlive = false;
            clientSocket.ping();
        }, 30000);

        clientSocket.on('close', (data)=> {
            s.client.delete(username);
            clearInterval(interval);
        })
    }
}

export {serverList, checkAvailableServer, upgradeConn, serveClient}