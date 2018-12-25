import { IThemes } from "./app/interfaces/themes"

export interface ICommanderView {
    test(text: string): Promise<string>
}

function setTheme(theme: string) {
    themes.theme = theme
}

var themes: IThemes