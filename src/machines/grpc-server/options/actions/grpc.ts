import { ActionFunctionMap, assign, send } from 'xstate';
import {
  IContext,
  IInitializedGrpc,
  INewConnection,
  IConnectionClosed,
  ISend,
  ISendStream,
} from '../../types';
import { serializeToJSON, encrypt, dates } from '../../../../util';

const grpc: ActionFunctionMap<IContext, any> = {
  assignGRPCServer: assign({
    data: ({ data }, { payload }: IInitializedGrpc) => {
      return {
        ...data,
        grpc_server: payload,
      };
    },
  }),

  assignStreamToContext: assign({
    data: ({ data }, { client_id, stream }: INewConnection) => {
      const { clients = {} } = data!;

      return {
        ...data,
        clients: {
          ...clients,
          [client_id]: stream,
        },
      };
    },
  }),

  unassignStreamFromContext: assign({
    data: ({ data }, { client_id }: IConnectionClosed) => {
      const { clients = {} } = data!;

      try {
        clients[client_id]?.end();
      } catch (error) {
        send({
          type: 'ERROR',
          error: {
            message: error.message,
            stack: error.stack,
          },
        });
      }

      const { [client_id]: client, ...new_clients } = clients;
      return {
        ...data,
        clients: {
          ...new_clients,
        },
      };
    },
  }),

  encryptAndSendToClient: ({ data, config: { encryption } }, e: ISend) => {
    const { encryption_iv, encryption_key } = encryption!;
    const { client_id } = e;
    const { clients = {} } = data!;
    const message = serializeToJSON(e.payload);
    const encrypted_message = encrypt(message, encryption_key, encryption_iv);

    clients[client_id]?.write({
      type: 'MESSAGE',
      payload: encrypted_message,
    });
  },

  sendToClient: ({ data }, { client_id, payload }: ISend) => {
    const { clients = {} } = data!;

    clients[client_id]?.write({
      type: 'MESSAGE',
      payload: serializeToJSON(payload),
    });
  },

  initializeHeartbeat: ({ data }, { client_id }: ISend) => {
    const { clients = {} } = data!;

    clients[client_id]?.write({
      type: 'START_HEARTBEAT',
      client_id,
    });
  },

  sendPongToClient: ({ data }, { client_id }: ISend) => {
    const { clients = {} } = data!;

    clients[client_id]?.write({
      type: 'HEARTBEAT',
    });
  },
};

export default grpc;
