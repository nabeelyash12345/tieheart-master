import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const getOtherId = (ids: Array<string>, id1: string): string =>
  ids.filter((id) => id !== id1)[0] || "";

const ref = {
  myPrivate: (myId: string) => db.collection("private").doc(myId),
};

async function getPrivateDetails(userId: string): Promise<any> {
  const snap = await ref.myPrivate(userId).get();
  if (snap.exists) {
    return snap.data();
  }
  return {};
}

async function sendNotification(
    {userId, userToken}: {userId?: string; userToken?: string},
    notificationInfo: any,
) {
  if (!userId && !userToken) {
    throw new Error("user id or user token is required");
  }

  const token = userId ? (await getPrivateDetails(userId)).fcmToken : userToken;
  if (!token) throw new Error("token can't be found");

  const payload: admin.messaging.TokenMessage= {
    ...notificationInfo,
    token,
  };
  functions.logger.info(`token is  ${token} 
    and payload is ${JSON.stringify(notificationInfo.data)}`);

  return admin
      .messaging()
      .send(payload)
      .then((response) => {
      // Response is a message ID string.
        functions.logger.info("Message sent successfully", response);
        return response;
      })
      .catch((error) => {
        functions.logger.info("Error sending message:", error);
        throw new Error(`error sending notification ${error.message}`);
      });
}

const MSG_TYPE = {
  TEXT: "text",
  CALL: "call",
  INITIATE: "initiate",
  IMAGE: "image",
  GIF: "gif",
  VIDEO: "video",
};

const getNotificationMessage = (snapData: FirebaseFirestore.DocumentData) => {
  const {createdBy, messageInfo, participants} = snapData;
  const otherId = getOtherId(participants, createdBy);

  const notification = {body: "", title: ""};
  switch (messageInfo.type) {
    case MSG_TYPE.CALL:
      notification.body = `From ${otherId}`;
      notification.title = "Call";
      break;
    case MSG_TYPE.INITIATE:
      notification.body = `You and ${otherId}`;
      notification.title = "Matched";
      break;
    default:
      notification.body = `${messageInfo.message}`;
      notification.title = `Message from ${otherId}`;
      break;
  }
  return {
    notification,
    data: {data: JSON.stringify(snapData)},
  };
};

exports.triggerNotification = functions.firestore
    .document("Chat/{chatId}/message/{messageId}")
    .onCreate(async (snap, context) => {
      const {createdBy, participants} = snap.data();

      functions.logger.info(`starting to send notification for 
        chat id ${context.params.chatId}
        and message id ${context.params.messageId} 
        and snap data ${JSON.stringify(snap.data())}`);

      const otherId = getOtherId(participants, createdBy);
      functions.logger.info(`other user id is ${otherId}`);
      if (!otherId) return;
      return sendNotification(
          {userId: otherId},
          getNotificationMessage(snap.data()),
      );
    });
