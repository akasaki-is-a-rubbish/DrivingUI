import { Ref } from "@yuuza/webfx";
import * as darkreader from "darkreader";

/**
 * A singleton object to control app theme.
 */
export const appTheme = {
    enabledRef: new Ref<boolean>(),
    init() {
        this.enabledRef.value = false;
        if (!(darkreader as any).isEnabled()) {
        }
    },
    toggle(enable?: boolean) {
        if (enable == this.enabledRef.value) return;
        this.enabledRef.value = !this.enabledRef.value;
        if (this.enabledRef.value) {
            darkreader.enable({
                brightness: 100,
                contrast: 90,
                sepia: 10
            });
        } else {
            darkreader.disable();
        }
    }
}
