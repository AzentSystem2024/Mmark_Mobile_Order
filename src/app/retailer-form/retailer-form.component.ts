import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-retailer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retailer-form.component.html',
  styleUrl: './retailer-form.component.scss',
})
export class RetailerFormComponent {
  @ViewChild('dealerInput') dealerInput!: ElementRef;
  @ViewChild('stateinput') stateinput!: ElementRef;
  @ViewChild('Districtinput') Districtinput!: ElementRef;

  showUnsavedPopup = false;
  pendingNavigation = false;
  dealer_list: any[] = [];
  state_list: any[] = [];
  district_list: any[] = [];
  confirmPassword: any;

  saveData = {
    RETAILER_NAME: '',
    ADDRESS: '',
    MOBILE: '',
    STATE: '',
    DISTRICT: '',
    DISTRIBUTOR_ID: 0,
    LOGIN_NAME: '',
    PASSWORD: '',
    DISTRIBUTOR: '',
  };
  selected_District: any;
  selected_State: any;
  selected_dealer: any;
  dealer: any;
  dealers: any;
  filteredDealers: any[] = [];
  showDealerList: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  Retailer_name: boolean = false;
  addresserror: boolean = false;
  dealererror: boolean = false;
  state_error: boolean = false;
  district_Error: boolean = false;
  loginname: boolean = false;
  password_error: boolean = false;
  mobile_error: boolean = false;
  showStateDrp: boolean = false;
  filteredStatelist: any[] = [];
  showDistrictDrp: boolean = false;
  filteredDistrictlist: any[] = [];
  selected_State_id: any;
  invalid_number: any;
  constructor(
    private router: Router,
    private service: MyserviceService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) {
    this.loadState();
    this.loadDealer();
    // this.loadDistrict();
  }
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {

  const clickedInside =
    this.elementRef.nativeElement
      .querySelector('.dropdown-wrapper')
      ?.contains(event.target);

  if (!clickedInside) {
    this.showDealerList = false;
    this.showStateDrp=false
    this.showDistrictDrp=false
  }

}


  goBack() {
    this.showUnsavedPopup = true;
    this.pendingNavigation = true;
    this.router.navigate(['/home']);
  }
  loadDealer() {
    const payload = {
      NAME: 'DEALER',
    };
    this.service.get_DropDown_Data(payload).subscribe((res: any) => {
      this.dealer_list = res || [];
      this.filteredDealers = [...this.dealer_list];

      // setTimeout(() => {
      //   this.dealerInput?.nativeElement.focus();
      //   this.showDealerList = true;
      // });

      // }
    });

    // this.service.get_DropDown_Data(payload).subscribe((res: any) => {
    //   this.dealer_list = res;
    // });
  }
  loadState() {
    const payload = {
      NAME: 'STATE',
    };

    this.service.get_DropDown_Data(payload).subscribe((res: any) => {
      this.state_list = res || [];
      this.filteredStatelist = [...this.state_list];
    });

    // this.service.get_DropDown_Data(payload).subscribe((res: any) => {
    //   this.state_list = res;
    // });
  }
  loadDistrict() {
    const payload = {
      STATE_ID: this.selected_State,
    };
    this.service.get_DropDown_Data(payload).subscribe((res: any) => {
      this.district_list = res || [];
      this.filteredDistrictlist = [...this.district_list];
    });
    // this.service.get_DropDown_Data(payload).subscribe((res: any) => {
    //   this.district_list = res;
    // });
  }
  onDealerChange(event: any) {
    const dealer = this.dealer_list.find(
      (d: any) => d.ID == this.selected_dealer,
    );

    if (dealer) {
      const dealerName = dealer.DESCRIPTION;

      console.log(dealerName); // 👉 A M COMPANY

      // store in saveData
      this.saveData.DISTRIBUTOR_ID = dealer.ID;
      this.saveData.DISTRIBUTOR = dealer.DESCRIPTION;
    }
  }

  filterDealers() {
    this.showDealerList = true;

    this.filteredDealers = this.dealer_list.filter((d: any) =>
      d.DESCRIPTION.toLowerCase().includes(this.selected_dealer.toLowerCase()),
    );
  }
  openDealerDropdown() {
    this.showDealerList = true;

    // Optional: show all dealers when first opened
    this.filteredDealers = [...this.dealer_list];
  }

