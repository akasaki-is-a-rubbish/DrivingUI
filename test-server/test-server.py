"""
This is a test server for testing the performance of the rear video rendering.
"""

import json
import websockets
import asyncio
import numpy as np
import cv2


async def client_handler(client: websockets.WebSocketServerProtocol, path: str):
    """
    The asyncio routine for each established client.
    There should be excatly one client though.
    """

    print('client connected', client.remote_address)
    try:
        # Pre-generate the fake image for lower overhead
        img = np.empty((720, 1280, 3), np.uint8)
        # ret, buf = cv2.imencode('*.bmp', img)
        buf = img.tobytes("C")

        while True:
            # Wait for the "request frame" message from the client
            await client.recv();

            # Send the image "header"
            await client.send(json.dumps({'image': {'w': img.shape[1], 'h': img.shape[0]}}))

            #
            await client.send(buf)

            # # The sleeping was used to control the framerate before we
            # # changed the "request frame" protocol.
            # await asyncio.sleep(0.03)

    finally:
        client.close()
        print('client closed', client.remote_address)


async def main():
    # Be sure to disable transport compression of websockets
    server = await websockets.serve(client_handler, '127.0.0.1', 8765, compression=None)
    print('test server started listening...')
    await server.wait_closed()


if __name__ == '__main__':
    asyncio.run(main())
