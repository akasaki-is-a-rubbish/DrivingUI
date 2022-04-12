import { Ref } from "@yuuza/webfx";
import * as darkreader from "darkreader";

/**
 * A singleton object to control app theme.
 */
export const appTheme = {
    enabledRef: new Ref<boolean>(),
    init() {
        this.enabledRef.value = false;
        if (localStorage.getItem('drivingui-dark') == '1') {
            this.toggle(true);
        }
    },
    toggle(enable?: boolean) {
        if (enable == this.enabledRef.value) return;
        this.enabledRef.value = !this.enabledRef.value;
        localStorage.setItem('drivingui-dark', this.enabledRef.value ? '1' : '0');
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
