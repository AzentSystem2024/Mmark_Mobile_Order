import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
 isSidebarOpen = false;
LoginResponse:any;
  constructor(private router: Router) {

    const savedData = JSON.parse(sessionStorage.getItem('token') || '{}');
console.log(savedData);
this.LoginResponse=savedData;


  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.closeSidebar();
  }

  logOut(){
      this.router.navigate(['/']);
  }
}
