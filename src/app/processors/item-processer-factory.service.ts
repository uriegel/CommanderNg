import { Injectable, NgZone } from '@angular/core'
import { ItemProcessor, ProcessorType } from './item-processor'
import { DrivesProcessor } from './drives-processor'
import { FileProcessor } from './file-processor'
import { CommanderViewComponent } from '../commander-view/commander-view.component'
import { SettingsService } from '../services/settings.service'

@Injectable({
    providedIn: 'root'
})
export class ItemProcesserFactoryService {

    constructor(private zone: NgZone, private settings: SettingsService) { }

    get(itemProcessor: ItemProcessor, commanderView: CommanderViewComponent, path: string) {
        if (path == "drives") {
            if (itemProcessor && itemProcessor.type == ProcessorType.root)
                return null
            else {
                if (itemProcessor)
                    itemProcessor.close()
                return new DrivesProcessor(commanderView, this.settings)
            }
        }   
        else {
            if (itemProcessor && itemProcessor.type == ProcessorType.file)
                return null
            else {
                if (itemProcessor)
                    itemProcessor.close()
                return new FileProcessor(commanderView, this.zone, this.settings)
            }
        }
    }
}
