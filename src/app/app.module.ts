import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { TestAddonComponent } from './test/test-addon/test-addon.component'
import { ScrollbarComponent as TestScrollbarComponent } from './test/scrollbar/scrollbar.component'
import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { ColumnsComponent as TestColumnsComponent } from './test/columns/columns.component'
import { ColumnsComponent } from './columns/columns.component'

@NgModule({
    declarations: [
        AppComponent,
        TestAddonComponent,
        TestScrollbarComponent,
        TestColumnsComponent,
        ScrollbarComponent,
        ColumnsComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
