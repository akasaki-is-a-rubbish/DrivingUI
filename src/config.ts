import { mapArrayObj } from "./utils";

export const websocketServer =
    'ws://localhost:8765'
    // 'ws://10.0.0.1:8765/'
    // 'ws://10.33.51.112:8765/'
    // 'ws://192.168.43.157:8765/'
    // 'ws://192.168.1.137:8765/'
    ;


/** Fake a fixed-sized screen */
export const fakeScreen = true;

export const lidarName = 'mainLidar';

export const initData = {
    'left': { s1: 0, s2: 0, s3: 0, s4: 700 }
};

let curpos = 0;
export const sensorMap: Record<string, { spread: number, pos: number }> = Object.fromEntries(
    mapArrayObj(
        ['key', 'spread', 'pos'],
        [
            ['left_s1', 31.25, curpos += 31.25],
            ['left_s2', 31.25, curpos += 31.25],
            ['left_s3', 31.25, curpos += 31.25],
            ['left_s4', 31.25, curpos += 31.25],
            ['front_s1', 31.25, curpos += 31.25],
            ['front_s2', 31.25, curpos += 31.25],
            ['front_s3', 31.25, curpos += 31.25],
            ['front_s4', 31.25, curpos += 31.25],
            ['right_s1', 31.25, curpos += 31.25],
            ['right_s2', 31.25, curpos += 31.25],
            ['right_s3', 31.25, curpos += 31.25],
            ['right_s4', 31.25, curpos += 31.25],
            ['back_s1', 31.25, curpos += 31.25],
            ['back_s2', 31.25, curpos += 31.25],
            ['back_s3', 31.25, curpos += 31.25],
            ['back_s4', 31.25, curpos += 31.25],
        ]
    ).map(({ key, spread, pos }) => [key, { spread, pos }])
);

export const frontStats = true;

export const colors = mapArrayObj(
    ['distance', 'r', 'g', 'b', 'a'], [
    [-50, 255, 0, 0, 1],
    [-25, 255, 200, 0, 1],
    // [ 0, 0, 0, 0, 1 ],
    [0, 255, 200, 0, 0],
]).sort((a, b) => b.distance - a.distance);

export const lidarPointColors: Array<{ distance: number } & RGBA> = mapArrayObj(
    ['distance', 'r', 'g', 'b', 'a'], [
    [0, 255, 0, 0, 1],
    [3000, 255, 200, 0, 1],
    [5000, 0, 255, 0, 1],
]).sort((a, b) => b.distance - a.distance);

export const baseDistance = 50;

export function sensorFunction(x: number) {
    return (x == 0 || x > 1500) ? 0 : -((1500 - x) / 1500 * 100);
}

export type RGB = { r: number, g: number, b: number };
export type RGBA = RGB & { a: number };
