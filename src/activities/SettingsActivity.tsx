import React from 'react';
import { Activity, createActivity } from './Activity';
import { Box, Button, Card, createMuiTheme, FormControlLabel, FormGroup, ListItem, Switch, ThemeProvider } from "@material-ui/core";
import { appTheme } from '../appTheme';
import { useWebfxRef } from '../utils';
import { blue } from '@material-ui/core/colors';
import { Client } from '../Client';
import { List } from '@material-ui/core';
import { Container } from '@material-ui/core';

export const SettingsActivity = createActivity(function (props) {
    return (
        <Activity hidden={props.hidden} className={"settings"}>
            <ThemeProvider theme={createMuiTheme({
                palette: {
                    primary: blue,
                    secondary: blue,
                },
                typography: {
                    fontSize: 26
                }
            })}>
                <h2>主题设置</h2>
                <Container>
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch size="medium" value={useWebfxRef(appTheme.enabledRef)} onChange={(e, val) => {
                                appTheme.toggle(val);
                            }} />
                        } label="夜间模式" />
                    </FormGroup>
                </Container>
                <h2>在线设备</h2>
                <div>
                    {
                        useWebfxRef(Client.current.getData("nodes"))?.map(x => (
                            <Card style={{
                                width: '500px',
                                padding: '1em',
                                display: 'inline-flex',
                                flexDirection: 'row',
                                margin: '20px',
                                justifyContent: 'space-evenly',
                            }}>
                                <Box style={{ flex: '0 270px', fontSize: '26px', textAlign: 'left', lineHeight: 1.5 }}>
                                    <Box>名称: {x.name}</Box>
                                    <Box>地址: {x.ip}</Box>
                                </Box>
                                {x.self == true
                                    ? <Button disabled>当前设备</Button>
                                    : <Button onClick={() => {
                                        Client.current.connectTo(x.ip);
                                    }}>远程查看</Button>}
                            </Card>
                        ))
                    }
                </div>
            </ThemeProvider>
        </Activity>
    );
});
