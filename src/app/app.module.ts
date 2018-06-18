import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { TestAddonComponent } from './test/test-addon/test-addon.component'
import { ScrollbarComponent as TestScrollbarComponent } from './test/scrollbar/scrollbar.component'
import { ScrollbarComponent } from './scrollbar/scrollbar.component'

@NgModule({
    declarations: [
        AppComponent,
        TestAddonComponent,
        TestScrollbarComponent,
        ScrollbarComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
