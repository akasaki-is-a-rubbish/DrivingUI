
export const websocketServer = 'ws://10.0.0.1:8765/';

export const sensorMap: Record<string, {spread: number, pos: number}> = {
    dist4x_1s1: { spread: 50, pos: 0 },
    dist4x_1s2: { spread: 50, pos: 50 },
    dist4x_1s3: { spread: 50, pos: 100 },
    dist4x_1s4: { spread: 50, pos: 150 },
};

export const initData = {
    'dist4x_1': {s1: 0, s2: 0, s3: 0, s4: 700}
};

export const colors: Array<{ distance: number } & Color> = [
    { distance: -50, r: 255, g: 0, b: 0 },
    { distance: -25, r: 255, g: 200, b: 0 },
    { distance: 0, r: 0, g: 0, b: 0 },
];

export const baseDistance = 50;

export function sensorFunction(x: number) {
    return (x == 0 || x > 1500) ? 0 : -((1500 - x) / 1500 * 100);
}

export type Color = { r: number, g: number, b: number };
