import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { ScrollbarComponent as TestScrollbarComponent } from './test/scrollbar/scrollbar.component'
import { ScrollbarComponent } from './scrollbar/scrollbar.component'
import { TestColumnsComponent } from './test/columns/columns.component'
import { ColumnsComponent } from './columns/columns.component'
import { IconViewComponent } from './test/icon-view/icon-view.component'
import { TableViewComponent as TestTableViewComponent } from './test/table-view/table-view.component'
import { TableViewComponent } from './table-view/table-view.component'
import { FileItemComponent } from './datatemplates/file-item/file-item.component'
import { DirectoryItemComponent } from './datatemplates/directory-item/directory-item.component'
import { CommanderViewComponent } from './commander-view/commander-view.component'
import { CommanderViewComponent as TestCommanderViewComponent } from './test/commander-view/commander-view.component'
import { ItemProcesserFactoryService } from './processors/item-processer-factory.service'
import { DriveItemComponent } from './datatemplates/drive-item/drive-item.component'
import { FileSizePipe } from './pipes/file-size.pipe'
import { DatePipe } from './pipes/date.pipe'
import { FileExtensionPipe } from './pipes/file-extension.pipe'
import { NoFileExtensionPipe } from './pipes/no-file-extension.pipe'
import { FileIconPipe } from './pipes/file-icon.pipe'
import { FolderComponent } from './svgs/folder/folder.component'
import { DriveComponent } from './svgs/drive/drive.component'
import { NetworkdriveComponent } from './svgs/networkdrive/networkdrive.component'
import { CdromComponent } from './svgs/cdrom/cdrom.component'
import { UsbComponent } from './svgs/usb/usb.component'
import { ParentItemComponent } from './datatemplates/parent-item/parent-item.component'
import { VirtualListPipe } from './pipes/virtual-list.pipe'
import { ClipHeightPipe } from './pipes/clip-height.pipe'
import { RestricterComponent as TestRestrictor} from './test/restricter/restricter.component'
import { GridComponent } from './test/grid/grid.component'
import { GridSplitterComponent } from './grid-splitter/grid-splitter.component'
import { CommanderComponent } from './commander/commander.component'
import { FullPathPipe } from './pipes/full-path.pipe';
import { DialogComponent as TestDialogComponent } from './test/dialog/dialog.component'
import { DialogComponent } from './dialog/dialog.component';
import { SelectAllDirective } from './directives/select-all.directive';
import { DefaultButtonDirective } from './directives/default-button.directive';
import { ConnectionComponent } from './test/connection/connection.component'

@NgModule({
    declarations: [
        AppComponent,
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
        TestCommanderViewComponent,
        DriveItemComponent,
        FileSizePipe,
        DatePipe,
        FileExtensionPipe,
        NoFileExtensionPipe,
        FileIconPipe,
        FolderComponent,
        DriveComponent,
        NetworkdriveComponent,
        CdromComponent,
        UsbComponent,
        ParentItemComponent,
        VirtualListPipe,
        ClipHeightPipe,
        TestRestrictor,
        GridComponent,
        GridSplitterComponent,
        CommanderComponent,
        FullPathPipe,
        TestDialogComponent,
        DialogComponent,
        SelectAllDirective,
        DefaultButtonDirective,
        ConnectionComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    providers: [ItemProcesserFactoryService],
    bootstrap: [AppComponent]
})
export class AppModule { }
