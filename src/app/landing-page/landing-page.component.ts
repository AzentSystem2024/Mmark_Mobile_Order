import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor(private routes:Router){}
 isSidebarOpen = false;
  // isSidebarOpen = false;
  isProfileVisible = true;


 toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
   navigateAndClose(path: string) {
     this.routes.navigate([path]);
    this.closeSidebar();
  }

}
