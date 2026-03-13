import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NetworkService } from './network.service';
import { CommonModule } from '@angular/common';
import { PullToRefreshComponent } from './pull-to-refresh/pull-to-refresh.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule ],
  templateUrl: './app.component.html',
})
export class AppComponent {

  showOffline = false;
  showBackOnline = false;

  private prevOnline: boolean | null = null;
  private backOnlineTimer: any;

  constructor(public network: NetworkService ) {

    this.network.onlineStatus$().subscribe(isOnline => {

      // 🔹 first load
      if (this.prevOnline === null) {
        this.showOffline = !isOnline;
        this.prevOnline = isOnline;
        return;
      }

      // 🔴 went offline
      if (!isOnline && this.prevOnline) {
        this.showOffline = true;
        this.showBackOnline = false;
      }

      // 🟢 came back online
      if (isOnline && !this.prevOnline) {
        this.showOffline = false;
        this.showBackOnline = true;

        clearTimeout(this.backOnlineTimer);

        // ⏱ auto hide after 1s
        this.backOnlineTimer = setTimeout(() => {
          this.showBackOnline = false;
        }, 1000);
      }

      this.prevOnline = isOnline;
    }); 
  }

//   onGlobalRefresh() {
//   const url = this.router.url;
//   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//     this.router.navigateByUrl(url);
//   });
// }
}
