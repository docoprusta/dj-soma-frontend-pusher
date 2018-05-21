import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';


const routes: Routes = [
  { path : '', redirectTo: 'search', pathMatch: 'full'},
  { path: 'playlist', component: PlaylistComponent },
  { path: 'search', component: SearchComponent },
  { path: 'appsettings', component: AppSettingsComponent }
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [RouterModule.forRoot(routes, { useHash: true })]
})

export class AppRoutingModule { }
