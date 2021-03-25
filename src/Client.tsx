import { Action, Callbacks, Ref } from '@yuuza/webfx';
import { Data } from './App';
import { initData, websocketServer } from './config';

export class Client {
  static current: Client;

  ws!: WebSocket;
  closed = false;

  connectionState = new Ref<'ok' | 'disconnected'>();
  data = new Ref<Data | null>();
  dataHub = new DataHub();

  onReceivedBinary = new Callbacks<Action<Blob>>();

  constructor() {
    this.data.value = {};
    this.handleNewData(JSON.parse(JSON.stringify(initData)));
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
      // console.info("[ws] msg", e.data);
      if (typeof e.data == 'string') {
        var parsed = JSON.parse(e.data);
        this.handleNewData(parsed);
      } else if (e.data instanceof Blob) {
        this.onReceivedBinary.invoke(e.data);
      } else {
        console.warn('unknown msg type');
      }
    };
  }

  private handleNewData(parsed: any) {
    for (const key in parsed) {
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        const val = parsed[key];
        this.dataHub.get(key).value = val;
      }
    }
    this.data.value = { ...this.data.value, ...parsed };
  }

  getData(key?: string) {
    if (key) return this.dataHub.get(key);
    return this.data;
  }

  close() {
    this.closed = true;
    console.warn('[ws] close()');
    this.ws.close();
  }
}

class DataHub {
  map = new Map<string, Ref<any>>();
  get(key: string) {
    var ref = this.map.get(key);
    if (!ref) {
      ref = new Ref();
      this.map.set(key, ref);
    }
    return ref;
  }
}

window['client'] = Client.current = new Client();
