import { Injectable } from '@angular/core'
import { ItemProcessor, ProcessorType } from './item-processor'
import { DrivesProcessor } from './drives-processor'
import { FileProcessor } from './file-processor'

@Injectable({
    providedIn: 'root'
})
export class ItemProcesserFactoryService {

    constructor() { }

    get(itemProcessor: ItemProcessor, path: string) {
        if (path == "drives") {
            if (itemProcessor && itemProcessor.type == ProcessorType.root)
                return null
            else
                return new DrivesProcessor()
        }   
        else {
            if (itemProcessor && itemProcessor.type == ProcessorType.file)
                return null
            else
                return new FileProcessor()
        }
    }
}
