import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import intlTelInput from 'intl-tel-input';

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
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('whatsappInput') whatsappInput!: ElementRef;
  @ViewChild('altMobileInput') altMobileInput!: ElementRef;

  showUnsavedPopup = false;
  pendingNavigation = false;
  dealer_list: any[] = [];
  state_list: any[] = [];
  district_list: any[] = [];
  confirmPassword: any;
  iti: any;
  showValidation = false;
  whatsappIti: any;
  altMobileiti:any;
  invalid_email: boolean = false;
  formUnlocked = false;
  dealerSearchText: string = '';
  dealerDisplayText: string = '';
  isExistingRetailer = false;

  saveData = {
    ID:0,
    RETAILER_NAME: '',
    ADDRESS: '',
    MOBILE: '',
    STATE: '',
    DISTRICT: '',
    DISTRIBUTOR_ID: 0,
    LOGIN_NAME: '',
    PASSWORD: '',
    DISTRIBUTOR: '',
    EMAIL:''
  };
  selected_District: any;
  selected_State: any;
  selected_dealers: any[] = [];
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

  showPreview = false;
  previewData: any = {};
  pendingPayload: any;

  isSaving = false;

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

  ngAfterViewInit() {

  this.iti = intlTelInput(this.phoneInput.nativeElement, {
    initialCountry: "in",
    separateDialCode: true,
    loadUtils: () => import("intl-tel-input/utils")
  });

  // WhatsApp
  this.whatsappIti = intlTelInput(this.whatsappInput.nativeElement, {
    initialCountry: "in",
    separateDialCode: true
  });

  this.altMobileiti = intlTelInput(this.altMobileInput.nativeElement, {
    separateDialCode: true
  });

  this.whatsappInput.nativeElement.disabled = true;
  this.altMobileInput.nativeElement.disabled = true;

}

onMobileBlur() {

  const number = this.iti.getNumber();

  if (!number) {
    this.mobile_error = true;
    this.invalid_number = false;
    return;
  }

  this.mobile_error = false;

  this.invalid_number = !this.iti.isValidNumber();


}

 onMobileInput(event: any) {

  let value = event.target.value;

  // remove non numeric
  value = value.replace(/\D/g, '');

  // prevent starting with 0
  if (value.startsWith('0')) {
    value = value.substring(1);
  }

  // update input value
  event.target.value = value;

  // full number with country code
  const fullNumber = this.iti.getNumber();

  // national number only (user typed)
  const nationalNumber = value;

  this.saveData.MOBILE = fullNumber;
  this.saveData.LOGIN_NAME = nationalNumber;
  this.saveData.PASSWORD = nationalNumber;

  this.updateValidation();
}


updateValidation() {

  if (!this.showValidation) {
    return;
  }

  if (!this.iti.isValidNumber()) {
    this.invalid_number = true;

  } else {
    this.invalid_number = false;
  }

}

  validateEmail() {

  const email = this.saveData.EMAIL;

  // If empty → valid (optional field)
  if (!email) {
    this.invalid_email = false;
    return;
  }

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  this.invalid_email = !emailRegex.test(email);

}

