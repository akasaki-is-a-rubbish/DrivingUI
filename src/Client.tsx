import { Action, Callbacks, Ref, Timer } from '@yuuza/webfx';
import { initData, websocketServer } from './config';

export type Data = Record<string, any>;

// We was trying between 'arraybuffer' and 'blob' receving types.
const binaryType = 'arraybuffer' as const;
export const Binary = ArrayBuffer;
export type Binary = InstanceType<typeof Binary>;

/**
 * The websocket client that:
 *  1) Connects to the "server" using websocket protocol
 *  2) Receives and parse structured json data
 *  3) Triggers events for data changing
 *  4) Bypass binary data to the other handler (i.e. the rear camera view)
 */
export class Client {
  static current: Client;

  ws!: WebSocket;
  closed = false;

  connectionState = new Ref<'ok' | 'disconnected'>();

  /** Ref for all json data. Its 'onChanged' are triggerd when any data changed. */
  data = new Ref<Data | null>();

  /** Refs for every json data key. For views to separatly listen for the needed data. */
  dataHub = new DataHub();

  onOpen = new Callbacks<Action>();
  onReceivedBinary = new Callbacks<Action<Binary>>();

  reconnectTimer = new Timer(() => this.connect());

  remoteServer: string | null = null;

  constructor() {
    this.data.value = {};
    this.handleNewData(JSON.parse(JSON.stringify(initData)));
    this.connectionState.value = 'disconnected';
  }
  connectTo(ip: string) {
    this.remoteServer = 'ws://' + ip + ':8765';
    this.connect();
  }
  connect() {
    // In case we are reconnecting
    this.close();

    // Create a new WebSocket instance
    this.closed = false;
    this.ws = new WebSocket(this.remoteServer || websocketServer);
    this.ws.binaryType = binaryType;
    this.ws.onopen = () => {
      console.info("[ws] open");
      this.connectionState.value = 'ok';
      this.onOpen.invoke();
    };
    this.ws.onerror = (e) => console.error("[ws] error", e);
    this.ws.onclose = (e) => {
      this.connectionState.value = 'disconnected';
      if (this.closed) return;
      console.warn('[ws] closed, reconnecting...');
      this.reconnectTimer.timeout(3000);
    };
    this.ws.onmessage = (e) => {
      // console.info("[ws] msg", e.data);
      if (typeof e.data == 'string') {
        // It's json data of sensors or image header
        var parsed = JSON.parse(e.data);
        this.handleNewData(parsed);
      } else if (e.data instanceof Binary) {
        // Should be an image buffer
        this.onReceivedBinary.invoke(e.data);
      } else {
        console.warn('unknown msg type');
      }
    };
  }

  private handleNewData(parsed: any) {
    if (parsed.requestId) {
      const callback = this.requestCallbacks[parsed.requestId];
      if (callback) {
        callback(parsed);
        delete this.requestCallbacks[parsed.requestId];
      }
      return;
    }
    for (const key in parsed) {
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        const val = parsed[key];
        this.dataHub.get(key).value = val;
      }
    }
    this.data.value = { ...this.data.value, ...parsed };
  }

  getData(key?: null): Ref<Record<string, any>>;
  getData(key: string): Ref<any>;
  getData(key?: string | null): Ref<any> | Ref<Record<string, any>> {
    if (key) return this.dataHub.get(key);
    return this.data;
  }

  send(obj: any) {
    this.ws?.send(obj);
  }

  sendJson(jsonObj: any) {
    this.send(JSON.stringify(jsonObj));
  }

  lastRequestId = 0;
  requestCallbacks: Record<number, (obj: object) => void> = {};

  request(obj: object) {
    const id = ++this.lastRequestId;
    this.sendJson({requestId: id, ...obj});
    return new Promise<object>((resolve) => {
      this.requestCallbacks[id] = resolve;
    });
  }

  close() {
    this.reconnectTimer.tryCancel();
    if (this.closed) return;
    this.closed = true;
    console.warn('[ws] close()');
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null!;
    }
  }
}

class DataHub {
  map = new Map<string, Ref<any>>();
  /** Get Ref for the key or create one if not exists. */
  get(key: string) {
    var ref = this.map.get(key);
    if (!ref) {
      ref = new Ref();
      this.map.set(key, ref);
    }
    return ref;
  }
}

declare global {
  var client: Client;
}

window.client = Client.current = new Client();
