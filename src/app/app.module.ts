import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { TestAddonComponent } from './test/test-addon/test-addon.component'
import { ScrollbarComponent as TestScrollbarComponent } from './test/scrollbar/scrollbar.component'
import { ScrollbarComponent } from './scrollbar/scrollbar.component'
import { ColumnsComponent as TestColumnsComponent } from './test/columns/columns.component'
import { ColumnsComponent } from './columns/columns.component'
import { IconViewComponent } from './test/icon-view/icon-view.component'
import { TableViewComponent as TestTableViewComponent } from './test/table-view/table-view.component'
import { TableViewComponent } from './table-view/table-view.component'
import { FileItemComponent } from './datatemplates/file-item/file-item.component'
import { DirectoryItemComponent } from './datatemplates/directory-item/directory-item.component'
import { CommanderViewComponent } from './commander-view/commander-view.component'
import { CommanderViewComponent as TestCommanderViewComponent } from './test/commander-view/commander-view.component'

@NgModule({
    declarations: [
        AppComponent,
        TestAddonComponent,
        TestScrollbarComponent,
        TestColumnsComponent,
        ScrollbarComponent,
        ColumnsComponent,
        IconViewComponent,
        TestTableViewComponent,
        TableViewComponent,
        FileItemComponent,
        DirectoryItemComponent,
        CommanderViewComponent,
        TestCommanderViewComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
