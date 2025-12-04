import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
  // WICHTIG: Hier darf NUR <router-outlet> stehen!
  // Kein <app-sidebar>, kein <div>, gar nichts sonst.
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {} // Oder "App", je nachdem wie deine Klasse heißt