import { Box, ButtonBase, styled } from "@mui/material";
import React from 'react';
import { Activity, createActivity } from './Activity';
import { ClockText } from "../components/Clock";

export const StatusActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className={"status"}>
            <CardsBox>
                <SmallCard style={{gridArea: 'top1'}}>
                    <CardTitle>心率</CardTitle>
                    <CardText>60 BPM</CardText>
                </SmallCard>
                <SmallCard style={{gridArea: 'top2'}}>
                    <CardTitle>体温</CardTitle>
                    <CardText>39 °C</CardText>
                </SmallCard>
                <SmallCard style={{gridArea: 'top3'}}>
                    <CardTitle>TBD</CardTitle>
                </SmallCard>
                <SmallCard style={{gridArea: 'top4'}}>
                    <CardTitle>TBD</CardTitle>
                </SmallCard>

                <BigCard style={{gridArea: 'big1'}}>
                    <CardTitle>传感器</CardTitle>
                </BigCard>
                <BigCard style={{gridArea: 'big2'}}>
                    TBD
                </BigCard>

                <BigCard style={{gridArea: 'right'}}>
                    TBD
                </BigCard>
            </CardsBox>
            <Box position="absolute" right="30px" bottom="10px" fontSize="50px">
                <ClockText />
            </Box>
        </Activity>
    );
});


const CardsBox = styled(Box)({
    display: 'grid',
    flexFlow: 'row wrap',
    height: "100%",
    // alignItems: 'center',
    justifyContent: 'stretch',
    alignContent: 'stretch',
    padding: '60px 3% 100px',
    background: '#eeeeee',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1.5fr',
    gridTemplateRows: '1fr 2fr',
    gridTemplateAreas: `
        "top1 top2 top3 top4 right"
        "big1 big1 big2 big2 right"
    `
});

const Card = styled(Box)({
    position: 'relative',
    // boxShadow: '0 0 10px black',
    // boxShadow: `rgba(0,0,0,0.25) 0px 2px 5px,
    //     inset rgba(0,0,0,0.1) 0px 2px 0px,
    //     inset rgba(255,255,255,0.25) 0px 0px 0px,
    //     inset rgba(0,0,0,0.03) 0px 60px 0px,
    //     inset rgba(255,255,255,0.15) 0px -60px 60px, inset rgba(0,0,0,0.05) 0px 60px 60px`,
    borderRadius: '19px',
    background: 'white',
    userSelect: 'none',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'stretch',
    justifyContent: 'start',
    margin: '10px',
    padding: '20px',
});

const CardIcon = styled(Box)({
    '& svg': {
        fontSize: '100px'
    }
});

const CardTitle = styled(Box)({
    fontSize: '40px',
    textAlign: 'left'
});

const CardText = styled(Box)({
    fontSize: '40px',
    textAlign: 'right'
});

const SmallCard = styled(Card)({
    justifyContent: 'space-between',
});


const BigCard = styled(Card)({
    
});