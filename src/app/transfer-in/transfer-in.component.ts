import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-transfer-in',
  standalone: true,
  imports: [CommonModule,RouterModule,LayoutComponent],
  templateUrl: './transfer-in.component.html',
  styleUrl: './transfer-in.component.scss'
})
export class TransferInComponent {
  isLoggedIn = !!sessionStorage.getItem('token');
  constructor(private router:Router){

  }
  homePage(){
    console.log('========function call============')
    
    this.router.navigate(['/layout'])
    
  }
}
