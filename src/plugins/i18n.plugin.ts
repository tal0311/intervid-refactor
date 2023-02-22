import { App } from "@vue/runtime-core"
import { getTrans } from "../services/i18nService"

interface Options {
    getLang: () => string
}


const DEFAULT_LANG = 'en'
let getLang = () => DEFAULT_LANG


export const i18nPlugin = {
    install: (app: App, options: Options | null) => {
        getLang = options?.getLang || getLang
        app.config.globalProperties.getTrans = (word: string) => getTrans(word, getLang())
    }
}