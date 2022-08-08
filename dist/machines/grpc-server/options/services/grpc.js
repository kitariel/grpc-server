"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var uuid_1 = require("uuid");
var grpc_js_1 = require("@grpc/grpc-js");
var proto_loader_1 = require("@grpc/proto-loader");
var grpc = {
    initializeGRPCModule: function () { return function (send) {
        try {
            var server = new grpc_js_1.Server();
            send({
                type: 'INITIALIZED_GRPC',
                payload: server,
            });
        }
        catch (error) {
            send({
                type: 'ERROR',
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            });
        }
    }; },
    grpcListeners: function (_a) {
        var data = _a.data, config = _a.config;
        return function (send) {
            var _a = config.grpc, host = _a.host, port = _a.port;
            var grpc_server = data.grpc_server;
            var grpc_connection_timeout;
            try {
                var startConnection = function (stream) {
                    var client_id = uuid_1.v4();
                    var connection_closed_event = {
                        type: 'CONNECTION_CLOSED',
                        client_id: client_id,
                    };
                    send({
                        type: 'GRPC_CONNECTION',
                        client_id: client_id,
                        stream: stream,
                    });
                    stream.on('data', function (data) {
                        send(data);
                    });
                    stream.on('error', function (e) {
                        send({
                            type: 'ERROR',
                            error: {
                                message: '',
                                stack: '',
                            },
                        });
                        console.log('-----[ERROR] GRPC SERVER', e);
                        send(connection_closed_event);
                    });
                    stream.on('end', function () {
                        console.log('-----[END] GRPC SERVER ');
                        send(connection_closed_event);
                    });
                    grpc_connection_timeout = setTimeout(function () {
                        send({
                            type: 'SEND',
                            client_id: client_id,
                            payload: {
                                type: 'GRPC_CONNECTION',
                                client_id: client_id,
                            },
                        });
                    }, 10);
                };
                var sendMessage = function (call, callback) {
                    send(__assign(__assign({}, call.request), { payload: JSON.parse(call.request.payload) }));
                    return callback(null, call.request);
                };
                var handlers = {
                    startConnection: startConnection,
                    sendMessage: sendMessage,
                };
                var proto_path = path_1.default.resolve(__dirname, '../../../../protos/Events.proto');
                var prototype = proto_loader_1.loadSync(proto_path, {
                    keepCase: true,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true,
                });
                var packageDefinition = grpc_js_1.loadPackageDefinition(prototype);
                grpc_server === null || grpc_server === void 0 ? void 0 : grpc_server.addService(packageDefinition['Events']['service'], handlers);
                var credentials = grpc_js_1.ServerCredentials.createInsecure();
                grpc_server === null || grpc_server === void 0 ? void 0 : grpc_server.bindAsync(host + ":" + port, credentials, function (err, port) {
                    if (err) {
                        return console.error("Server cannot bind on " + host + ":" + port, JSON.stringify(err));
                    }
                    grpc_server === null || grpc_server === void 0 ? void 0 : grpc_server.start();
                    console.log("gRPC listening on " + host + ":" + port);
                });
            }
            catch (error) {
                send({
                    type: 'ERROR',
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
            return function () {
                grpc_server === null || grpc_server === void 0 ? void 0 : grpc_server.forceShutdown();
                clearTimeout(grpc_connection_timeout);
            };
        };
    },
};
exports.default = grpc;
