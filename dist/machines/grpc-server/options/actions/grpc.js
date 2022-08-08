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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var util_1 = require("../../../../util");
var grpc = {
    assignGRPCServer: xstate_1.assign({
        data: function (_a, _b) {
            var data = _a.data;
            var payload = _b.payload;
            return __assign(__assign({}, data), { grpc_server: payload });
        },
    }),
    assignStreamToContext: xstate_1.assign({
        data: function (_a, _b) {
            var _c;
            var data = _a.data;
            var client_id = _b.client_id, stream = _b.stream;
            var _d = data.clients, clients = _d === void 0 ? {} : _d;
            return __assign(__assign({}, data), { clients: __assign(__assign({}, clients), (_c = {}, _c[client_id] = stream, _c)) });
        },
    }),
    unassignStreamFromContext: xstate_1.assign({
        data: function (_a, _b) {
            var _c;
            var data = _a.data;
            var client_id = _b.client_id;
            var _d = data.clients, clients = _d === void 0 ? {} : _d;
            try {
                (_c = clients[client_id]) === null || _c === void 0 ? void 0 : _c.end();
            }
            catch (error) {
                xstate_1.send({
                    type: 'ERROR',
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
            var _e = clients, _f = client_id, client = _e[_f], new_clients = __rest(_e, [typeof _f === "symbol" ? _f : _f + ""]);
            return __assign(__assign({}, data), { clients: __assign({}, new_clients) });
        },
    }),
    encryptAndSendToClient: function (_a, e) {
        var _b;
        var data = _a.data, encryption = _a.config.encryption;
        var _c = encryption, encryption_iv = _c.encryption_iv, encryption_key = _c.encryption_key;
        var client_id = e.client_id;
        var _d = data.clients, clients = _d === void 0 ? {} : _d;
        var message = util_1.serializeToJSON(e.payload);
        var encrypted_message = util_1.encrypt(message, encryption_key, encryption_iv);
        (_b = clients[client_id]) === null || _b === void 0 ? void 0 : _b.write({
            type: 'MESSAGE',
            payload: encrypted_message,
        });
    },
    sendToClient: function (_a, _b) {
        var _c;
        var data = _a.data;
        var client_id = _b.client_id, payload = _b.payload;
        var _d = data.clients, clients = _d === void 0 ? {} : _d;
        (_c = clients[client_id]) === null || _c === void 0 ? void 0 : _c.write({
            type: 'MESSAGE',
            payload: util_1.serializeToJSON(payload),
        });
    },
    initializeHeartbeat: function (_a, _b) {
        var _c;
        var data = _a.data;
        var client_id = _b.client_id;
        var _d = data.clients, clients = _d === void 0 ? {} : _d;
        (_c = clients[client_id]) === null || _c === void 0 ? void 0 : _c.write({
            type: 'START_HEARTBEAT',
            client_id: client_id,
        });
    },
    sendPongToClient: function (_a, _b) {
        var _c;
        var data = _a.data;
        var client_id = _b.client_id;
        var _d = data.clients, clients = _d === void 0 ? {} : _d;
        (_c = clients[client_id]) === null || _c === void 0 ? void 0 : _c.write({
            type: 'HEARTBEAT',
        });
    },
};
exports.default = grpc;
