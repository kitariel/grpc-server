import { ServiceConfig, Sender } from 'xstate';
import Redis from 'ioredis';

import { createClient } from '../../../../util';
import {
  IContext,
  IMachineEvents,
  IRecord,
  IInitializedRedis,
} from '../../types';

const redis: IRecord<ServiceConfig<IContext, IMachineEvents>> = {
  initializeRedis: ({ config }) => (send: Sender<IInitializedRedis>) => {
    const { host, port } = config.redis!;
    const redis = new Redis(port, host);

    send({
      type: 'INITIALIZED_REDIS',
      payload: redis,
    });
  },

  redisClusterCommunicationService: ({ data }) => (
    send: Sender<any>,
    onEvent
  ) => {
    const { redis_server } = data!;
    const redisAddClientHandler = async (event: any) => {
      try {
        const { client_id } = event;

        const [selected_client]: any = await redis_server?.keys(
          `client:${client_id}:*`
        );

        if (!selected_client) {
          console.log('No selected client', selected_client);
          return;
        }

        const server_id = selected_client
          .split(`client:${client_id}:`)
          .pop() as string;
        const server = await redis_server?.get(server_id);

        const server_client = createClient(
          JSON.parse(server as string).ip_address
        );

        server_client.sendMessage(
          {
            type: event.type,
            client_id,
            payload: JSON.stringify(event.payload),
          },
          (err: Error) => {
            if (err) {
              return console.log(`++ Error redisClusterCommunicationService`);
            }
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
    };
    onEvent(redisAddClientHandler);
  },

  handleAddRedisClient: ({
    data,
    config: {
      grpc: { grpc_server_id },
    },
  }) => (_, onEvent) => {
    const { redis_server } = data!;
    const redisAddClientHandler = async ({
      payload: {
        envelope: { client_id },
      },
    }: any) => {
      await redis_server?.set(
        `client:${client_id}:server:${grpc_server_id}`,
        JSON.stringify({
          id: client_id,
          last_seen: new Date().toISOString(),
        })
      );
    };
    onEvent(redisAddClientHandler);
  },

  handleRemoveRedisClient: ({ data }) => (send, onEvent) => {
    const { redis_server } = data!;
    const redisAddClientHandler = async ({
      payload: {
        envelope: { client_id },
      },
    }: any) => {
      try {
        const disconnected_client = await redis_server?.keys(
          `client:${client_id}*`
        );

        // added
        if (!disconnected_client) return;

        await redis_server?.del(disconnected_client as string[]);
      } catch (error) {
        send({
          type: 'ERROR',
          error: {
            message: error.message,
            stack: error.stack,
          },
        });
      }
    };

    onEvent(redisAddClientHandler);
  },
};

export default redis;
