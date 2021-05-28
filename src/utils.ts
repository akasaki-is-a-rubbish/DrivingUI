import { AnyFunc, Callbacks, Ref } from "@yuuza/webfx";
import React, { useEffect, useState } from "react";
import { RGBA } from "./config";

export function useWebfxCallback<T extends AnyFunc>(callbacks: Callbacks<T>, cb: T, deps?: React.DependencyList) {
    useEffect(() => {
        callbacks.add(cb);
        return () => callbacks.remove(cb);
    }, deps);
}

export function useWebfxRef<T>(ref: Ref<T>) {
    const [val, setVal] = useState(ref.value);
    useWebfxCallback(ref.onChanged, x => {
        // console.info('Ref changed', ref)
        if (val !== x.value) setVal(x.value);
    }, [val]);
    return val;
}

export function useAutoUpdatingState<T>(func: () => T, interval = 1000) {
    const [val, setVal] = useState(func);
    useEffect(() => {
        var timer = setInterval(() => {
            setVal(func());
        }, interval);
        return () => clearInterval(timer);
    }, []);
    return val;
}

export function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

export function pointDist(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(
        (x1 - x2) * (x1 - x2) +
        (y1 - y2) * (y1 - y2)
    );
}

export function fromPolar(x: number, y: number, len: number, rad: number): [x: number, y: number] {
    return [
        x + len * Math.cos(rad),
        y + len * Math.sin(rad)
    ];
}

export function mixColor(a: RGBA, b: RGBA, weight: number): RGBA {
    var wa = weight, wb = 1 - weight;
    return {
        r: a.r * wa + b.r * wb,
        g: a.g * wa + b.g * wb,
        b: a.b * wa + b.b * wb,
        a: a.a * wa + b.a * wb,
    };
}

export function className(...args: Array<string | (string | null | undefined)[] | Record<string, boolean>>) {
    let result: string[] = [];
    for (const arg of args) {
        if (typeof arg == 'string') {
            result.push(arg);
        } else if (arg instanceof Array) {
            result.push(...arg.filter(x => x) as string[])
        } else {
            result.push(
                ...Object.entries(arg)
                    .filter(([key, val]) => val)
                    .map(([key, val]) => key)
            );
        }
    }
    return result.join(' ');
}

export function noInteractive() {
    return {
        onMouseDown: (e: React.MouseEvent) => (e.preventDefault(), false),
        style: {
            cursor: 'default'
        }
    };
}

export function getColor(colors: any, o: number) {
    var prev = colors[0];
    var next = colors[1];
    for (let i = 2; i < colors.length; i++) {
        if (next.distance < o) break;
        [prev, next] = [next, colors[i]];
    }
    return mixColor(prev, next, 1 - (o - prev.distance) / (next.distance - prev.distance));
}

export function mapArrayObj<T extends object>(keys: (keyof T)[], arr: any[][]): T[] {
    return arr.map(a =>
        Object.fromEntries(
            keys.map((k, i) => [k, a[i]])
        ) as any
    );
}

export function arrayPick<T>(array: T[], indexies: number[]): T[] {
    return indexies.map(i => array[i]);
}
