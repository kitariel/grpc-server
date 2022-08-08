import { ActionFunctionMap } from "xstate";
import { IContext, IMachineEvents } from "../../types";

import grpc from "./grpc";
import logger from "./logger";
import parent from "./parent";
import redis from "./redis";

const actions: ActionFunctionMap<IContext, IMachineEvents> = {
  ...grpc,
  ...logger,
  ...parent,
  ...redis,
};

export default actions;
