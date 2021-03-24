
export const websocketServer = 'ws://10.0.0.1:8765/';

let curpos = 0;

export const sensorMap: Record<string, {spread: number, pos: number}> = {
    fronts1: { spread: 31.25, pos: curpos += 31.25 },
    fronts2: { spread: 31.25, pos: curpos += 31.25 },
    fronts3: { spread: 31.25, pos: curpos += 31.25 },
    fronts4: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_1s1: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_1s2: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_1s3: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_1s4: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_2s1: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_2s2: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_2s3: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_2s4: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_3s1: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_3s2: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_3s3: { spread: 31.25, pos: curpos += 31.25 },
    dist4x_3s4: { spread: 31.25, pos: curpos += 31.25 },
};

export const lidarName = 'RPLidar';

export const initData = {
    'dist4x_1': {s1: 0, s2: 0, s3: 0, s4: 700}
};

export const colors: Array<{ distance: number } & Color> = [
    { distance: -50, r: 255, g: 0, b: 0 },
    { distance: -25, r: 255, g: 200, b: 0 },
    // { distance: 0, r: 0, g: 0, b: 0 },
    { distance: 0, r: 255, g: 255, b: 255 },
]
.sort((a, b) => b.distance - a.distance);

export const baseDistance = 50;

export function sensorFunction(x: number) {
    return (x == 0 || x > 1500) ? 0 : -((1500 - x) / 1500 * 100);
}

export type Color = { r: number, g: number, b: number };
