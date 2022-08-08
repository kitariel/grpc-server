import { ServiceConfig } from "xstate";
import { IContext, IMachineEvents, IRecord } from "../../types";

import grpc from "./grpc";
import redis from "./redis";

const services: IRecord<ServiceConfig<IContext, IMachineEvents>> = {
  ...grpc,
  ...redis,
};

export default services;
