import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyserviceService } from '../myservice.service';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  @ViewChild('dealerInput') dealerInput!: ElementRef;
  @ViewChild('retailerInput') retailerInput!: ElementRef;
  @ViewChild('subDealerInput') subDealerInput!: ElementRef;
  
  cartCount = 0;
  sessionID =0;
  constructor(private router: Router,
    private service:MyserviceService,
    private toastr: ToastrService
  ) {
    this.sessionID = JSON.parse(sessionStorage.getItem('SessionID') || '0');
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.cartCount = cart.length;
  }

  showLogoutConfirm = false;
  isLoggingOut = false;
  distributorName = '';
  retailerName = '';

  selectedType: 'DEALER' | 'SUB_DEALER' | 'RETAILER' = 'DEALER';

  selectedDealer: number | null = null;
  selectedRetailer: number | null = null;

  subDealers: any[] = [];
  filteredSubDealers: any[] = [];
  subDealerSearch = '';
  showSubDealerList = false;
  selectedSubDealer: number | null = null;

  // dummy data for now (replace with API later)
  dealers :any[] = [];

  retailers :any[] = [];

  dealerSearch = '';
  showDealerList = false;
  filteredDealers: any[] = [];

  retailerSearch = '';
  showRetailerList = false;

  filteredRetailers: any[] = [];
  
  userType!: number;

  userName:any;

  showDealerRetailerSelect = false;

  showCartWarning = false;

  typeHistory:any;


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // if click is NOT inside dropdown-box → close lists
  if (!target.closest('.dropdown-box')) {
    this.showDealerList = false;
    this.showRetailerList = false;
  }
}

  ngOnInit() {

  const logDataStr = sessionStorage.getItem('LogData');

  if (logDataStr) {
    const logData = JSON.parse(logDataStr);

    this.userType = Number(logData.USER_TYPE);
    this.showDealerRetailerSelect = this.userType != 4 && this.userType !== 13;

    this.distributorName = logData?.DISTRIBUTOR_NAME || '';
    this.retailerName = logData?.RETAILER_NAME || '';
    this.userName = logData?.USER_NAME || '';
  }

  const orderForStr = sessionStorage.getItem('ORDER_FOR');

  if (orderForStr) {

    const orderFor = JSON.parse(orderForStr);

    if (orderFor.RETAILER_ID) {
      this.selectedType = 'RETAILER';
      this.typeHistory = this.selectedType;
      this.selectedRetailer = orderFor.RETAILER_ID;
      this.retailerSearch = orderFor.RETAILER_NAME;
    }
    else if (orderFor.SUB_DEALER_ID) {
      this.selectedType = 'SUB_DEALER';
      this.typeHistory = this.selectedType;
      this.selectedSubDealer = orderFor.SUB_DEALER_ID;
      this.subDealerSearch = orderFor.SUB_DEALER_NAME;
    }
    else if (orderFor.DEALER_ID) {
      this.selectedType = 'DEALER';
      this.typeHistory = this.selectedType;
      this.selectedDealer = orderFor.DEALER_ID;
      this.dealerSearch = orderFor.DEALER_NAME;
    }

    // 🔥 Load correct dropdown WITHOUT resetting selection
    this.loadDropdownData(this.selectedType, true);

  } else {
    // first time load
    this.loadDropdownData('DEALER');
  }

}


  selectDealer(d: any) {

    if (this.hasCartItems() && this.selectedDealer !== d.ID) {
    this.toastr.warning('Clear cart before changing customer');
    return;
  }
    this.selectedDealer = d.ID;
    this.dealerSearch = d.DESCRIPTION;
    this.showDealerList = false;
  }

  filterRetailers() {
  const term = this.retailerSearch.trim().toLowerCase();

  if (!term) {
    this.filteredRetailers = [...this.retailers];
    this.showRetailerList = true;
    return;
  }

  this.filteredRetailers = this.retailers.filter(r =>
    r.DESCRIPTION?.toLowerCase().startsWith(term)
  );

  this.showRetailerList = true;
}



  filterDealers() {
  const term = this.dealerSearch.trim().toLowerCase();

  if (!term) {
    this.filteredDealers = [...this.dealers];
    this.showDealerList = true;   // 🔥 important
    return;
  }

  this.filteredDealers = this.dealers.filter(d =>
    d.DESCRIPTION?.toLowerCase().startsWith(term)
  );

  this.showDealerList = true;     // 🔥 important
}



filterSubDealers() {
  const term = this.subDealerSearch.trim().toLowerCase();

  if (!term) {
    this.filteredSubDealers = [...this.subDealers];
    this.showSubDealerList = true;
    return;
  }

  this.filteredSubDealers = this.subDealers.filter(s =>
    s.DESCRIPTION?.toLowerCase().startsWith(term)
  );

  this.showSubDealerList = true;
}



  selectRetailer(r: any) {

  if (this.hasCartItems() && this.selectedRetailer !== r.ID) {
    this.toastr.warning('Clear cart before changing customer');
    return;
  }

  this.selectedRetailer = r.ID;
  this.retailerSearch = r.DESCRIPTION;
  this.showRetailerList = false;
}

