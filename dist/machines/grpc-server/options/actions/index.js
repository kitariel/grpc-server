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
var grpc_1 = __importDefault(require("./grpc"));
var logger_1 = __importDefault(require("./logger"));
var parent_1 = __importDefault(require("./parent"));
var redis_1 = __importDefault(require("./redis"));
var actions = __assign(__assign(__assign(__assign({}, grpc_1.default), logger_1.default), parent_1.default), redis_1.default);
exports.default = actions;
