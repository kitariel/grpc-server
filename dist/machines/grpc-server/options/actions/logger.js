"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../../util");
var append = util_1.log("GRPC Server");
var loggers = {
    logStarting: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Started Machine");
        }
    },
    logInitialized: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Initialized GRPC");
        }
    },
    logStartRedis: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Starting Redis");
        }
    },
    logConnectedToRedis: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Connected to Redis");
        }
    },
    logRunning: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Running");
        }
    },
    logRunningWithRedis: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Running With Redis");
        }
    },
    logConnected: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Connected");
        }
    },
    logMessage: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_1 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message", info_1);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message", info);
    },
    logMessageDecryptAndSendPayloadToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_2 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Decrypt And Send PayloadToParent", info_2);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Decrypt And Send PayloadToParent", info);
    },
    logMessageDecryptAndWrapSendToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_3 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Decrypt And Wrap SendToParent", info_3);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Decrypt And Wrap SendToParent", info);
    },
    logMessageSendPayloadToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_4 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Send PayloadToParent", info_4);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Send PayloadToParent", info);
    },
    logMessageWrapAndSendToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_5 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Send PayloadToParent", info_5);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Send PayloadToParent", info);
    },
    logSendEncrypted: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (verbose) {
            console.log(append(), "[Encrypted] Sending message to client stream", payload);
        }
    },
    logSendNotEncrypted: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (verbose) {
            console.log(append(), "[Not Encrypted] Sending message to client stream", payload);
        }
    },
    logSendToOtherServer: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (verbose) {
            console.log(append(), "[Encrypted] Sending message to other server", payload);
        }
    },
    logNewConnection: function (_a, event) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "New Connection", {
                type: event.type,
                client_id: event.client_id,
            });
        }
    },
    logConnectionClosed: function (_a, e) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Closed connection", e);
        }
    },
    logAddedClientToRedis: function (_a, e) {
        var _b = _a.config, verbose = _b.verbose, grpc_server_id = _b.grpc.grpc_server_id;
        if (verbose) {
            console.log(append(), "Added Client to Redis:", e);
        }
    },
    logError: function (_a, e) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Error", e);
        }
    },
    logInvalidSendAction: function (_a, e) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Standalone - Invalid Send Action", e);
        }
    },
    logHeartbeat: function (_a, e) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Heartbeat", e);
        }
    },
};
exports.default = loggers;
