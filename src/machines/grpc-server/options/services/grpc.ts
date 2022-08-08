import { ServiceConfig, AnyEventObject, Sender } from 'xstate';
import path from 'path';
import { v4 } from 'uuid';
import {
  Server,
  ServerCredentials,
  loadPackageDefinition,
  ServerDuplexStream,
  ServerUnaryCall,
  requestCallback,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

import {
  IContext,
  IMachineEvents,
  IRecord,
  IInitializedGrpc,
  IError,
  IConnectionClosed,
  INewConnection,
  IMessage,
  ISend,
} from '../../types';

const grpc: IRecord<ServiceConfig<IContext, IMachineEvents>> = {
  initializeGRPCModule: () => (send: Sender<IInitializedGrpc | IError>) => {
    try {
      const server = new Server();

      send({
        type: 'INITIALIZED_GRPC',
        payload: server,
      });
    } catch (error) {
      send({
        type: 'ERROR',
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    }
  },

  grpcListeners: ({ data, config }) => (
    send: Sender<
      | IConnectionClosed
      | INewConnection
      | ISend
      | IMessage
      | IError
      | AnyEventObject
    >
  ) => {
    const {
      grpc: { host, port },
    } = config;
    const { grpc_server } = data!;
    let grpc_connection_timeout: any;

    try {
      const startConnection = (
        stream: ServerDuplexStream<MessageEvent, MessageEvent>
      ) => {
        const client_id = v4();
        const connection_closed_event = {
          type: 'CONNECTION_CLOSED',
          client_id,
        };

        send({
          type: 'GRPC_CONNECTION',
          client_id,
          stream,
        });

        stream.on('data', (data) => {
          send(data);
        });

        stream.on('error', (e) => {
          send({
            type: 'ERROR',
            error: {
              message: '',
              stack: '',
            },
          });

          console.log('-----[ERROR] GRPC SERVER', e);

          send(connection_closed_event as any);
        });

        stream.on('end', () => {
          console.log('-----[END] GRPC SERVER ');
          send(connection_closed_event as any);
        });

        // Have the client state machine acknowledge the connection.
        grpc_connection_timeout = setTimeout(() => {
          send({
            type: 'SEND',
            client_id,
            payload: {
              type: 'GRPC_CONNECTION',
              client_id,
            },
          });
        }, 10);
      };

      const sendMessage = (
        call: ServerUnaryCall<any, any>,
        callback: requestCallback<any>
      ) => {
        send({
          ...call.request,
          payload: JSON.parse(call.request.payload),
        });

        return callback(null, call.request);
      };
      const handlers = {
        startConnection,
        sendMessage,
      };

      const proto_path = path.resolve(
        __dirname,
        '../../../../protos/Events.proto'
      );

      const prototype = loadSync(proto_path, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });

      const packageDefinition = loadPackageDefinition(prototype);

      grpc_server?.addService(
        // @ts-ignore
        packageDefinition['Events']['service'],
        handlers
      );

      const credentials = ServerCredentials.createInsecure();

      // console.log('[ port ]', port);

      grpc_server?.bindAsync(
        `${host}:${port}`,
        credentials,
        (err: Error | null, port: number) => {
          // console.log('[ host|port ]', port, host, grpc_server);
          if (err) {
            return console.error(
              `Server cannot bind on ${host}:${port}`,
              JSON.stringify(err)
            );
          }

          grpc_server?.start();
          console.log(`gRPC listening on ${host}:${port}`);
        }
      );
    } catch (error) {
      send({
        type: 'ERROR',
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    }

    return () => {
      grpc_server?.forceShutdown();
      clearTimeout(grpc_connection_timeout);
    };
  },
};

export default grpc;
