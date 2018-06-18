import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { TestAddonComponent } from './test/test-addon/test-addon.component'
import { ScrollbarComponent } from './test/scrollbar/scrollbar.component'

@NgModule({
  declarations: [
    AppComponent,
    TestAddonComponent,
    ScrollbarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
