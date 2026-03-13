import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pull-to-refresh',
  standalone: true,         
  imports: [CommonModule],   
  templateUrl: './pull-to-refresh.component.html',
  styleUrls: ['./pull-to-refresh.component.scss']
})
export class PullToRefreshComponent {

  @Output() refresh = new EventEmitter<void>();

startY = 0;
pullDistance = 0;
refreshing = false;

readonly THRESHOLD = 90;
readonly MAX_PULL = 120;

onTouchStart(e: TouchEvent) {
  if (window.scrollY === 0 && !this.refreshing) {
    this.startY = e.touches[0].clientY;
  }
}

onTouchMove(e: TouchEvent) {
  if (!this.startY || this.refreshing) return;

  // 🔴 STOP browser scroll refresh
  e.preventDefault();

  const currentY = e.touches[0].clientY;
  this.pullDistance = Math.max(0, currentY - this.startY);
}


onTouchEnd() {
  if (this.pullDistance > 90) {
    this.refreshing = true;
    this.pullDistance = 90;

    this.refresh.emit();

    setTimeout(() => {
      this.refreshing = false;
      this.pullDistance = 0;
    }, 2000);
  } else {
    this.pullDistance = 0;
  }

  this.startY = 0;
}


/* 🎯 Circle movement + rotation */
get circleTransform(): string {
  if (this.refreshing) {
    return `translate(-50%, 16px)`;
  }

  const y = Math.min(this.pullDistance - 50, 70);
  const rotate = Math.min(this.pullDistance * 2, 180);

  return `translate(-50%, ${y}px) rotate(${rotate}deg)`;
}

/* 🎨 Grey → Light Green → Dark Green */
get pullRatio() {
  return Math.min(this.pullDistance / 90, 1);
}

get iconColor() {
  const r = Math.floor(120 - this.pullRatio * 40);
  const g = Math.floor(200 + this.pullRatio * 40);
  const b = Math.floor(120 - this.pullRatio * 40);
  return `rgb(${r}, ${g}, ${b})`;
}




}
