import { Component } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  loginForm: FormGroup;
  logoPath = 'assets/M mark Logo.png';
  LoginNameError: boolean=false;
  PasswordError: boolean=false;
  showPassword = false;
  isLoggingIn = false;
  showSemiTab = true;
  isLogin = false;

  showSnack = false;
  snackMessage = '';
  snackType: 'success' | 'error' = 'success';
  snackTimer: any;

  constructor(
    private fb: FormBuilder,
    private dataservice: MyserviceService,
    private routes: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      LOGIN_NAME: ['', Validators.required],
      PASSWORD: ['', Validators.required],
    });
  }

  onLogin() {
    this.isLogin = true;
    console.log('function call');

  console.log(this.loginForm.value)
  const loginDetails=this.loginForm.value;

    if(!loginDetails.LOGIN_NAME )
    {
    this.LoginNameError=true
    this.isLogin = false;
    } else{
      this.LoginNameError=false
    }

if(!loginDetails.PASSWORD)
    {
    this.PasswordError=true
    this.isLogin = false;
    } else{
      this.PasswordError=false
    }
    
    if (this.loginForm.valid) {
      const payload = this.loginForm.value;
      console.log('Payload:', payload);
      this.dataservice.Login(payload).subscribe((res:any)=>{
       
        if(res.flag==1)
        {
       sessionStorage.setItem('SessionID', JSON.stringify(res.SessionID));
       sessionStorage.setItem('LogData', JSON.stringify(res));
        // this.toastr.success("User logged in successfully");
        this.showSnackBar(
          'User logged in successfully',
          'success'
        );
        this.isLoggingIn = true;
        setTimeout(() => {
          this.routes.navigate(['/home']);
        }, 700);   // matches CSS transition time

        this.isLogin = false;

        }
        else{
        // this.toastr.error("Incorrect login name or password");

        this.showSnackBar(
          'Incorrect login name or password',
          'error'
        );
        this.isLogin = false;

        }
      })

    
    } else {
      console.log('Form is invalid');
      this.isLogin = false;
    }
  }


  OnchangeLoginanme(){
    this.LoginNameError=false;
  }
  OnchangePassword(){
    this.PasswordError=false;
  }

  showSnackBar(
  message: string,
  type: 'success' | 'error' = 'success',
  duration = 2500
) {
  this.snackMessage = message;
  this.snackType = type;
  this.showSnack = true;

  clearTimeout(this.snackTimer);

  this.snackTimer = setTimeout(() => {
    this.showSnack = false;
  }, duration);
}
}
