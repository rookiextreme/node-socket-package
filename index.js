import express from "express";
import { parse } from 'url';
import {checkAvailableServer, upgradeConn , serveClient} from "./lib/upgrade/socket.js";

const app = express();
const port = 4000;
const host = '127.0.0.1';

let server = app.listen(port, host, () => {
    console.log(`Real Time Server Is Running On Port ${port}`);
});

server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname, query } = parse(request.url, true);
    if(pathname == '/start-server'){
        let serverId = checkAvailableServer(query.channel);
        upgradeConn(request, socket, head, serverId, query.channel, query.username);
        serveClient(query.channel, query.username);
        // console.log(serverList);
    }
});