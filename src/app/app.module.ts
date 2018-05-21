import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { SongService } from './services/song.service';
import { YoutubeService } from './services/youtube.service';
import { MinuteSecondsPipe } from './minute-seconds.pipe';
import { AppSettingsComponent } from './app-settings/app-settings.component';

// const config: SocketIoConfig = { url: localStorage.getItem("baseUrl"), options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PlaylistComponent,
    SearchComponent,
    MinuteSecondsPipe,
    AppSettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    Ng4LoadingSpinnerModule.forRoot(),
    // SocketIoModule.forRoot(config)
  ],
  providers: [
    SongService,
    YoutubeService,
    MinuteSecondsPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
