"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpret = exports.spawn = void 0;
var grpc_server_1 = require("./machines/grpc-server");
Object.defineProperty(exports, "spawn", { enumerable: true, get: function () { return grpc_server_1.spawn; } });
Object.defineProperty(exports, "Interpret", { enumerable: true, get: function () { return grpc_server_1.Interpret; } });
