import { ActionFunctionMap, assign, send } from "xstate";
import os from "os";

import { serializeToJSON, encrypt, dates } from "../../../../util";
import {
  IContext,
  IMachineEvents,
  IInitializedRedis,
  ISend,
} from "../../types";

const redis: ActionFunctionMap<IContext, any> = {
  assignRedisServer: assign({
    data: ({ data }, { payload }: IInitializedRedis) => {
      return {
        ...data,
        redis_server: payload,
      };
    },
  }),

  addServerIDToRedis: async ({
    config: {
      grpc: { grpc_server_id, port, gossip_interface = "eth0" },
    },
    data,
  }) => {
    const { redis_server } = data!;
    const result_ip_address = os.networkInterfaces();

    console.log(`Logging IP Address`, result_ip_address.lo![0].address);

    await redis_server?.set(
      `server:${grpc_server_id}`,
      JSON.stringify({
        id: grpc_server_id,
        ip_address: `${
          (result_ip_address[gossip_interface] || result_ip_address.lo)![0]
            .address
        }:${port}`,
      })
    );
  },

  addClientToRedisHandler: send(
    (_, { client_id }: any) => {
      return {
        type: "NOOP",
        payload: {
          envelope: {
            client_id,
            ...dates,
          },
        },
      };
    },
    { to: "redis-add-client-handler" }
  ),

  removeClientFromRedisHandler: send(
    (_, { client_id }: any) => {
      return {
        type: "NOOP",
        payload: {
          envelope: {
            client_id,
            ...dates,
          },
        },
      };
    },
    { to: "redis-remove-client-handler" }
  ),

  sendToRedisRedisCommService: send(
    (_, e: ISend) => {
      return e;
    },
    { to: "redis-cluster-communication-service" }
  ),

  redisClusterCommunicationService: send(
    (_, { payload }: ISend) => {
      return {
        type: "NOOP",
        payload,
      };
    },
    { to: "redis-cluster-communication-service" }
  ),
};

export default redis;