  selectDealer(dealer: any) {
    this.selected_dealer = dealer.DESCRIPTION;
    this.saveData.DISTRIBUTOR_ID = dealer.ID;
    this.saveData.DISTRIBUTOR = dealer.DESCRIPTION;
    this.showDealerList = false; // close dropdown
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow only 0–9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onMobileChange(value: any) {
    // Only update if username is empty OR same as old mobile

    this.saveData.LOGIN_NAME = value;

    this.saveData.PASSWORD = value;
    this.mobile_error = false;
    const mobile = this.saveData.MOBILE;

    this.invalid_number = !/^[6-9]\d{9}$/.test(mobile);
  }

  requiredValidation() {
    if (this.saveData.RETAILER_NAME) {
      this.Retailer_name = true;
    }
    if (this.saveData.ADDRESS) {
      this.addresserror = true;
    }
    if (this.saveData.MOBILE) {
      this.mobile_error = true;
    }
    if (this.saveData.STATE) {
      this.state_error = true;
    }
    if (this.saveData.DISTRICT) {
      this.district_Error = true;
    }
    if (this.selected_dealer) {
      this.dealererror = true;
    }
    if (this.saveData.LOGIN_NAME) {
      this.loginname = true;
    }
    if (this.saveData.PASSWORD) {
      this.password_error = true;
    }
  }
  filterState() {
    this.showStateDrp = true;
    this.filteredStatelist = this.state_list.filter((d: any) =>
      d.DESCRIPTION.toLowerCase().includes(this.selected_State.toLowerCase()),
    );
  }
  selectState(state: any) {
    this.saveData.STATE = state.DESCRIPTION;
    this.selected_State = state.DESCRIPTION;
    this.selected_State_id = state.ID;
    this.showStateDrp = false;
    const payload = {
      STATE_ID: this.selected_State_id,
    };

    this.service.District_drop(payload).subscribe((res: any) => {
      this.district_list = res || [];
      this.filteredDistrictlist = [...this.district_list];
    });
  }
  filterDistrict() {
    this.showDistrictDrp = true;
    this.filteredDistrictlist = this.district_list.filter((d: any) =>
      d.DISTRICT.toLowerCase().includes(this.selected_District.toLowerCase()),
    );
  }
  selectDistrict(district: any) {
    this.saveData.DISTRICT = district.DISTRICT;
    this.selected_District = district.DISTRICT;
    this.showDistrictDrp = false;
  }

  // saveRetailer() {

  //   console.log(this.saveData, 'payload');
  //   console.log(this.confirmPassword);
  //   const payload = {
  //     ...this.saveData,
  //     DISTRICT: this.selected_State,
  //     STATE: this.selected_State,
  //   };
  //   console.log(payload);

  //   this.service.insert_retailer(payload).subscribe((res: any) => {
  //     if (res.flag == 1) {
  //       this.toastr.warning('Retailer inserted Successfully');
  //     } else {
  //       this.toastr.error(res.Message);
  //       return;
  //     }
  //   });
  // }

  openStateDrp(){
    this.showStateDrp=true
      this.filteredStatelist = [...this.state_list];


  }
  openDistrictDrp(){
   this.showDistrictDrp=true
    this.filteredDistrictlist = [...this.district_list];
  }
  saveRetailer() {
    // Reset all error flags first
    this.Retailer_name = false;
    this.addresserror = false;
    this.mobile_error = false;
    this.state_error = false;
    this.district_Error = false;
    this.dealererror = false;
    this.loginname = false;
    this.password_error = false;

    let isValid = true;

    if (!this.saveData.RETAILER_NAME?.trim()) {
      this.Retailer_name = true;
      isValid = false;
    }

    if (!this.saveData.ADDRESS?.trim()) {
      this.addresserror = true;
      isValid = false;
    }

    if (!this.saveData.MOBILE?.trim()) {
      this.mobile_error = true;
      isValid = false;
    }

    if (!this.selected_State) {
      this.state_error = true;
      isValid = false;
    }

    if (!this.selected_District) {
      this.district_Error = true;
      isValid = false;
    }

    if (!this.selected_dealer) {
      this.dealererror = true;
      isValid = false;
    }

    if (!this.saveData.LOGIN_NAME?.trim()) {
      this.loginname = true;
      isValid = false;
    }

    if (!this.saveData.PASSWORD?.trim()) {
      this.password_error = true;
      isValid = false;
    }

    // STOP if invalid
    if (!isValid) {
      this.toastr.error('Please fill all required fields');
      return;
    }
      if (!this.confirmPassword) {
      this.toastr.error('Confirm  password required fields');
      return;
    }

    const payload = {
      ...this.saveData,
    };

    this.service.insert_retailer(payload).subscribe((res: any) => {
      if (res.Flag === 1) {
        this.toastr.success('Retailer inserted Successfully');
        this.router.navigate(['/home']);
      } else {
        this.toastr.error(res.Message);
      }
    });
  }
}
