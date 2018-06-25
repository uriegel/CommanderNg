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

    get(path: string): Observable<IItem[]> { return from(new Promise(
        (res, rej) => this.addon.readDirectory(path, 
            (err, result) => {
                var parentItem: FileItem[] = [ {
                    name: "..",
                    type: 3
                }]
                var dirs = result.filter(n => n.type == 1)
                var files = result.filter(n => n.type == 0)
                res(parentItem.concat(dirs.concat(files)))
            })
        ))
    }

    process(item: IItem) {
        const fileItem = item as FileItem
        if (fileItem.type == 1) {
            this.commanderView.path = `${this.commanderView.path}\\${fileItem.name}`
        }
    } 
}