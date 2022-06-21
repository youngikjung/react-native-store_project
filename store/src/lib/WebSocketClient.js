// Example conf. You can move this to your config file.
import ReconnectingWebSocket from './react-native-reconnecting-websocket';

//export default class WebSocketClient {
class WebSocketClient {
   websocket;

   isConnected() {
      if (this.websocket === null || this.websocket === undefined) {
         return false;
      }

      let oWebSocketInstance = this.websocket.getInstance();
      if (oWebSocketInstance != undefined && oWebSocketInstance.readyState === 1) {
         return true;
      }
      //if (this.websocket != null && this.websocket != undefined) {
      //  return true;
      //};
      return false;
   }

   connect(sWebsocketUrl, sToken, sRefreshToken) {
      if (this.websocket == null || this.websocket == undefined) {

         var aProtocols = [];

         let oOptions = {
            reconnectInterval: 5000,
            headers: {
               "Authorization": sToken,
               "refresh-token": sRefreshToken
            },
            maxReconnectAttempts: 100
         }
         this.websocket = new ReconnectingWebSocket(sWebsocketUrl, aProtocols, oOptions);

         this.websocket.onopen = (e) => {
         };

         /*
         this.websocket.onmessage = (evt) => {
            console.log("onmessage", JSON.parse(evt.data))
         };
         */

         this.websocket.onclose = (e) => {
            //console.log(e);
            //this.websocket = null;
         };
         this.websocket.onerror = (e) => {
            //console.log(e);
            //this.websocket = null;
         };
      }
      return new Promise((resolve, reject) => {
         return resolve();
      });
   }

   disconnect() {
      return new Promise((resolve) => {
         if (this.websocket == undefined) {
            resolve();
            return;
         }
         this.websocket.close();
         this.websocket = null;
         resolve();
      });
   }

   emit(event, data) {
      //console.log('emit');
      //console.log(this.websocket);
      return new Promise((resolve, reject) => {

         if (!this.websocket) return reject('No socket connection.');

         //return this.websocket.emit(event, data, (response) => {
         // Response is the optional callback that you can use with socket.io in every request. See 1 above.
         //  if (response.error) {
         //     console.error(response.error);
         //     return reject(response.error);
         //  }

         return resolve();
         //});
      });
   }

   on(event, fun) {
      // No promise is needed here, but we're expecting one in the middleware.
      return new Promise((resolve, reject) => {
         if (!this.websocket) return reject('No socket connection.');

         //this.websocket.on(event, fun);
         if (event == 'message') {
            this.websocket.onmessage = (evt) => {
               if (typeof fun === 'function') {
                  fun(evt);
               }
            };
         }
         return resolve();
      });
   }

   acknowledgeMsg(sUuid) {
      return new Promise((resolve, reject) => {
         if (!this.websocket) return reject('No socket connection.');

         if (sUuid != undefined && sUuid != '') {
            //console.log('sending uuid');
            //console.log(sUuid);
            this.websocket.send(sUuid);
         }
         resolve();
      });
   }

   sendToPOS(sAction, mSendData, iStoreId) {
      if (this.websocket != null && this.websocket != undefined) {
         let oPrepareData = {
            'action': sAction
         };
         let oMerged;
         if (typeof mSendData === 'object') {
            oMerged = Object.assign({}, oPrepareData, mSendData);
         } else {
            oMerged = oPrepareData;
            oMerged['content'] = mSendData;
         }

         let oSendData = {
            'to_id': '#pos-' + parseInt(iStoreId),
            'message': oMerged
         };
         this.websocket.send(JSON.stringify(oSendData));
      }
   }

   sendToDID(sAction, mSendData, iStoreId, sType) {
      if (this.websocket != null && this.websocket != undefined) {
         let oPrepareData = {
            'action': sAction
         };
         let oMerged;
         if (typeof mSendData === 'object') {
            oMerged = Object.assign({}, oPrepareData, mSendData);
         } else {
            oMerged = oPrepareData;
            oMerged['content'] = mSendData;
         }

         let sId = '#did-order-'
         if (sType == 'pickup') {
            sId = '#did-pickup-'
         }

         let oSendData = {
            'to_id': sId + parseInt(iStoreId),
            'message': oMerged
         };
         this.websocket.send(JSON.stringify(oSendData));
      }
   }

   sendToTablet(sAction, mSendData, iStoreId) {
      if (this.websocket != null && this.websocket != undefined) {
         let oPrepareData = {
            'action': sAction
         };
         let oMerged;
         if (typeof mSendData === 'object') {
            oMerged = Object.assign({}, oPrepareData, mSendData);
         } else {
            oMerged = oPrepareData;
            oMerged['content'] = mSendData;
         }

         let oSendData = {
            'to_id': '#reg-thrupay-' + parseInt(iStoreId),
            'message': oMerged
         };
         this.websocket.send(JSON.stringify(oSendData));
      }
   }

   sendMsg(sMsg) {
      return new Promise((resolve, reject) => {
         if (!this.websocket) return reject('No socket connection.');

         if (sMsg != undefined && sMsg != '') {
            this.websocket.send(sMsg);
         }
         resolve();
      });
   }
}


export default new WebSocketClient()