selectSubDealer(s: any) {

  if (this.hasCartItems() && this.selectedSubDealer !== s.ID) {
    this.toastr.warning('Clear cart before changing customer');
    return;
  }

  this.selectedSubDealer = s.ID;
  this.subDealerSearch = s.DESCRIPTION;
  this.showSubDealerList = false;
}



  onTypeChange(type: 'DEALER' | 'RETAILER' | 'SUB_DEALER') {

  if (this.hasCartItems()) {

    this.toastr.warning('Please clear the cart before changing Dealer/Sub Dealer/Retailer');

    // 🔥 restore previous selection properly
    setTimeout(() => {
      this.selectedType = this.typeHistory;
    });

    return;
  }

  this.selectedType = type;
  this.typeHistory = type; 

  this.selectedDealer = null;
  this.selectedRetailer = null;
  this.selectedSubDealer = null;

  this.dealerSearch = '';
  this.retailerSearch = '';
  this.subDealerSearch = '';

  this.loadDropdownData(type);
}


  loadDropdownData(type: 'DEALER' | 'RETAILER' | 'SUB_DEALER', isRestore = false) {

  const payload = { NAME: type };

  this.service.get_DropDown_Data(payload).subscribe((res: any) => {

    if (type === 'DEALER') {
      this.dealers = res || [];
      this.filteredDealers = [...this.dealers];

      if (!isRestore) {
        setTimeout(() => {
          this.dealerInput?.nativeElement.focus();
          this.showDealerList = true;
        });
      }
    }

    if (type === 'SUB_DEALER') {
      this.subDealers = res || [];
      this.filteredSubDealers = [...this.subDealers];

      if (!isRestore) {
        setTimeout(() => {
          this.subDealerInput?.nativeElement.focus();
          this.showSubDealerList = true;
        });
      }
    }

    if (type === 'RETAILER') {
      this.retailers = res || [];
      this.filteredRetailers = [...this.retailers];

      if (!isRestore) {
        setTimeout(() => {
          this.retailerInput?.nativeElement.focus();
          this.showRetailerList = true;
        });
      }
    }

  });
}

 //focus input fields
  handleReadonlyFocus(event: FocusEvent) {

  if (this.hasCartItems()) {

    // remove focus immediately
    (event.target as HTMLElement).blur();

    this.toastr.warning(
      'Clear cart before changing value'
    );
  }
}



  openLogoutConfirm() {

  const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

  if (cart.length > 0) {
    this.showCartWarning = true;  // new popup
  } else {
    this.showLogoutConfirm = true;
  }

}

clearCartAndLogout() {

  sessionStorage.removeItem('cart');

  this.showCartWarning = false;

  this.confirmLogout();  // call your existing logout logic

}



cancelLogout() {
  this.showLogoutConfirm = false; // stay on page
}

confirmLogout() {

  this.showLogoutConfirm = false;

  if (this.isLoggingOut) return;
  this.isLoggingOut = true;
  const payload ={
    SessionID : this.sessionID
  }

  this.service.logout(payload).subscribe({
    next: (res: any) => {

      if (res.Success === "1") {

        // clear session
        localStorage.clear();
        sessionStorage.clear();

        // trigger logo animation
        

        // redirect after animation
        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        }, 100);
        this.isLoggingOut = true;

      } else {
        this.isLoggingOut = false;
      }
    },
    error: () => {
      this.isLoggingOut = false;
    }
  });
}


  goToNewOrder() {

  if (this.showDealerRetailerSelect) {

    if (this.selectedType === 'DEALER' && !this.selectedDealer) {
      this.toastr.warning(
        'Please select a Dealer before creating a new order'
      );
      return;
    }

    if (this.selectedType === 'SUB_DEALER' && !this.selectedSubDealer) {
      this.toastr.warning(
        'Please select a Sub Dealer before creating a new order'
      );
      return;
    }

    if (this.selectedType === 'RETAILER' && !this.selectedRetailer) {
      this.toastr.warning(
        'Please select a Retailer before creating a new order'
      );
      return;
    }

    // optional: store selection
    sessionStorage.setItem(
      'ORDER_FOR',
      JSON.stringify({
      DEALER_ID: this.selectedDealer,
      SUB_DEALER_ID: this.selectedSubDealer,
      RETAILER_ID: this.selectedRetailer,
      DEALER_NAME: this.dealerSearch,
      SUB_DEALER_NAME: this.subDealerSearch,
      RETAILER_NAME: this.retailerSearch
    })
    );
  }

  this.router.navigate(['/new-order']);
}


// check cart items 
hasCartItems(): boolean {
  const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
  return cart.length > 0;
}



  goToViewOrder(){
    this.router.navigate(['/view-order-list']);
  }

  goToCart() {
  this.router.navigate(['/cart']);
}

  
}
