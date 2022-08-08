"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guards = {
    hasRedisConfig: function (_a) {
        var redis = _a.config.redis;
        return !!redis;
    },
    isEncryptedButConnectionDoesNotExist: function (_a, e) {
        var encryption = _a.config.encryption, data = _a.data;
        var client_id = e.client_id;
        var _b = data.clients, clients = _b === void 0 ? {} : _b;
        return !!encryption && !clients[client_id];
    },
    connectionExists: function (_a, e) {
        var data = _a.data;
        var client_id = e.client_id;
        var _b = data.clients, clients = _b === void 0 ? {} : _b;
        return !!clients[client_id];
    },
    clientIdExist: function (_a, e) {
        var data = _a.data;
        var client_id = e.client_id;
        return !!client_id;
    },
    connectionExistsAndIsEncrypted: function (_a, e) {
        var encryption = _a.config.encryption, data = _a.data;
        var _b = data.clients, clients = _b === void 0 ? {} : _b;
        var client_id = e.client_id;
        return !!encryption && !!clients[client_id];
    },
    connectionExistsButNotEncrypted: function (_a, e) {
        var encryption = _a.config.encryption, data = _a.data;
        var _b = data.clients, clients = _b === void 0 ? {} : _b;
        var client_id = e.client_id;
        return !encryption && !!clients[client_id];
    },
    isEncryptedAndTransparent: function (_a) {
        var _b = _a.config, encryption = _b.encryption, transparent = _b.transparent;
        return !!encryption && !!transparent;
    },
    isEncryptedButNotTransparent: function (_a) {
        var _b = _a.config, encryption = _b.encryption, transparent = _b.transparent;
        return !!encryption && !transparent;
    },
    isTransparent: function (_a) {
        var transparent = _a.config.transparent;
        return !!transparent;
    },
};
exports.default = guards;
