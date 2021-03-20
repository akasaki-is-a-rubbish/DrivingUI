import React, { useEffect, useRef } from 'react';

export function Camera({ device }: { device: string; }) {
    const video = useRef<HTMLVideoElement>(null);
    useEffect(() => {
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
            <video ref={video} autoPlay></video>
            <div className='label'>{device}</div>
        </div>
    );
}
