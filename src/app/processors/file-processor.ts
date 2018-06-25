import { ItemProcessor, ProcessorType } from "./item-processor"
import { Observable, from } from "rxjs"
import { IItem } from "../table-view/table-view.component"
import { FileItem } from "../addon";

export class FileProcessor extends ItemProcessor {
    type: ProcessorType = ProcessorType.file
    
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

    get(path: string, recentPath?: string): Observable<IItem[]> { 
        this.requestId = ++FileProcessor.requestId
        return from(new Promise(
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

                const versionFiles = files.filter(n => n.name.toLowerCase().endsWith(".dll") || n.name.toLowerCase().endsWith(".exe"))
                const imgFiles = files.filter(n => n.name.toLowerCase().endsWith(".jpg"))
                let id = this.requestId
                let inBackground = async () => {
                    for (let i = 0; i < versionFiles.length; i++) {
                        if (id < this.requestId)
                            break
                        var version = await this.getFileVersion(`${path}\\${versionFiles[i].name}`)
                        if (version)
                            versionFiles[i].version = version
                    }
                    for (let i = 0; i < imgFiles.length; i++) {
                        if (id < this.requestId)
                            break
                        var exif = await this.getExifDate(`${path}\\${imgFiles[i].name}`)
                        if (exif) {
                            imgFiles[i].time = exif
                            imgFiles[i].isExif = true
                            console.log(imgFiles[i].time)
                        }
                    }
                }
                inBackground()
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

    close() {
        this.requestId = ++FileProcessor.requestId
    }

    private getParent() {
        const index = this.commanderView.path.lastIndexOf("\\")
        if (index != -1) 
            return this.commanderView.path.substr(0, index)
        else
            return "drives"
    }

    private async getFileVersion(path: string) {
        return new Promise<string>((res, rej) => {
            this.addon.getFileVersion(path, (err, result) => res(result))
        })
    }

    private async getExifDate(path: string) {
        return new Promise<Date>((res, rej) => {
            this.addon.getExifDate(path, (err, result) => res(result))
        })
    }

    requestId = 0
    static requestId = 0
}