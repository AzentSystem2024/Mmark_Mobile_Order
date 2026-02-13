import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const sessionId = sessionStorage.getItem('SessionID');

    if (sessionId) {
      return true; // logged in
    }

    // not logged in
    this.router.navigate(['']);
    return false;
  }
}
