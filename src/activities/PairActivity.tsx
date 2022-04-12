import { QRCodeSVG } from "qrcode.react";
import React from "react"
import { createActivity, Activity } from "./Activity"
import Container from "@material-ui/core/Container"

export const PairActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className={"pair"}>
            <div className="qrcode">
                <QRCodeSVG value="https://reactjs.org/" size={300} fgColor="black" />
            </div>
            <h2>手机端扫码绑定</h2>
        </Activity>
    )
});
