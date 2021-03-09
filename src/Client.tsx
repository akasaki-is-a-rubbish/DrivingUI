import { Action, Callbacks } from '@yuuza/webfx';
import { Data } from './App';
import { websocketServer } from './config';

export class Client {
  static current = new Client();
  ws!: WebSocket;
  onReceivedData = new Callbacks<Action<any>>();
  lastData: Data | null = null;
  constructor() {
    this.connect();
  }
  connect() {
    this.ws = new WebSocket(websocketServer);
    this.ws.onopen = () => console.info("[ws] open");
    this.ws.onerror = (e) => console.error("[ws] error", e);
    this.ws.onclose = (e) => {
      console.warn('[ws] closed, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };
    this.ws.onmessage = (e) => {
      console.info("[ws] msg", e.data);
      var parsed = JSON.parse(e.data);
      this.lastData = parsed;
      this.onReceivedData.invoke(parsed);
    };
  }
  listenData(callback: Action<any>) {
    if (this.lastData)
      callback(this.lastData);
    this.onReceivedData.add(callback);
    return () => this.onReceivedData.remove(callback);
  }
  close() {
    console.warn('[ws] close()');
    this.ws.close();
  }
}