fetchRetailerData() {

  // if (!this.saveData.MOBILE) {
  //   this.mobile_error = true;
  //   return;
  // }

  // if (this.invalid_number) {
  //   return;
  // }

  // this.formUnlocked = true;
  // // enable alternate and whatsapp fields
  // this.whatsappInput.nativeElement.disabled = false;
  // this.altMobileInput.nativeElement.disabled = false;

  this.isExistingRetailer = false;
  this.saveData.ID = 0;
  this.saveData.RETAILER_NAME ='';
  this.saveData.ADDRESS ='';
  this.selected_State = '';
  this.selected_District = '';
  this.saveData.DISTRIBUTOR_ID = 0;
  this.dealerDisplayText = '',
  this.saveData.LOGIN_NAME =  '';
  this.saveData.PASSWORD = '';
  this.saveData.DISTRIBUTOR ='';
  this.saveData.EMAIL = '';
  this.whatsappIti?.setNumber('');
  this.altMobileiti?.setNumber('');
  

  const country = this.iti.getSelectedCountryData();
  const mobileNumber = this.phoneInput.nativeElement.value.replace(/\D/g, '');

  if (!mobileNumber) {
    this.toastr.warning('Enter mobile number');
    return;
  }

  const payload = {
    MOBILE: `${country.dialCode}-${mobileNumber}`
  };

  this.service.fetch_retailer_data(payload).subscribe((res: any) => {

    if (res.Flag !== "1" || !res.Data?.length) {
      this.toastr.info('Retailer not found');
      this.formUnlocked = true;
       this.whatsappInput.nativeElement.disabled = false;
       this.altMobileInput.nativeElement.disabled = false;
      return;
    }

    const data = res.Data[0];

    if (data) {
      this.isExistingRetailer = true;
    }

    // Populate form
    this.saveData.ID = data.ID || 0;
    this.saveData.RETAILER_NAME = data.RETAILER_NAME;
    this.saveData.ADDRESS = data.ADDRESS;
    this.saveData.EMAIL = data.EMAIL;

    this.selected_State = data.STATE;
    this.selected_District = data.DISTRICT;

    this.saveData.LOGIN_NAME = data.LOGIN_NAME;
    this.saveData.PASSWORD = data.PASSWORD;


    // WhatsApp
    if (data.WHATSAPP) {

      const parts = data.WHATSAPP.split('-');
      this.whatsappIti.setNumber(`+${parts[0]}${parts[1]}`);

    }

    // Alternate Mobile
    if (data.ALT_MOBILE) {

      const parts = data.ALT_MOBILE.split('-');
      this.altMobileiti.setNumber(`+${parts[0]}${parts[1]}`);

    }

    // dealers (571,922)
    if (data.DEALERS) {

      const dealerIds = data.DEALERS.split(',').map((x:any) => +x);

      this.selected_dealers = this.dealer_list.filter(d =>
        dealerIds.includes(d.ID)
      );

      this.dealerDisplayText = this.selected_dealers
        .map(d => d.DESCRIPTION)
        .join(', ');
    }

    // unlock form
    this.formUnlocked = true;
    // // enable alternate and whatsapp fields
    this.whatsappInput.nativeElement.disabled = false;
    this.altMobileInput.nativeElement.disabled = false;

    this.toastr.success('Retailer data loaded');

  }, () => {

    this.toastr.error('Error fetching retailer');

  });

}


  toggleDealer(dealer: any) {

  const index = this.selected_dealers.findIndex(d => d.ID === dealer.ID);

  if (index > -1) {
    this.selected_dealers.splice(index, 1);
  } else {
    this.selected_dealers.push(dealer);
  }

  // update input display text
  this.dealerDisplayText = this.selected_dealers
    .map(d => d.DESCRIPTION)
    .join(', ');

  // clear search
  this.dealerSearchText = '';

}

isDealerSelected(dealer: any): boolean {
  this.dealererror =false;
  return this.selected_dealers.some(d => d.ID === dealer.ID);
}


allowOnlyLetters(event: KeyboardEvent) {

  const charCode = event.key;

  const regex = /^[a-zA-Z\s]*$/;

  if (!regex.test(charCode)) {
    event.preventDefault();
  }

}


