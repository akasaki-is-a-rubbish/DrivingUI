import { AnyFunc, Callbacks, Ref } from "@yuuza/webfx";
import { useEffect, useState } from "react";

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
