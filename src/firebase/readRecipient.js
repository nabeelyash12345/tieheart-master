import {ref} from './firebase';
import {updateReadRecipient} from '../../screens/Chat/chat-slice';

export default function setReadRecipient(dispatch, {otherId, myId, msgId}) {
  if (!msgId) return;
  if (!otherId) return;
  if (!myId) return;

  ref.sendChat(myId, otherId).doc(msgId).update({isRead: true});
  dispatch(updateReadRecipient({otherId, msgId}));
}
