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
        setVal(x.value);
    }, []);
    return val;
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
        onMouseDown: (e: MouseEvent) => (e.preventDefault(), false),
        style: {
            cursor: 'default'
        }
    };
}