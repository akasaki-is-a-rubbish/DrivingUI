
import { Sensors, Camera, LocationOn, MusicNote, Home } from "../icons";
import { RadarAndCamsActivity } from './RadarActivity';
import { MusicActivity } from './MusicActivity';
import { HomeActivity } from './HomeActivity';
import { FrontActivity } from './FrontActivity';

export const activities = [
    { key: 'home', friendlyName: '首页', activity: HomeActivity, icon: Home},
    { key: 'rac', friendlyName: '撞车', activity: RadarAndCamsActivity, icon: Sensors },
    { key: 'front', friendlyName: '开车', activity: FrontActivity, icon: Camera },
    // { key: 'lidar', friendlyName: '雷达', activity: LidarActivity, icon: LocationOn },
    { key: 'music', friendlyName: '音乐', activity: MusicActivity, icon: MusicNote },
] as const;
export type ActivityName = (typeof activities)[number]['key'];
