import { Box, styled } from "@material-ui/core";
import React from "react";
import { Activity } from "./Activity";

const Card = styled(Box)({
    boxShadow: '0 0 10px black',
    flex: '0 0 30%',
    height: '40%',
    borderRadius: '19px'
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
    return <Activity className="home" hidden={props.hidden}>
        <HomeBox>
            <Card>
                Content
            </Card>
            <Card>
                Content
            </Card>
            <Card>
                Content
            </Card>
            <Card>
                Content
            </Card>
            <Card>
                Content
            </Card>
            <Card>
                Content
            </Card>
        </HomeBox>
    </Activity>;
}