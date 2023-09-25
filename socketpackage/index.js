class SocketClass{
    constructor(endpoint){
        this.endpoint = endpoint;
        this.curSocket = null;
        this.ready = 0;
    }

    heartbeat() {
        clearTimeout(this.pingTimeout);
    
        this.pingTimeout = setTimeout(() => {
            this.terminate();
        }, 30000 + 1000);
    }

    getSocket(){
        return this.curSocket;
    }

    openSocket(ws){
        ws.addEventListener("open", (event) => {
            ws.send(JSON.stringify({
                type : 'start-ping'
            }));
            ws.send(JSON.stringify({
                type : 'get-socket',
            }));
        });

        ws.addEventListener('ping', this.heartbeat);
        ws.addEventListener('close', function clear() {
            clearTimeout(this.pingTimeout);
        });

        let readyState = setInterval(function () {
            if (ws.readyState === WebSocket.OPEN) {
                clearInterval(readyState);
                this.curSocket = ws;
            } else {
                console.warn("websocket is not connected");
            }
        }, 1000);

        return ws;
    }

    async initializeSocket(){
        let promise = new Promise(function(resolve, reject) {
            setTimeout(function(){
                let openReady = setInterval(function () {
                    if (typeof socketPackage.getSocket() != undefined) {
                        clearInterval(openReady);
                        return resolve(1);
                    }
                }, 1000);
            }, 1000);
            
        });
        return await promise;
    }
}