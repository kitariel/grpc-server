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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var os_1 = __importDefault(require("os"));
var util_1 = require("../../../../util");
var redis = {
    assignRedisServer: xstate_1.assign({
        data: function (_a, _b) {
            var data = _a.data;
            var payload = _b.payload;
            return __assign(__assign({}, data), { redis_server: payload });
        },
    }),
    addServerIDToRedis: function (_a) {
        var _b = _a.config.grpc, grpc_server_id = _b.grpc_server_id, port = _b.port, _c = _b.gossip_interface, gossip_interface = _c === void 0 ? "eth0" : _c, data = _a.data;
        return __awaiter(void 0, void 0, void 0, function () {
            var redis_server, result_ip_address;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        redis_server = data.redis_server;
                        result_ip_address = os_1.default.networkInterfaces();
                        console.log("Logging IP Address", result_ip_address.lo[0].address);
                        return [4, (redis_server === null || redis_server === void 0 ? void 0 : redis_server.set("server:" + grpc_server_id, JSON.stringify({
                                id: grpc_server_id,
                                ip_address: (result_ip_address[gossip_interface] || result_ip_address.lo)[0]
                                    .address + ":" + port,
                            })))];
                    case 1:
                        _d.sent();
                        return [2];
                }
            });
        });
    },
    addClientToRedisHandler: xstate_1.send(function (_, _a) {
        var client_id = _a.client_id;
        return {
            type: "NOOP",
            payload: {
                envelope: __assign({ client_id: client_id }, util_1.dates),
            },
        };
    }, { to: "redis-add-client-handler" }),
    removeClientFromRedisHandler: xstate_1.send(function (_, _a) {
        var client_id = _a.client_id;
        return {
            type: "NOOP",
            payload: {
                envelope: __assign({ client_id: client_id }, util_1.dates),
            },
        };
    }, { to: "redis-remove-client-handler" }),
    sendToRedisRedisCommService: xstate_1.send(function (_, e) {
        return e;
    }, { to: "redis-cluster-communication-service" }),
    redisClusterCommunicationService: xstate_1.send(function (_, _a) {
        var payload = _a.payload;
        return {
            type: "NOOP",
            payload: payload,
        };
    }, { to: "redis-cluster-communication-service" }),
};
exports.default = redis;
