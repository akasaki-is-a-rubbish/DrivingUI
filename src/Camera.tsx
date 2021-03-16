import React, { useEffect, useRef } from 'react';

export function Camera({ device }: { device: string; }) {
    const video = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(x => console.info('devices', x), console.error);
        navigator.mediaDevices.getUserMedia({ video: device ? { deviceId: device } : true })
            .then(function (stream) {
                console.info(stream);
                video.current!.srcObject = stream;
            }).catch(function () {
                alert('could not connect stream');
            });
    }, []);
    return (
        <div className='camera'>
            <div className='label'>{device}</div>
            <video ref={video} autoPlay></video>
        </div>
    );
}
