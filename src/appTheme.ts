import * as darkreader from "darkreader";

/**
 * A singleton object to control app theme.
 */
export const appTheme = {
    enabled: false,
    init() {
        if (!(darkreader as any).isEnabled()) {
        }
    },
    toggle(enable?: boolean) {
        if (enable == this.enabled) return;
        this.enabled = !this.enabled;
        if (this.enabled) {
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
