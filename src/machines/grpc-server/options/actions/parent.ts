import { ActionFunctionMap, sendParent, AnyEventObject } from 'xstate';

import { IContext, IMessage } from '../../types';
import { deserializeFromJSON, decrypt } from '../../../../util';

const parent: ActionFunctionMap<IContext, any> = {
  notifyParent: sendParent((_, e) => e),
  sendHeartbeatToParent: sendParent((_, { payload, ...rest }) => rest),
  decryptAndSendPayloadToParent: sendParent(
    ({ config: { encryption } }, { payload }: IMessage<any>) => {
      const { encryption_key, encryption_iv } = encryption!;
      const decrypted_message = decrypt(
        payload!,
        encryption_key,
        encryption_iv
      );
      const message = deserializeFromJSON(decrypted_message) as AnyEventObject;

      return message;
    }
  ),
  decryptAndWrapSendToParent: sendParent(
    ({ config: { encryption } }, { payload }: IMessage<any>) => {
      const { encryption_key, encryption_iv } = encryption!;
      const decrypted_message = decrypt(
        payload!,
        encryption_key,
        encryption_iv
      );
      const message = deserializeFromJSON(decrypted_message) as AnyEventObject;

      return {
        type: 'MESSAGE',
        payload: message,
      };
    }
  ),
  sendPayloadToParent: sendParent((_, { payload }: IMessage<any>) => {
    const message = deserializeFromJSON(payload!) as AnyEventObject;
    return message;
  }),
  wrapAndSendToParent: sendParent((_, { payload }: IMessage<any>) => {
    const message = deserializeFromJSON(payload!) as AnyEventObject;
    return {
      type: 'MESSAGE',
      payload: message,
    };
  }),
};

export default parent;
