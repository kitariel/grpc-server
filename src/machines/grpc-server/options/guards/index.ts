import { ConditionPredicate } from "xstate";
import { IContext, ISend } from "../../types";
import { IRecord } from "../../types";

const guards: IRecord<ConditionPredicate<IContext, any>> = {
  hasRedisConfig: ({ config: { redis } }) => {
    return !!redis;
  },
  isEncryptedButConnectionDoesNotExist: (
    { config: { encryption }, data },
    e: ISend
  ) => {
    const { client_id } = e;
    const { clients = {} } = data!;

    return !!encryption && !clients[client_id];
  },
  connectionExists: ({ data }, e: ISend) => {
    const { client_id } = e;
    const { clients = {} } = data!;
    return !!clients[client_id];
  },
  clientIdExist: ({ data }, e: ISend) => {
    const { client_id } = e;
    return !!client_id;
  },
  connectionExistsAndIsEncrypted: (
    { config: { encryption }, data },
    e: ISend
  ) => {
    const { clients = {} } = data!;
    const { client_id } = e;

    return !!encryption && !!clients[client_id];
  },
  connectionExistsButNotEncrypted: (
    { config: { encryption }, data },
    e: ISend
  ) => {
    const { clients = {} } = data!;
    const { client_id } = e;

    return !encryption && !!clients[client_id];
  },
  isEncryptedAndTransparent: ({ config: { encryption, transparent } }) => {
    return !!encryption && !!transparent;
  },
  isEncryptedButNotTransparent: ({ config: { encryption, transparent } }) => {
    return !!encryption && !transparent;
  },
  isTransparent: ({ config: { transparent } }) => {
    return !!transparent;
  },
};

export default guards;
