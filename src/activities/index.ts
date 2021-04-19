
import { Sensors, Camera, LocationOn, MusicIcon, Home, Dashboard, Cars, Radar, Map, Menu, Settings } from "../icons";
import { RadarAndCamsActivity } from './RadarActivity';
import { MusicActivity } from './MusicActivity';
import { HomeActivity } from './HomeActivity';
import { FrontActivity } from './FrontActivity';
import { NavActivity } from "./NavActivity";
import { SettingsActivity } from "./SettingsActivity";

export const activities = [
    { inBar: true, key: 'front', friendlyName: '行驶', activity: FrontActivity, icon: Cars },
    { inBar: true, key: 'rac', friendlyName: '倒车', activity: RadarAndCamsActivity, icon: Radar },
    // { inBar: true, key: 'lidar', friendlyName: '雷达', activity: LidarActivity, icon: LocationOn },
    { inBar: true, key: 'music', friendlyName: '音乐', activity: MusicActivity, icon: MusicIcon },
    { inBar: true, key: 'home', friendlyName: '菜单', activity: HomeActivity, icon: Menu},
    { inBar: false, key: 'nav', friendlyName: '导航', activity: NavActivity, icon: Map },
    { inBar: false, key: 'settings', friendlyName: '设置', activity: SettingsActivity, icon: Settings },
] as const;

export type ActivityName = (typeof activities)[number]['key'];

export const defaultActivitiy: ActivityName = 'front'; 
