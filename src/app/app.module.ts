import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmDirectionModule } from 'agm-direction';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBVst5D1IiluQ1IlYfbo2xbAI4ogKRPx6A',
      libraries: ['visualization', 'geometry'] 
    }),
    AgmDirectionModule,
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
