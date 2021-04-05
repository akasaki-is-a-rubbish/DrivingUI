import { Box, styled } from "@material-ui/core";
import React from "react";
import { Activity } from "./Activity";

const Card = styled(Box)({
    // boxShadow: '0 0 10px black',
    boxShadow: `rgba(0,0,0,0.25) 0px 2px 5px,
        inset rgba(0,0,0,0.1) 0px 2px 0px,
        inset rgba(255,255,255,0.25) 0px 0px 0px,
        inset rgba(0,0,0,0.03) 0px 60px 0px,
        inset rgba(255,255,255,0.15) 0px -60px 60px, inset rgba(0,0,0,0.05) 0px 60px 60px`,
    flex: '0 0 30%',
    height: '40%',
    borderRadius: '19px'
});

const CardTitle = styled(Box)({
    fontSize: '40px'
});

const HomeBox = styled(Box)({
    display: 'flex',
    flexFlow: 'row wrap',
    height: "100%",
    alignItems: 'center',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    padding: '60px 3% 100px'
});

export function HomeActivity(props: { hidden: boolean; }) {
    return (
        <Activity className="home" hidden={props.hidden}>
            <HomeBox>
                <Card>
                    <CardTitle>导航</CardTitle>
                </Card>
                <Card>
                    <CardTitle>音乐</CardTitle>
                </Card>
                <Card>
                    <CardTitle>天气</CardTitle>
                </Card>
                <Card>
                    <CardTitle>开车</CardTitle>
                </Card>
                <Card>
                    <CardTitle>倒车</CardTitle>
                </Card>
                <Card>
                    <CardTitle>设置</CardTitle>
                </Card>
            </HomeBox>
        </Activity>
    );
}