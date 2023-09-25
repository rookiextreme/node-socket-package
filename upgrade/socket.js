import { WebSocketServer } from "ws";

var serverList = new Map();

serverList.set('chat', {
    group: new Map(),
    size: 0
});

function channelUser(channel, user){
    return `${channel}-${user}`;
}

function heartbeat() {
    this.isAlive = true;
}

function checkAvailableServer(channel, user_id){
    let server = new WebSocketServer({ noServer: true });
    server.on('connection', (ws, request) => {
        console.log('Server Connected');

        ws.on('message', (pData)=> {
            let data = JSON.parse(pData);
            if(data.type == 'start-ping'){
                ws.on('pong', heartbeat);
                console.log('Ping Started...');
            }

            if(data.type == 'start-ping'){
                ws.on('pong', heartbeat);
                console.log('Ping Started...');
            }

            if(data.type == 'get-all-user'){
                console.log(data);
            }
        })

        const interval = setInterval(function ping() {
            if (ws.isAlive === false) return ws.terminate();
            
            ws.isAlive = false;
            ws.ping();
        }, 1000);
    });

    // server.on('close', (data)=> {
    //     // s.client.delete(username);
    //     clearInterval(interval);
    // })
    return server;
}

function upgradeConn(request, socket, head, server, channel, user_id){
    server.handleUpgrade(request, socket, head, function done(ws) {
        server.emit('connection', ws, request);
        console.log('Connection Upgraded...');
    });

    let getChannel = serverList.get(channel);
    getChannel.group.set(channelUser(channel, user_id), {
        server: server
    });
}


export {serverList, checkAvailableServer, upgradeConn}