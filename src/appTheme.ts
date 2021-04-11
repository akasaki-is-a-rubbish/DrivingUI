import * as darkreader from "darkreader";

export const appTheme = {
    init() {
        if (!(darkreader as any).isEnabled()) {
            // darkreader.enable({
            //     brightness: 100,
            //     contrast: 90,
            //     sepia: 10
            // });
        }
    }
}
