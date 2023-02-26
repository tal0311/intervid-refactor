import { App } from "@vue/runtime-core"
import { formatNum, getTrans, setLang } from "../services/i18nService"

interface Options {
    getLang: () => string
}



const DEFAULT_LANG = 'en'
let getLang = () => DEFAULT_LANG
setLang(getLang())

export const i18nPlugin = {
    install: (app: App, options: Options | null) => {
        getLang = options?.getLang || getLang

        app.config.globalProperties.$getTrans = (word: string) => {
            setLang(getLang())
            return getTrans(word, getLang())
        }

        app.config.globalProperties.$formatNum = (num) => formatNum(num, getLang())
    }
}