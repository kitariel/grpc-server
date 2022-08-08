"use strict";
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
var parent = {
    notifyParent: xstate_1.sendParent(function (_, e) { return e; }),
    sendHeartbeatToParent: xstate_1.sendParent(function (_, _a) {
        var payload = _a.payload, rest = __rest(_a, ["payload"]);
        return rest;
    }),
    decryptAndSendPayloadToParent: xstate_1.sendParent(function (_a, _b) {
        var encryption = _a.config.encryption;
        var payload = _b.payload;
        var _c = encryption, encryption_key = _c.encryption_key, encryption_iv = _c.encryption_iv;
        var decrypted_message = util_1.decrypt(payload, encryption_key, encryption_iv);
        var message = util_1.deserializeFromJSON(decrypted_message);
        return message;
    }),
    decryptAndWrapSendToParent: xstate_1.sendParent(function (_a, _b) {
        var encryption = _a.config.encryption;
        var payload = _b.payload;
        var _c = encryption, encryption_key = _c.encryption_key, encryption_iv = _c.encryption_iv;
        var decrypted_message = util_1.decrypt(payload, encryption_key, encryption_iv);
        var message = util_1.deserializeFromJSON(decrypted_message);
        return {
            type: 'MESSAGE',
            payload: message,
        };
    }),
    sendPayloadToParent: xstate_1.sendParent(function (_, _a) {
        var payload = _a.payload;
        var message = util_1.deserializeFromJSON(payload);
        return message;
    }),
    wrapAndSendToParent: xstate_1.sendParent(function (_, _a) {
        var payload = _a.payload;
        var message = util_1.deserializeFromJSON(payload);
        return {
            type: 'MESSAGE',
            payload: message,
        };
    }),
};
exports.default = parent;
