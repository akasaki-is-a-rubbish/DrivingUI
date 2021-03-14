import { Action, Callbacks, Ref } from '@yuuza/webfx';
import { Data } from './App';
import { websocketServer } from './config';

export class Client {
  static current = new Client();

  ws!: WebSocket;
  closed = false;

  connectionState = new Ref<'ok' | 'disconnected'>();
  data = new Ref<Data | null>();

  constructor() {
    this.connectionState.value = 'disconnected';
  }
  connect() {
    this.closed = false;
    this.ws?.close();
    this.ws = new WebSocket(websocketServer);
    this.ws.onopen = () => {
      console.info("[ws] open");
      this.connectionState.value = 'ok';
    };
    this.ws.onerror = (e) => console.error("[ws] error", e);
    this.ws.onclose = (e) => {
      this.connectionState.value = 'disconnected';
      if (this.closed) return;
      console.warn('[ws] closed, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };
    this.ws.onmessage = (e) => {
      console.info("[ws] msg", e.data);
      var parsed = JSON.parse(e.data);
      this.data.value = parsed;
    };
  }
  close() {
    this.closed = true;
    console.warn('[ws] close()');
    this.ws.close();
  }
}
