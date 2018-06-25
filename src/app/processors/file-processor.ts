import { ItemProcessor } from "./item-processor"
import { Observable, from } from "rxjs"
import { IItem } from "../table-view/table-view.component"

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
        (res, rej) => this.addon.readDirectory(path, (err, result) => {
            var dirs = result.filter(n => n.type == 1)
            var files = result.filter(n => n.type == 0)
            res(dirs.concat(files))
        })
    )) }
}