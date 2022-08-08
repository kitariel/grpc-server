"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var start = {
    entry: ['logStarting'],
    invoke: [
        {
            src: 'initializeGRPCModule',
        },
    ],
    on: {
        INITIALIZED_GRPC: [
            {
                cond: 'hasRedisConfig',
                actions: ['logInitialized', 'assignGRPCServer', 'notifyParent'],
                target: 'start_redis',
            },
            {
                actions: ['logInitialized', 'assignGRPCServer', 'notifyParent'],
                target: 'running',
            },
        ],
        ERROR: {
            actions: ['logError'],
            target: 'start',
        },
    },
};
var start_redis = {
    entry: ['logStartRedis'],
    invoke: {
        src: 'initializeRedis',
    },
    on: {
        INITIALIZED_REDIS: {
            actions: [
                'logConnectedToRedis',
                'assignRedisServer',
                'addServerIDToRedis',
            ],
            target: 'running_redis',
        },
    },
};
var running = {
    entry: ['logRunning'],
    invoke: [
        {
            src: 'grpcListeners',
        },
    ],
    on: {
        SEND: [
            {
                cond: 'connectionExistsAndIsEncrypted',
                actions: ['logSendEncrypted', 'encryptAndSendToClient'],
            },
            {
                cond: 'connectionExists',
                actions: ['logSendNotEncrypted', 'sendToClient'],
            },
            {
                actions: ['logInvalidSendAction'],
            },
        ],
        MESSAGE: [
            {
                cond: 'isEncryptedAndTransparent',
                actions: [
                    'logMessageDecryptAndSendPayloadToParent',
                    'decryptAndSendPayloadToParent',
                ],
            },
            {
                cond: 'isEncryptedButNotTransparent',
                actions: [
                    'logMessageDecryptAndWrapSendToParent',
                    'decryptAndWrapSendToParent',
                ],
            },
            {
                cond: 'isTransparent',
                actions: ['logMessageSendPayloadToParent', 'sendPayloadToParent'],
            },
            {
                actions: ['logMessageWrapAndSendToParent', 'wrapAndSendToParent'],
            },
        ],
        GRPC_CONNECTION: {
            actions: [
                'logNewConnection',
                'assignStreamToContext',
                'notifyParent',
                'initializeHeartbeat',
            ],
        },
        CONNECTION_CLOSED: {
            actions: [
                'logConnectionClosed',
                'unassignStreamFromContext',
                'notifyParent',
            ],
        },
        ERROR: {
            actions: 'logError',
        },
        HEARTBEAT: {
            actions: ['sendHeartbeatToParent', 'sendPongToClient'],
        },
        GRPC_WORKER_TERMINATED: {
            actions: ['unassignStreamFromContext'],
        },
    },
};
var running_redis = {
    entry: ['logRunningWithRedis'],
    invoke: [
        {
            src: 'grpcListeners',
        },
        {
            id: 'redis-add-client-handler',
            src: 'handleAddRedisClient',
        },
        {
            id: 'redis-remove-client-handler',
            src: 'handleRemoveRedisClient',
        },
        {
            id: 'redis-cluster-communication-service',
            src: 'redisClusterCommunicationService',
        },
    ],
    on: {
        SEND: [
            {
                cond: 'connectionExistsAndIsEncrypted',
                actions: ['logSendEncrypted', 'encryptAndSendToClient'],
            },
            {
                cond: 'connectionExistsButNotEncrypted',
                actions: ['logSendNotEncrypted', 'sendToClient'],
            },
            {
                actions: ['sendToRedisRedisCommService'],
            },
        ],
        MESSAGE: [
            {
                cond: 'isEncryptedAndTransparent',
                actions: [
                    'logMessageDecryptAndSendPayloadToParent',
                    'decryptAndSendPayloadToParent',
                ],
            },
            {
                cond: 'isEncryptedButNotTransparent',
                actions: [
                    'logMessageDecryptAndWrapSendToParent',
                    'decryptAndWrapSendToParent',
                ],
            },
            {
                cond: 'isTransparent',
                actions: ['logMessageSendPayloadToParent', 'sendPayloadToParent'],
            },
            {
                actions: ['logMessageWrapAndSendToParent', 'wrapAndSendToParent'],
            },
        ],
        GRPC_CONNECTION: {
            actions: [
                'logNewConnection',
                'assignStreamToContext',
                'notifyParent',
                'addClientToRedisHandler',
                'initializeHeartbeat',
            ],
        },
        CONNECTION_CLOSED: {
            actions: [
                'logConnectionClosed',
                'unassignStreamFromContext',
                'notifyParent',
                'removeClientFromRedisHandler',
            ],
        },
        ERROR: {
            actions: 'logError',
        },
        HEARTBEAT: {
            actions: ['sendHeartbeatToParent', 'sendPongToClient'],
        },
        GRPC_WORKER_TERMINATED: {
            actions: ['unassignStreamFromContext'],
        },
    },
};
var config = {
    id: 'grpc-server',
    initial: 'start',
    states: {
        start: start,
        start_redis: start_redis,
        running: running,
        running_redis: running_redis,
    },
};
exports.default = config;
