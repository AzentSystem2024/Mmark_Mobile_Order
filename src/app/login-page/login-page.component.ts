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
  FormsModule,
} from '@angular/forms';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

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
  showChangePasswordPopup:boolean = false;

  passwordMatch: boolean | null = null;

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  oldPasswordError = false;
  newPasswordError = false;
  confirmPasswordError = false;

  showValidation = false;
  loginNamePwdPolicy :any;
  passwordPolicyData:any;

  oldPasswordValid = false;
  oldPasswordMessage = '';

  passwordPolicyError = '';
  passwordPolicyValid = false;


  showForgotPopup = false;
  showOtpBox = false;

  forgotEmail = '';
  otp = '';

  emailError = false;
  otpError = false;

  otpArray: string[] = ['', '', '', '', '', ''];
  otpDigits: string[] = ['', '', '', '', '', ''];

  timer = 60;
  interval: any;

  isSendingOtp = false;

  isVerifyingOtp = false;

  otpValue: string = '';

  otpId :any;

  changePassword = {
  OLD_PASSWORD: '',
  NEW_PASSWORD: '',
  CONFIRM_PASSWORD: ''
};


  showResetPasswordPopup = false;

  resetPassword = {
    NEW_PASSWORD: '',
    CONFIRM_PASSWORD: ''
  };

  resetPasswordError = false;
  passwordMismatch = false;

  resetPasswordPolicyError = '';
  resetPasswordPolicyValid = false;

  isUpdatingPassword = false;

  isSavingPassword = false;



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
       
        if (res.flag == 1) {


  this.isLogin = false;

  // 🔹 check password change flag
  if (res.IS_PWD_CHANGE === true) {
    sessionStorage.setItem('LOGIN_NAME', JSON.stringify(res.LOGIN_NAME));
    this.loginNamePwdPolicy = JSON.parse(sessionStorage.getItem('LOGIN_NAME') || '');
    this.showChangePasswordPopup = true;

    } else {

      sessionStorage.setItem('SessionID', JSON.stringify(res.SessionID));
      sessionStorage.setItem('LogData', JSON.stringify(res));

      this.showSnackBar('User logged in successfully', 'success');

      this.isLoggingIn = true;

      setTimeout(() => {
        this.routes.navigate(['/home']);
      }, 700);

    }
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


  validateCurrentPassword() {

  if (!this.changePassword.OLD_PASSWORD) return;

  const payload = {
    LoginName: this.loginNamePwdPolicy,
    CurrentPassword: this.changePassword.OLD_PASSWORD
  };

  this.dataservice.fetchPasswordPolicyData(payload).subscribe((res: any) => {

    if (res.FLAG === 2) {

      this.oldPasswordError = true;
      this.oldPasswordValid = false;
      this.oldPasswordMessage = res.MESSAGE;

    }

    if (res.FLAG === 1) {

      this.oldPasswordError = false;
      this.oldPasswordValid = true;
      this.oldPasswordMessage = '';

    }

    this.passwordPolicyData = res.DATA?.[0];

  });

}


validatePasswordPolicy() {

  const password = this.changePassword.NEW_PASSWORD;

  if (!password) {
    this.passwordPolicyError = '';
    this.passwordPolicyValid = false;
    return;
  }

  const policy = this.passwordPolicyData;

  if (password.length < policy.MinLength) {
    this.passwordPolicyError = `Password must be at least ${policy.MinLength} characters`;
    this.passwordPolicyValid = false;
    return;
  }

  if (policy.RequireUppercase && !/[A-Z]/.test(password)) {
    this.passwordPolicyError = "Password must contain an uppercase letter";
    this.passwordPolicyValid = false;
    return;
  }

  if (policy.RequireLowercase && !/[a-z]/.test(password)) {
    this.passwordPolicyError = "Password must contain a lowercase letter";
    this.passwordPolicyValid = false;
    return;
  }

  if (policy.RequireDigit && !/[0-9]/.test(password)) {
    this.passwordPolicyError = "Password must contain a number";
    this.passwordPolicyValid = false;
    return;
  }

  if (policy.RequireSpecialCharacter && !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    this.passwordPolicyError = "Password must contain a special character";
    this.passwordPolicyValid = false;
    return;
  }

  this.passwordPolicyError = '';
  this.passwordPolicyValid = true;

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

savePassword() {

  this.showValidation = true;

  if(this.oldPasswordError){
    this.oldPasswordMessage = "Invalid password";
    return;
  }


  // required validations
  this.oldPasswordError = !this.changePassword.OLD_PASSWORD;
  this.newPasswordError = !this.changePassword.NEW_PASSWORD;
  this.confirmPasswordError = !this.changePassword.CONFIRM_PASSWORD;

   
  if (!this.passwordPolicyValid) {
  return;
}



   // Check current password API validation
  // if (!this.oldPasswordValid) {
  //   this.oldPasswordError = true;

  //   if (!this.oldPasswordMessage) {
  //     this.oldPasswordMessage = "Invalid password";
  //   }

  //   return;
  // }



  // stop if required fields missing
  if (
    this.oldPasswordError ||
    this.newPasswordError ||
    this.confirmPasswordError
  ) {
    return;
  }

 


  // check password match
  if (this.passwordMatch === false) {
    return;
  }

  this.isSavingPassword = true;

  const payload = {
    Action : 1,
    LoginName: this.loginNamePwdPolicy,
    NewPassword: this.changePassword.NEW_PASSWORD
  };

  this.dataservice.updatePassword(payload).subscribe((res: any) => {

    this.isSavingPassword = false;

    if (res.FLAG === 1) {

      // 🔹 Clear validation flags
      this.showValidation = false;
      this.oldPasswordError = false;
      this.newPasswordError = false;
      this.confirmPasswordError = false;
      this.passwordPolicyError = '';
      this.passwordPolicyValid = false;
      this.passwordMatch = null;
      this.oldPasswordValid = false;
      this.oldPasswordMessage = '';
      this.changePassword.OLD_PASSWORD = '';
      this.changePassword.NEW_PASSWORD = '';
      this.changePassword.CONFIRM_PASSWORD = '';
      this.passwordPolicyData = '';
      this.isSavingPassword = false;
 
      this.loginForm.reset();

      localStorage.clear();
      sessionStorage.clear();

      this.toastr.success("Password changed successfully");

      this.showChangePasswordPopup = false;



      this.routes.navigate(['/home']);

    } else {

      this.isSavingPassword = false;
      this.toastr.error(res.MESSAGE || "Failed to update password");

    }
    
  });
}


cancelForgotPassword() {

  this.showForgotPopup = false;
  this.showOtpBox = false;

  this.isVerifyingOtp = false;
  this.isSendingOtp = false;

  this.forgotEmail = '';

  this.otpDigits = ['', '', '', '', '', ''];
  this.otpArray = ['', '', '', '', '', ''];

  this.otpError = false;
  this.emailError = false;

  if (this.interval) {
    clearInterval(this.interval);
  }

}


cancelResetPassword() {

  // close popup
  this.showResetPasswordPopup = false;

  // clear password fields
  this.resetPassword = {
    NEW_PASSWORD: '',
    CONFIRM_PASSWORD: ''
  };

  // clear validation states
  this.resetPasswordError = false;
  this.passwordMismatch = false;
  this.resetPasswordPolicyError = '';
  this.resetPasswordPolicyValid = false;

  // stop loader if running
  this.isUpdatingPassword = false;

  // reset eye icons
  this.showNewPassword = false;
  this.showConfirmPassword = false;

}


closeChangePasswordPopup() {
  this.showChangePasswordPopup = false;

  this.changePassword = {
    OLD_PASSWORD: '',
    NEW_PASSWORD: '',
    CONFIRM_PASSWORD: ''
  };

  this.showValidation = false;
  this.passwordPolicyError = '';
  this.passwordMatch = null;
  this.oldPasswordError = false;
  this.oldPasswordValid = false;
}


checkPasswordMatch() {

  if (!this.changePassword.CONFIRM_PASSWORD) {
    this.passwordMatch = null;
    return;
  }

  this.passwordMatch =
    this.changePassword.NEW_PASSWORD ===
    this.changePassword.CONFIRM_PASSWORD;

}



openForgotPassword() {
  this.showForgotPopup = true;
  this.showOtpBox = false;
  this.forgotEmail = '';
  this.otp = '';
}

sendOtp() {

  if (!this.forgotEmail) {
    this.emailError = true;
    return;
  }

  this.isSendingOtp = true;

  const payload = {
    Email: this.forgotEmail.trim()
  };

  this.dataservice.generateOtp(payload).subscribe((res: any) => {

    this.isSendingOtp = false;

    if (res.flag === 2) {

      // Error case
      this.toastr.error(res.message);
      return;

    }

    if (res.flag === 1) {

      this.otpId = res.OtpID;
      // Success case
      this.toastr.success(res.message);

      this.emailError = false;

      this.showOtpBox = true;

      // focus first box
      setTimeout(() => {
        this.otpInputs.first.nativeElement.focus();
      });

      this.startTimer();

    }

  }, () => {
    this.isSendingOtp = false;
    this.toastr.error("Failed to send OTP");

  });

}


moveNext(event: any, index: number) {

  const input = event.target;

  if (input.value && index < this.otpInputs.length - 1) {
    this.otpInputs.toArray()[index + 1].nativeElement.focus();
  }

  if (!input.value && event.inputType === "deleteContentBackward" && index > 0) {
    this.otpInputs.toArray()[index - 1].nativeElement.focus();
  }

}

verifyOtp() {

  const otp = this.otpDigits.join('');

  if (!otp || otp.length !== this.otpDigits.length) {
    this.otpError = true;
    return;
  }

  this.otpError = false;
  this.isVerifyingOtp = true;

  const payload = {
    OtpID: this.otpId,
    Otp: otp
  };

  this.dataservice.verifyOtp(payload).subscribe((res: any) => {

    this.isVerifyingOtp = false;

    // ✅ OTP verified
    if (res.flag === 1) {

      this.toastr.success(res.message);

      this.showResetPasswordPopup = true;

      // // close popup or move to reset password screen
      this.showForgotPopup = false;

      this.showOtpBox = false;
      

      // optionally redirect
      // this.routes.navigate(['/reset-password']);

    }

    // ❌ Invalid OTP
    else if (res.flag === 2) {

      this.toastr.error(res.message);
      this.otpError = true;

    }

    // ⏱ OTP expired
    else if (res.flag === 3) {

      this.toastr.warning(res.message);

      // clear boxes
      this.otpDigits = ['', '', '', '', '', ''];

      // focus first box
      setTimeout(() => {
        this.otpInputs.first.nativeElement.focus();
      });

    }

    // ⚠ server error
    else {

      this.toastr.error(res.message || "OTP verification failed");

    }

  }, () => {

    this.isVerifyingOtp = false;
    this.toastr.error("Server error while verifying OTP");

  });

}

startTimer() {

  this.timer = 60;

  this.interval = setInterval(() => {

    if (this.timer > 0) {
      this.timer--;
    } else {
      clearInterval(this.interval);
    }

  }, 1000);

}

resendOtp() {

  if (!this.forgotEmail) {
    this.toastr.error("Email not found");
    return;
  }

  
  this.otpDigits = ['', '', '', '', '', ''];
  this.otpArray = ['', '', '', '', '', ''];

   // 🔹 clear input boxes manually
  this.otpInputs.forEach((input) => {
    input.nativeElement.value = '';
  });


  this.isSendingOtp = true;
  

  const payload = {
    Email: this.forgotEmail.trim()
  };

  this.dataservice.generateOtp(payload).subscribe((res: any) => {

    this.isSendingOtp = false;

    if (res.flag === 1) {

      this.otpId = res.OtpID;

      this.toastr.success("OTP resent successfully");

      // reset OTP boxes
      this.otpDigits = ['', '', '', '', '', ''];
      this.otpArray = ['', '', '', '', '', ''];

      // restart timer
      this.startTimer();
      

      // focus first box
      setTimeout(() => {
        this.otpInputs.first.nativeElement.focus();
      });

    } 
    else {

      this.toastr.error(res.message || "Failed to resend OTP");

    }

  }, () => {

    this.isSendingOtp = false;
    this.toastr.error("Server error while resending OTP");

  });

}


onOtpInput(event: any, index: number) {

  let input = event.target.value;

  // Allow only numbers
  input = input.replace(/[^0-9]/g, '').slice(0,1);

  console.log(input, "input");

  // Update textbox
  event.target.value = input;

  // Store in separate OTP array
  this.otpDigits[index] = input;

  // Build OTP string
  this.otpValue = this.otpDigits.join('');

  console.log(this.otpValue, "otp");

  // Move focus
  if (input && index < this.otpDigits.length - 1) {
    this.otpInputs.toArray()[index + 1].nativeElement.focus();
  }

  // Check if OTP completed
  if (!this.otpDigits.includes('')) {
    this.verifyOtp();
  }

}

onOtpKeyDown(event: KeyboardEvent, index: number) {

  if (event.key === 'Backspace') {

    // clear current value
    this.otpArray[index] = '';

    const input = this.otpInputs.toArray()[index].nativeElement;
    input.value = '';

    // move to previous box
    if (index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }

  }

}


checkResetPasswordMatch() {

  if (!this.resetPassword.CONFIRM_PASSWORD) {
    this.passwordMismatch = false;
    return;
  }

  this.passwordMismatch =
    this.resetPassword.NEW_PASSWORD !==
    this.resetPassword.CONFIRM_PASSWORD;

}

updateForgotPassword() {

  if (!this.resetPassword.NEW_PASSWORD || !this.resetPassword.CONFIRM_PASSWORD) {
    this.resetPasswordError = true;
    return;
  }

  if (!this.resetPasswordPolicyValid) {
    return;
  }

  if (this.passwordMismatch) {
    return;
  }

  const payload = {
    Action: 2,
    OtpID : this.otpId,
    NewPassword: this.resetPassword.NEW_PASSWORD
  };

  this.isUpdatingPassword = true;

  this.dataservice.updatePassword(payload).subscribe((res:any)=>{

    this.isUpdatingPassword = false;

    if(res.FLAG === 1){

      this.toastr.success("Password reset successfully");

      this.showResetPasswordPopup = false;
      this.showForgotPopup = false;

    } else {

      this.isUpdatingPassword = false;

      this.toastr.error(res.message);

    }

  });

}


validateResetPasswordPolicy() {

  const password = this.resetPassword.NEW_PASSWORD;

  // 🔹 Static Password Policy
  const policy = {
    MinLength: 8,
    RequireUppercase: true,
    RequireLowercase: true,
    RequireDigit: true,
    RequireSpecialCharacter: true
  };

  if (!password) {
    this.resetPasswordPolicyError = '';
    this.resetPasswordPolicyValid = false;
    return;
  }

  if (password.length < policy.MinLength) {
    this.resetPasswordPolicyError =
      `Password must be at least ${policy.MinLength} characters`;
    this.resetPasswordPolicyValid = false;
    return;
  }

  if (policy.RequireUppercase && !/[A-Z]/.test(password)) {
    this.resetPasswordPolicyError =
      "Password must contain at least one uppercase letter";
    this.resetPasswordPolicyValid = false;
    return;
  }

  if (policy.RequireLowercase && !/[a-z]/.test(password)) {
    this.resetPasswordPolicyError =
      "Password must contain at least one lowercase letter";
    this.resetPasswordPolicyValid = false;
    return;
  }

  if (policy.RequireDigit && !/[0-9]/.test(password)) {
    this.resetPasswordPolicyError =
      "Password must contain at least one number";
    this.resetPasswordPolicyValid = false;
    return;
  }

  if (policy.RequireSpecialCharacter && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    this.resetPasswordPolicyError =
      "Password must contain at least one special character";
    this.resetPasswordPolicyValid = false;
    return;
  }

  this.resetPasswordPolicyError = '';
  this.resetPasswordPolicyValid = true;
}


}
