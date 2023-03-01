import { App } from "@vue/runtime-core"
import { getSvg } from "../services/svgService"

export const svgPlugin = {
    install: (app: App) => {
        app.config.globalProperties.$getSvg = (svgName: string, width: number | undefined, height: number | undefined) => {
            return getSvg(svgName, width, height)
        }
    }
}