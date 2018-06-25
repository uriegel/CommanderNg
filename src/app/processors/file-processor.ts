import { ItemProcessor } from "./item-processor"
import { Observable, from } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { FileItem } from "../addon";

export class FileProcessor extends ItemProcessor {
    get columns() {
        return {
            name: "file",
            columns: [
                { name: "Name", isSortable: true },
                { name: "Erw.", isSortable: true },
                { name: "Datum", isSortable: true },
                { name: "Größe", isSortable: true },
                { name: "Version", isSortable: true }
            ]        
        }
    }

    get(path: string, recentPath?: string): Observable<IItem[]> { return from(new Promise(
        (res, rej) => this.addon.readDirectory(path, 
            (err, result) => {
                var parentItem: FileItem[] = [ {
                    name: "..",
                    type: 3
                }]
                let currentItem: IItem = null
                var dirs = result.filter(n => n.type == 1)
                if (recentPath) {
                    const index = recentPath.lastIndexOf('\\')
                    if (index != -1) {
                        const pathName = recentPath.substr(index + 1)
                        currentItem = dirs.find(n => n.name == pathName)
                    }
                }
                var files = result.filter(n => n.type == 0)
                const items = parentItem.concat(dirs.concat(files))
                if (!currentItem)
                    currentItem = items[0]
                if (currentItem)
                    currentItem.isCurrent = true
                res(items)
            })
        ))
    }

    process(item: IItem) {
        const fileItem = item as FileItem
        switch (fileItem.type) {
            case 1:
                this.commanderView.path = `${this.commanderView.path}\\${fileItem.name}`
                break;
            case 3:
                const parent = this.getParent()
                this.commanderView.path = parent
                break;
        }
    } 

    private getParent() {
        const index = this.commanderView.path.lastIndexOf("\\")
        if (index != -1) 
            return this.commanderView.path.substr(0, index)
        else
            return "drives"
    }
}