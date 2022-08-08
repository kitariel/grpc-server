# XState Template Module

## Description

A Template Spawnable/Invokable XState state-machine.

## Context

```typescript
import { AnyEventObject } from "xstate";
import { Server, ServerDuplexStream } from "grpc";
import { Redis } from "ioredis";

export interface IMachineEvents extends AnyEventObject {}

export type TServerDuplex = ServerDuplexStream<IMessage, IMessage>;

export interface IRecord<TEntry> {
  [key: string]: TEntry;
}
export interface IAES_256_CBC_CIPHER_PARAMS {
  encryption_key: string;
  encryption_iv: string;
}

export interface IGRPCConfig {
  host: string;
  port: number;
  gossip_interface: string;
  grpc_server_id: string;
}

export interface IRedisConfig {
  host: string;
  port: number;
}

export interface IModuleConfig {
  transparent?: boolean;
  verbose?: boolean;
  encryption?: IAES_256_CBC_CIPHER_PARAMS;
  grpc: IGRPCConfig;
  redis: IRedisConfig;
}

export interface IModuleData {
  grpc_server?: Server;
  redis_server?: Redis;
}

export interface IDateEnvelope {
  created_date: string;
  updated_date: string;
}

export interface IModuleEnvelope extends IDateEnvelope {
  client_id: string;
  module_name: "GRPC_SERVER"; // log
}

export interface IContext {
  config: IModuleConfig;
  data: IModuleData;
  clients: {
    [key: string]: TServerDuplex;
  };
}
```

## Module Events

Interact with an instance of this machine with the following events.

```typescript
// parent machine to this module.
export interface ISend<TPayload = AnyEventObject> {
  type: "SEND";
  payload: TPayload;
  client_id: string;
}

// This module to parent machine. Sent when config.transparent = false
export interface IMessage<TPayload = PayloadType> {
  type: "MESSAGE";
  payload: TPayload;
  client_id: string;
}

export interface IError {
  type: "ERROR";
  error: {
    message: string;
    stack: string;
  };
}

export interface IInitializedGrpc {
  type: "INITIALIZED_GRPC";
  payload: Server;
}

export interface IInitializedRedis {
  type: "INITIALIZED_REDIS";
  payload: Redis;
}

export interface INewConnection {
  type: "CONNECTION";
  envelope: {
    client_id: string;
    stream: ServerDuplexStream<IMessage, IMessage>;
  };
}

export interface IConnectionClosed {
  type: "CONNECTION_CLOSED";
  envelope: {
    client_id: string;
  };
}

// This module to parent machine. Sent when config.transparent = true
export interface IMachineEvents extends AnyEventObject {}
```
