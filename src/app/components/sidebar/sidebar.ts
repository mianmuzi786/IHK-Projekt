import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  // HIER ist die Änderung: Wir verlinken auf die Dateien
  templateUrl: './sidebar.html', 
  styleUrls: ['./sidebar.scss']  // oder .css, je nachdem was du nutzt
})
export class SidebarComponent {}