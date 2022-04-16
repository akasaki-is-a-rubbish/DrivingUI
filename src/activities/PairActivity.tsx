import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react"
import { createActivity, Activity } from "./Activity"
import { Client } from "../Client";

export const PairActivity = createActivity(function (props) {
    const { hidden } = props;
    const [code, setCode] = useState('');
    async function update() {
        const resp = await Client.current.request({cmd: 'getqrcode'});
        const newcode = (resp as any).qrcode.qrData;
        console.info('qrcode', newcode)
        setCode(newcode);
    }
    useEffect(() => {
        if (!hidden) {
            update();
            const timer = setInterval(update, 5000);
            return () => clearInterval(timer);
        }
    }, [hidden]);
    return (
        <Activity hidden={props.hidden} className={"pair"}>
            <div className="qrcode" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '10px', background: 'white', borderRadius: '10px' }}>
                    {code ? (
                        <QRCodeSVG value={code} size={300} bgColor="white" fgColor="black" />
                    ) : (
                        <div style={{ width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc' }}>
                            <p style={{fontSize: '30px'}}>(正在获取)</p>
                        </div>
                    )}
                </div>
            </div>
            <h2>手机端扫码绑定</h2>
        </Activity>
    )
});
