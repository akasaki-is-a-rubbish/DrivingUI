import { QRCodeSVG } from "qrcode.react";
import React from "react"
import { createActivity, Activity } from "./Activity"
import Container from "@mui/material/Container"

export const PairActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className={"pair"}>
            <div className="qrcode" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '10px', background: 'white', borderRadius: '10px' }}>
                    <QRCodeSVG value="https://reactjs.org/" size={300} bgColor="white" fgColor="black" />
                </div>
            </div>
            <h2>手机端扫码绑定</h2>
        </Activity>
    )
});
