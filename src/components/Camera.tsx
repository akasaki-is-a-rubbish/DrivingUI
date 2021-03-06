import React, { useEffect, useRef, useState } from 'react';
import CameraIcon from "@mui/icons-material/Camera";

export const Camera = React.memo(function ({ device, img, fake, maxHeight }: { device?: string; img?: string; fake?: boolean; maxHeight: string }) {
    const video = useRef<HTMLVideoElement>(null);
    const [label, setLabel] = useState(device);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (!(img || fake)) {
            navigator.mediaDevices.getUserMedia({ video: device ? { deviceId: device } : true })
                .then(function (stream) {
                    console.info('camera stream', stream);
                    video.current!.srcObject = stream;
                }).catch(function () {
                    setLabel('could not open ' + device);
                });
        } else {
            setLoaded(true);
        }
    }, [device, img]);
    return (
        !(img || fake) ? 
                <video className="camera" ref={video} autoPlay style={{height: maxHeight}}></video> :
                <img src={img} alt=""/>
    );

    
    // return (
    //     <div className='camera'>
    //         {
    //             !(img || fake) ? 
    //             <video ref={video} autoPlay></video> :
    //             <img src={img} alt=""/>
    //         }
    //         {/* {
    //             !loaded ? <div style={{
    //                 position: 'absolute',
    //                 top: 0,
    //                 left: 0,
    //                 width: '100%',
    //                 height: '100%',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 background: 'black',
    //             }}>
    //                 <CameraIcon style={{fontSize: '200px', color: 'white'}}/>
    //             </div> : null
    //         } */}
    //         <div className='label'>{label}</div>
    //     </div>
    // );
});
