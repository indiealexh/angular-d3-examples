import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BarchartComponent } from './barchart/barchart.component';
import { PedigreeComponent } from './pedigree/pedigree.component';
import { SvgBuilderComponent } from './pedigree/svg-builder/svg-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    PedigreeComponent,
    SvgBuilderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
