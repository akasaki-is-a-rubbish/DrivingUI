
export const websocketServer = 'ws://10.0.0.1:8765/';

/** Fake a fixed-sized screen */
export const fakeScreen = true;

let curpos = 0;
export const sensorMap: Record<string, {spread: number, pos: number}> = {
    left_s1: { spread: 31.25, pos: curpos += 31.25 },
    left_s2: { spread: 31.25, pos: curpos += 31.25 },
    left_s3: { spread: 31.25, pos: curpos += 31.25 },
    left_s4: { spread: 31.25, pos: curpos += 31.25 },
    front_s1: { spread: 31.25, pos: curpos += 31.25 },
    front_s2: { spread: 31.25, pos: curpos += 31.25 },
    front_s3: { spread: 31.25, pos: curpos += 31.25 },
    front_s4: { spread: 31.25, pos: curpos += 31.25 },
    right_s1: { spread: 31.25, pos: curpos += 31.25 },
    right_s2: { spread: 31.25, pos: curpos += 31.25 },
    right_s3: { spread: 31.25, pos: curpos += 31.25 },
    right_s4: { spread: 31.25, pos: curpos += 31.25 },
    back_s1: { spread: 31.25, pos: curpos += 31.25 },
    back_s2: { spread: 31.25, pos: curpos += 31.25 },
    back_s3: { spread: 31.25, pos: curpos += 31.25 },
    back_s4: { spread: 31.25, pos: curpos += 31.25 },
};

export const lidarName = 'mainLidar';

export const initData = {
    'left': {s1: 0, s2: 0, s3: 0, s4: 700}
};

export const colors: Array<{ distance: number } & RGBA> = [
    { distance: -50, r: 255, g: 0, b: 0, a: 1 },
    { distance: -25, r: 255, g: 200, b: 0, a: 1 },
    // { distance: 0, r: 0, g: 0, b: 0, a: 1 },
    { distance: 0, r: 255, g: 200, b: 0, a: 0 },
]
.sort((a, b) => b.distance - a.distance);

export const baseDistance = 50;

export function sensorFunction(x: number) {
    return (x == 0 || x > 1500) ? 0 : -((1500 - x) / 1500 * 100);
}

export type RGB = { r: number, g: number, b: number };
export type RGBA = RGB & { a: number };
