import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-transfer-out',
  standalone: true,
  imports: [CommonModule,RouterModule,LayoutComponent],
  templateUrl: './transfer-out.component.html',
  styleUrl: './transfer-out.component.scss'
})
export class TransferOutComponent {
  isLoggedIn = !!sessionStorage.getItem('token');
  constructor(private router:Router){

  }
  homePage(){
    console.log('========function call============')
    
    this.router.navigate(['/layout'])
    
  }
}
