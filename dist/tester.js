"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var xstate_1 = require("xstate");
var uuid_1 = require("uuid");
var tester = "\n\uD83C\uDF00 Manager (tester) \uD83C\uDF00";
var _a = process.env.GRPC_PORT, GRPC_PORT = _a === void 0 ? '50052' : _a;
console.log('GRPC_PORT', GRPC_PORT);
var implementation = {
    actions: {
        logHeartbeat: function (_, e) { return console.log(tester, 'heartbeat', e); },
        logWildcard: function (_, e) { return console.log(tester, e); },
        spawnTester: xstate_1.assign({
            clients_tester: function () {
                var instance = index_1.spawn({
                    config: {
                        grpc: {
                            host: '0.0.0.0',
                            port: Number(GRPC_PORT),
                            gossip_interface: 'wlp2s0',
                            grpc_server_id: uuid_1.v4(),
                        },
                        redis: {
                            host: 'localhost',
                            port: 6379,
                        },
                        transparent: true,
                        verbose: true,
                    },
                    data: {},
                });
                return xstate_1.spawn(instance);
            },
        }),
        sendTest: xstate_1.send(function (_, e) {
            var envelope = e.envelope;
            return {
                type: 'SEND',
                client_id: e.payload.client_id,
                payload: {
                    type: 'TASK_OFFER',
                    data: {
                        hello: 'HAYYY',
                    },
                },
            };
        }, { to: function (_a) {
                var clients_tester = _a.clients_tester;
                return clients_tester;
            } }),
        sendTestByEvent: xstate_1.send(function (_, e) {
            var envelope = e.payload.envelope;
            return {
                type: 'SEND',
                envelope: JSON.parse(envelope),
                payload: {
                    type: 'TYPES',
                    payload: {
                        hello: "Test from server " + e.payload.payload.hi,
                    },
                },
            };
        }, { to: function (_a) {
                var clients_tester = _a.clients_tester;
                return clients_tester;
            } }),
    },
    services: {
        waitForInput: function () { return function (send) {
            process.stdin.on('data', function (input) {
                var data = input.toString().replace('\n', '');
                if (!data) {
                    console.log('please input client_id');
                    return;
                }
                send({
                    type: 'TEST_SEND',
                    payload: {
                        client_id: data,
                    },
                });
            });
        }; },
    },
};
var config = xstate_1.Machine({
    id: 'tester',
    context: { clients_tester: {} },
    initial: 'start',
    states: {
        start: {
            entry: ['spawnTester'],
            invoke: {
                src: 'waitForInput',
            },
            on: {
                MESSAGE: {
                    actions: [
                        'sendTestByEvent',
                    ],
                },
                TYPES: {
                    actions: [
                        'sendTest',
                    ],
                },
                TEST_SEND: {
                    actions: ['sendTest'],
                },
                HEARTBEAT: {
                    actions: ['logHeartbeat'],
                },
            },
        },
    },
}, implementation);
var serv = xstate_1.interpret(config);
serv.start();
