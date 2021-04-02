import json
import websockets
import asyncio
import numpy as np
import cv2


async def client_handler(client: websockets.WebSocketServerProtocol, path: str):
    print('client connected', client.remote_address)
    try:
        img = np.empty((720, 1280, 3), np.uint8)
        ret, buf = cv2.imencode('*.bmp', img)
        buf = buf.tobytes("C")

        while True:
            await client.send(json.dumps({'image': {'w': img.shape[1], 'h': img.shape[0]}}))
            # buf = img.tobytes("C")
            print(len(buf))
            await client.send(buf)
            await asyncio.sleep(0.07)

    finally:
        client.close()
        print('client closed', client.remote_address)


async def main():
    server = await websockets.serve(client_handler, '127.0.0.1', 8765)
    print('test server started listening...')
    await server.wait_closed()


if __name__ == '__main__':
    asyncio.run(main())