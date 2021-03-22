import { AnyFunc, Callbacks, Ref } from "@yuuza/webfx";
import { useEffect, useState } from "react";
import { Color } from "./config";

export function useWebfxCallback<T extends AnyFunc>(callbacks: Callbacks<T>, cb: T) {
    useEffect(() => {
        callbacks.add(cb);
        return () => callbacks.remove(cb);
    }, []);
}

export function useWebfxRef<T>(ref: Ref<T>) {
    const [val, setVal] = useState(ref.value);
    useWebfxCallback(ref.onChanged, x => {
        // console.info('Ref changed', ref)
        setVal(x.value);
    });
    return val;
}


export function fromPolar(x: number, y: number, len: number, rad: number): [x: number, y: number] {
    return [
        x + len * Math.cos(rad),
        y + len * Math.sin(rad)
    ];
}

export function mixColor(a: Color, b: Color, weight: number): Color {
    var wa = weight, wb = 1 - weight;
    return {
        r: a.r * wa + b.r * wb,
        g: a.g * wa + b.g * wb,
        b: a.b * wa + b.b * wb,
    };
}
