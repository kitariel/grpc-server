import { ActionFunctionMap } from "xstate";
import { IContext } from "../../types";
import { deserializeFromJSON, log, decrypt } from "../../../../util";

const append = log("GRPC Server");

const loggers: ActionFunctionMap<IContext, any> = {
  logStarting: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Started Machine");
    }
  },
  logInitialized: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Initialized GRPC");
    }
  },
  logStartRedis: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Starting Redis");
    }
  },
  logConnectedToRedis: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Connected to Redis");
    }
  },
  logRunning: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Running");
    }
  },
  logRunningWithRedis: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Running With Redis");
    }
  },
  logConnected: ({ config: { verbose } }) => {
    if (verbose) {
      console.log(append(), "Connected");
    }
  },
  logMessage: ({ config: { verbose, encryption } }, { payload }) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message", info);
  },
  logMessageDecryptAndSendPayloadToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Decrypt And Send PayloadToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Decrypt And Send PayloadToParent", info);
  },
  logMessageDecryptAndWrapSendToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Decrypt And Wrap SendToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Decrypt And Wrap SendToParent", info);
  },
  logMessageSendPayloadToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Send PayloadToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Send PayloadToParent", info);
  },
  logMessageWrapAndSendToParent: (
    { config: { verbose, encryption } },
    { payload }
  ) => {
    if (!verbose) {
      return;
    }

    if (!!encryption) {
      const { encryption_iv, encryption_key } = encryption!;
      const new_log = decrypt(payload, encryption_key, encryption_iv);
      const info = deserializeFromJSON(new_log);
      console.log(append(), "Message Send PayloadToParent", info);
      return;
    }

    const info = deserializeFromJSON(payload);
    console.log(append(), "Message Send PayloadToParent", info);
  },
  logSendEncrypted: ({ config: { verbose, encryption } }, { payload }) => {
    if (verbose) {
      console.log(
        append(),
        "[Encrypted] Sending message to client stream",
        payload
      );
    }
  },
  logSendNotEncrypted: ({ config: { verbose, encryption } }, { payload }) => {
    if (verbose) {
      console.log(
        append(),
        "[Not Encrypted] Sending message to client stream",
        payload
      );
    }
  },
  logSendToOtherServer: ({ config: { verbose, encryption } }, { payload }) => {
    if (verbose) {
      console.log(
        append(),
        "[Encrypted] Sending message to other server",
        payload
      );
    }
  },
  logNewConnection: ({ config: { verbose } }, event) => {
    if (verbose) {
      console.log(append(), "New Connection", {
        type: event.type,
        client_id: event.client_id,
      });
    }
  },
  logConnectionClosed: ({ config: { verbose } }, e) => {
    if (verbose) {
      console.log(append(), "Closed connection", e);
    }
  },
  logAddedClientToRedis: (
    {
      config: {
        verbose,
        grpc: { grpc_server_id },
      },
    },
    e
  ) => {
    if (verbose) {
      console.log(append(), "Added Client to Redis:", e);
    }
  },
  logError: ({ config: { verbose } }, e) => {
    if (verbose) {
      console.log(append(), "Error", e);
    }
  },
  logInvalidSendAction: ({ config: { verbose } }, e) => {
    if (verbose) {
      console.log(append(), "Standalone - Invalid Send Action", e);
    }
  },
  logHeartbeat: ({ config: { verbose } }, e) => {
    if (verbose) {
      console.log(append(), "Heartbeat", e);
    }
  },
};

export default loggers;
