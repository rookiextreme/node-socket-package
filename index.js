import express from "express";
import { parse } from 'url';
import {checkAvailableServer, upgradeConn} from "./lib/upgrade/socket.js";

const app = express();
const port = 4000;
const host = '127.0.0.1';

let server = app.listen(port, host, () => {
    console.log(`Server Is Running On Port ${port}`);
});

server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname, query } = parse(request.url, true);
    if(pathname == '/start-server'){
        let channel = query.channel;
        let user_id = query.user;
        let firstStepServer = checkAvailableServer(channel, user_id);
        let upgrade = upgradeConn(request, socket, head, firstStepServer, channel, user_id);
        // serveClient(serverId, channel);
        // console.log(serverList);
    }
});