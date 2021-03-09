
export const websocketServer = 'ws://10.0.0.1:8765/';

export const sensorMap = {
    dist4x_1s1: { spread: 30, pos: 0 },
    dist4x_1s2: { spread: 30, pos: 50 },
    dist4x_1s3: { spread: 30, pos: 100 },
    dist4x_1s4: { spread: 30, pos: 150 },
};

export function sensorFunction(x: number) {
    return (x == 0 || x > 400) ? 0 : (-(400 - x) / 400 * 100);
}
