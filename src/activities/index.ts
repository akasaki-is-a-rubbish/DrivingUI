
import { Sensors, Camera, LocationOn, MusicIcon, Home, Dashboard, Cars, Radar } from "../icons";
import { RadarAndCamsActivity } from './RadarActivity';
import { MusicActivity } from './MusicActivity';
import { HomeActivity } from './HomeActivity';
import { FrontActivity } from './FrontActivity';

export const activities = [
    { key: 'front', friendlyName: '行驶', activity: FrontActivity, icon: Cars },
    { key: 'rac', friendlyName: '倒车', activity: RadarAndCamsActivity, icon: Radar },
    // { key: 'lidar', friendlyName: '雷达', activity: LidarActivity, icon: LocationOn },
    { key: 'music', friendlyName: '音乐', activity: MusicActivity, icon: MusicIcon },
    { key: 'home', friendlyName: '更多', activity: HomeActivity, icon: Dashboard},
] as const;

export type ActivityName = (typeof activities)[number]['key'];

export const defaultActivitiy: ActivityName = 'front'; 
