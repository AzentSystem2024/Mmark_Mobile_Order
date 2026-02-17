import { Component } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-order-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './view-order-list.component.html',
  styleUrl: './view-order-list.component.scss'
})
export class ViewOrderListComponent {


  orders: any[] = [];
  isLoading = true;

  selectedFilter: string = 'TODAY';
  allOrders: any[] = [];

  constructor(private service:MyserviceService , private router:Router){}

  ngOnInit() {
    
    // ✅ restore last selected filter
    const savedFilter = sessionStorage.getItem('ORDER_LIST_FILTER');
    if (savedFilter) {
      this.selectedFilter = savedFilter;
    }
    this.loadOrders();
  }

  loadOrders() {
  this.isLoading = true;

  const login = JSON.parse(sessionStorage.getItem('LogData') || '{}');

  const payload = {
    SALESMAN_ID: login.USER_ID
  };

  this.service.getOrderList(payload).subscribe((res: any) => {
    if (res.flag === "1") {
      this.allOrders = (res.data || []).map((o: any) => {

        const utcDate = new Date(o.ORDER_DATE + 'Z'); // force UTC

        return {
          ...o,
          ORDER_DATE: utcDate
        };

      });
      this.applyDateFilter();   // 👈 apply default filter
    }

    this.isLoading = false;
  });
}

  applyDateFilter() {

  // ✅ persist selected filter
  sessionStorage.setItem('ORDER_LIST_FILTER', this.selectedFilter);

  if (this.selectedFilter === 'ALL') {
    this.orders = [...this.allOrders];
    return;
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  let fromDate = new Date(today);

  switch (this.selectedFilter) {

    case 'TODAY':
      fromDate = new Date(today);
      break;

    case 'YESTERDAY':
      fromDate.setDate(today.getDate() - 1);
      today.setDate(today.getDate() - 1);
      break;

    default:
      const days = Number(this.selectedFilter);
      fromDate.setDate(today.getDate() - days);
      break;
  }

  this.orders = this.allOrders.filter(o => {

    const orderDate = new Date(o.ORDER_DATE);
    orderDate.setHours(0,0,0,0);

    if (this.selectedFilter === 'YESTERDAY') {
      return orderDate.getTime() === fromDate.getTime();
    }

    return orderDate >= fromDate;
  });
}


getOrderForLabel(o: any): string {

  const dealer = o.DEALER_NAME?.trim();
  const subDealer = o.SUB_DEALER_NAME?.trim();
  const retailer = o.RETAILER_NAME?.trim();

  // Retailer + Dealer
  if (retailer) {
    return dealer
      ? `Retailer : ${retailer}\nDealer : ${dealer}`
      : `Retailer : ${retailer}`;
  }

  // SubDealer + Dealer
  if (subDealer) {
    return dealer
      ? `Sub Dealer : ${subDealer}\nDealer : ${dealer}`
      : `Sub Dealer : ${subDealer}`;
  }

  // Dealer only
  if (dealer) {
    return `Dealer : ${dealer}`;
  }

  return '';
}




  openOrder(order: any) {
    // later → detailed screen
    this.router.navigate(['/view-order', order.ID],
      {
      state: { ORDER_NO: order.ORDER_NO }
    }
    );
  }

  goBack() {
  history.back();
}

}