sanitizeRetailerName() {

  this.saveData.RETAILER_NAME =
    this.saveData.RETAILER_NAME.replace(/[^a-zA-Z\s]/g, '');

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
  // onDealerChange(event: any) {
  //   const dealer = this.dealer_list.find(
  //     (d: any) => d.ID == this.selected_dealer,
  //   );

  //   if (dealer) {
  //     const dealerName = dealer.DESCRIPTION;

  //     console.log(dealerName); // 👉 A M COMPANY

  //     // store in saveData
  //     this.saveData.DISTRIBUTOR_ID = dealer.ID;
  //     this.saveData.DISTRIBUTOR = dealer.DESCRIPTION;
  //   }
  // }

  filterDealers() {

  this.showDealerList = true;

  const search = this.dealerSearchText.toLowerCase();

  this.filteredDealers = this.dealer_list.filter((d: any) =>
    d.DESCRIPTION.toLowerCase().includes(search)
  );

}

  getSelectedDealersText(): string {
  return this.selected_dealers
    ?.map((d: any) => d.DESCRIPTION)
    .join(', ');
}

  openDealerDropdown() {
    this.showDealerList = true;

    // Optional: show all dealers when first opened
    this.filteredDealers = [...this.dealer_list];
  }

  // selectDealer(dealer: any) {
  //   this.selected_dealer = dealer.DESCRIPTION;
  //   this.saveData.DISTRIBUTOR_ID = dealer.ID;
  //   this.saveData.DISTRIBUTOR = dealer.DESCRIPTION;
  //   this.showDealerList = false; // close dropdown
  // }
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
    // if (this.selected_dealer) {
    //   this.dealererror = true;
    // }
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
    this.state_error = false ; 
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
    this.district_Error = false;
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

    if (!this.selected_dealers || this.selected_dealers.length === 0) {
      this.dealererror = true;
      isValid = false;
    }

    if (!this.saveData.LOGIN_NAME) {
      this.saveData.LOGIN_NAME = this.phoneInput.nativeElement.value.replace(/\D/g, '');
    }

    if (!this.saveData.PASSWORD) {
      this.saveData.PASSWORD = this.phoneInput.nativeElement.value.replace(/\D/g, '');
    }

    // STOP if invalid
    if (!isValid) {
      this.toastr.error('Please fill all required fields');
      return;
    }
      
    //   if (!this.confirmPassword && this.saveData.ID == 0) {
    //   this.toastr.error('Confirm  password required fields');
    //   return;
    // }

    const mobileData = this.iti.getSelectedCountryData();
    const mobileNumber = this.phoneInput.nativeElement.value.replace(/\D/g, '');

    const whatsappData = this.whatsappIti?.getSelectedCountryData();
    const whatsappNumber = this.whatsappInput?.nativeElement.value.replace(/\D/g, '');

    const altData = this.altMobileiti?.getSelectedCountryData();
    const altNumber = this.altMobileInput?.nativeElement.value.replace(/\D/g, '');

    const payload = {
    
      ID : this.saveData.ID,

      RETAILER_NAME: this.saveData.RETAILER_NAME.trim(),
      ADDRESS: this.saveData.ADDRESS.trim(),

      MOBILE: `${mobileData.dialCode}-${mobileNumber}`,

      WHATSAPP: whatsappNumber
        ? `${whatsappData.dialCode}-${whatsappNumber}`
        : '',

      ALT_MOBILE: altNumber
        ? `${altData.dialCode}-${altNumber}`
        : '',

      EMAIL: this.saveData.EMAIL.trim(),

      STATE: this.selected_State.trim(),
      DISTRICT: this.selected_District.trim(),

      DEALERS: this.selected_dealers.map(d => d.ID).join(','),

      LOGIN_NAME: this.saveData.LOGIN_NAME.trim(),
      PASSWORD: this.saveData.PASSWORD.trim()
    };

    // If UPDATE → save directly
    if (this.saveData.ID > 0) {
      this.insertRetailer(payload);
      return;
    }

    // If NEW → show preview
    this.previewData = {
      RETAILER_NAME: payload.RETAILER_NAME,
      ADDRESS: payload.ADDRESS,
      STATE: payload.STATE,
      DISTRICT: payload.DISTRICT,
      MOBILE: payload.MOBILE,
      WHATSAPP:payload.WHATSAPP,
      ALT_MOBILE:payload.ALT_MOBILE,
      DEALERS_TEXT: this.selected_dealers
      .map(d => d.DESCRIPTION)
      .sort((a, b) => a.localeCompare(b))
      .join(', ')
    };

    this.pendingPayload = payload;

    this.showPreview = true;
  }

  confirmSave(){

  if(this.isSaving) return;

  this.isSaving = true;

  this.showPreview = false;

  this.insertRetailer(this.pendingPayload);

  }

  insertRetailer(payload:any){

  const message =
  payload.ID > 0
    ? 'Retailer updated Successfully'
    : 'Retailer inserted Successfully';

  this.service.insert_retailer(payload).subscribe((res:any)=>{

    if(res.Flag === 1){

      this.isSaving = false;
      sessionStorage.setItem('REFRESH_RETAILER_CACHE','true');

      this.toastr.success(message);
      this.router.navigate(['/home']);

    }else{
      this.isSaving = false;

      this.toastr.error(res.Message);

    }

    },()=>{
      
    this.isSaving = false;
  });


}

}
