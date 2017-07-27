const app = require('./app').app;
const http = require('http');

export const appServer = http.createServer(app);

appServer.listen(app.get('port'), function () {
    const host = appServer.address().address;
    const port = appServer.address().port;
    console.log('App Server: Listening on port ' + host + port);
});

function exitOps(options: any, err: any) {
    if (err) { console.log(err.stack); };
    if (options.exit) { process.exit(); };
}

process.on("uncaughtException", exitOps.bind(undefined, { exit: true }));
process.on("exit", exitOps.bind(undefined, { exit: true }));
process.on("SIGINT", exitOps.bind(undefined, { exit: true }));
process.on("SIGTERM", exitOps.bind(undefined, { exit: true }));