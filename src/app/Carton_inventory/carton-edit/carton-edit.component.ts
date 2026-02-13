import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MyserviceService } from '../../myservice.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../layout/layout.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carton-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, FormsModule],
  templateUrl: './carton-edit.component.html',
  styleUrl: './carton-edit.component.scss'
})
export class CartonEditComponent {
  @ViewChild('barcodeField') barcodeField!: ElementRef;
  isLoggedIn = !!sessionStorage.getItem('token');
  showEditPopup: boolean = false;
  Category_list: any;
  selectedCategory: any = '';
  selectedArtno: any = '';
  ArtNo_list: any;
  Color_list: any;
  selectdColor: any = '';
  Size_List: any;
  selectedsize: any = '';
  Article_barcodelist: any[] = [];
  barcodeInput: any;
  Entries: any = [];
  totalItems: any = 0;
  scannedCount: any = 0;
  Article_inventroy_list: any = [];
  selected_Data: any = {};
  Selected_Barcode: any;
  isStartButtonClicked: boolean = false;
  ReasonError: boolean = false;
  showSheet = false;
  selectedItem: any = null;
  showPopupscreen: boolean = false;
  DeletePopupScreen: boolean = false;
  isCommited: boolean = false;
  Load_Bardcode: any = { ART_NO: '', COLOR: '', CATEGORY_ID: 0, SIZE: '' };
  isMultiboxChecked: boolean = false;
  Barcode_list: any[] = [];
  categoryError: boolean = false;
  artnoError: boolean = false;
  colorError: boolean = false;
  record: any;
  scannedBarcode: any;
  barcodeFieldUpdate: any;
  isLoading: boolean = false;
  EntriesUpdate: any;
  Carton_id: any;
  user_id: any;
  LoginResponse: any;
  Is_Pending_High: boolean=false;
  variance: any;
  IS_COMPLETED: boolean= false;
  Is_MultiBox: any;

  constructor(
    private router: Router,
    private service: MyserviceService,
    private toastr: ToastrService
  ) {
    this.get_Api_Dropdownfunction();

const savedData = JSON.parse(sessionStorage.getItem('token') || '{}');
console.log(savedData);
this.LoginResponse=savedData;
    // this.get_Article_list()
  }

  ngOnInit() {
    const record = history.state.data;
    console.log('Received Record:', record);
    const id = record.DocNo;
    this.isStartButtonClicked = true;

    if (record.Status === 'COMMITTED') {
      this.isCommited = true;
    } else {
      this.isCommited = false;
    }

    this.service.  select_Carton_inventory(id).subscribe((res: any) => {
      console.log('API Response:', res);
      this.selected_Data = res;

      this.Carton_id = this.selected_Data.Id;
      this.user_id = this.selected_Data.UserId;
      this.scannedCount = this.selected_Data.Entries.length;
      this.Is_MultiBox = this.selected_Data.Is_MultiBox ;
      const IsCompleted = this.selected_Data.StatusId;

      if( this.Is_MultiBox ==1){
        this.isMultiboxChecked = true;

      }else{
        this.isMultiboxChecked = false;
      }
      if (IsCompleted == 1) {
        this.IS_COMPLETED = true;
      } else {
        this.IS_COMPLETED = false;
      }
      if (this.selected_Data.CategoryId) {
        const payload = {
          CATEGORY_ID: this.selected_Data.CategoryId,
        };
        this.service.get_Artno_DropDown(payload).subscribe((res: any) => {
          console.log(res);
          this.ArtNo_list = res.Data;
        });
      }
      if (this.selected_Data.ArtNo) {
        const payload = {
          CATEGORY_ID: this.selected_Data.CategoryId,
          ART_NO: this.selected_Data.ArtNo,
        };
        this.service.get_Color_DropDown(payload).subscribe((res: any) => {
          console.log(res);
          this.Color_list = res.Data;
        });
      }
     
      // this.Load_Barcode_listUpdate();
      const barcode_payload = {
        ART_NO: res.ART_NO,
        COLOR: res.COLOR,
        CATEGORY_ID: res.CATEGORY_ID,
        SIZE: res.SIZE,
      };
      //  this.Barcode_list=this.selected_Data.Entries
      if (this.selected_Data && this.selected_Data.Entries) {
        const entries = this.selected_Data.Entries;

        this.Barcode_list = entries.map((item: any) => ({
          ...item,
          FLAG: item.IsScanned ? 'VERIFIED' : 'UNMATCHED',
        }));

        this.totalItems = this.Barcode_list.length;

        this.scannedCount = entries.filter((e: any) => e.IsScanned).length;
        this.variance=this.totalItems-this.scannedCount;
        console.log('Loaded All Entries →', this.Barcode_list);
      }

    });
   
  }

  setVerificationFlags() {
    this.Barcode_list = this.Barcode_list.map(
      (article: any) => ({
        ...article,
        FLAG: article.IsScanned ? 'VERIFIED' : 'UNMATCHED',
      })
    );

    this.scannedCount = this.Barcode_list.filter(
      (item: any) => item.FLAG === 'VERIFIED'
    ).length;
  }

  get_Api_Dropdownfunction() {
    this.service.get_Category_DropDown().subscribe((res: any) => {
      console.log(res);
      this.Category_list = res.Data;
    });
  }

  //=============load barcode forupdate====================
  Load_Barcode_listUpdate() {
    // reset errors
  this.categoryError = false;
  this.artnoError = false;
  this.colorError = false;

      if (!this.isMultiboxChecked) {

  // validation
  if (!this.selected_Data.CategoryId) {
    this.categoryError = true;
  }

  if (!this.selected_Data.ArtNo) {
    this.artnoError = true;
  }

  if (!this.selected_Data.Color) {
    this.colorError = true;
  }

  // if any error → stop start button
  if (this.categoryError || this.artnoError || this.colorError) {

    return;

  }
  else{
    this.isLoading = true;
  }
}

  
    console.log(this.selected_Data)
    console.log(
      '====================bar code function called===================');
    const payload = {
      ArtNo: this.selected_Data.ArtNo,
      Color: this.selected_Data.Color,
      CategoryId: this.selected_Data.CategoryId,
      IsMultibox:this.isMultiboxChecked?1:0
  
    };
    console.log(payload)
    this.service.get_getavailable_bardcode(payload).subscribe((res: any) => {
      console.log(res);

      this.Barcode_list = res.Data;
      this.totalItems = this.Barcode_list.length;
      console.log(this.totalItems);
      if (res.Data.length === 0) {
        this.toastr.warning(
          'There is no barcode available for the selected criteria','',
       { timeOut: 3000 }
        );
      } else {
        this.isStartButtonClicked = true;
      }
    });
    this.scannedCount = 0;
  }

  //========================barcode scanning===============
  processScannedBarcodeUpdate() {
    const code = this.Selected_Barcode?.trim();
    if (!code) return;

    console.log('Scanned Barcode (Update):', code);

    // 1️⃣ Find the scanned item
    const matchedItem = this.Barcode_list.find(
      (item: any) => item.Barcode === code
    );

    //  NOT MATCHED → RESET FORM
    if (!matchedItem) {
      console.warn('Scanned barcode does NOT belong to selected article');

      // Reset everything
      // this.scannedBarcode = '';
      this.Selected_Barcode=''

      return; // stop execution
    }

    // 2️⃣ Update scan count
    matchedItem.SCAN_COUNT = (matchedItem.SCAN_COUNT || 0) + 1;



    // 3️⃣ Mark this item as scanned
    matchedItem.IsScanned = true;
    matchedItem.FLAG = 'VERIFIED';

    // 4️⃣ Rebuild Entries array fresh (NO duplicates, NO missing scan)
    this.EntriesUpdate = this.Barcode_list.map((item: any) => ({
         BoxId:item.PackingId||item.BoxId,
      IsScanned: item.IsScanned === true,
    }));

    console.log('Entries (Updated):', this.EntriesUpdate);

    // 5️⃣ Update scanned count
    this.scannedCount = this.EntriesUpdate.filter(
      (e: any) => e.IsScanned
    ).length;

      this.variance = this.totalItems - this.scannedCount;
    // 6️⃣ Clear input and refocus
    setTimeout(() => {
      this.Selected_Barcode = '';
      // this.barcodeFieldUpdate.nativeElement.focus();
    }, 150);
  }



  convertCheckbox() {
    console.log('Checkbox changed. IS_COMPLETED:', this.IS_COMPLETED);
  }

  //=====================update inventory===================
  updateInventory() {
    if (!this.selected_Data.Reason) {
      this.ReasonError = true;
      // this.toastr.error("Inventory reason is required");
      return;
    }

     const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);
      if(variance>=delta && delta!=0){
      this.Is_Pending_High=true
        return;
    }


    const payload = {
      ID: this.Carton_id,
      user_id: this.user_id ?? 0, // if not available use 0
      CategoryId: this.selected_Data.CategoryId,
      ArtNo: this.selected_Data.ArtNo,
      Color: this.selected_Data.Color,
      IsCommit: 0,
      Reason: this.selected_Data.Reason,
      IsCompleted: this.IS_COMPLETED,
      IsMultibox: this.isMultiboxChecked ,
      Entries: this.EntriesUpdate || this.selected_Data.Entries,
    };

    console.log('FINAL UPDATE PAYLOAD:', payload);

    this.service.update_Carton_inventory(payload).subscribe((res: any) => {
      // alert('Article inventrory updated successfully');
      this.toastr.success('Carton inventory updated successfully');
      this.closePopup()
      this.router.navigate(['/carton-inventory']);
    });

    this.router.navigate(['/carton-inventory']);
  }

  //===============update with pending article==================
  Update_with_pending_Article(){
        if (!this.selected_Data.Reason) {
      this.ReasonError = true;
      // this.toastr.error("Inventory reason is required");
      return;
    }



    const payload = {
      ID: this.Carton_id,
      user_id: this.user_id ?? 0, // if not available use 0
      CategoryId: this.selected_Data.CategoryId,
      ArtNo: this.selected_Data.ArtNo,
      Color: this.selected_Data.Color,
      IsCommit: 0,
      Reason: this.selected_Data.Reason,
      IsCompleted: this.IS_COMPLETED,
      IsMultibox: this.isMultiboxChecked ,
      Entries: this.EntriesUpdate || this.selected_Data.Entries,
    };

    console.log('FINAL UPDATE PAYLOAD:', payload);

    this.service.update_Carton_inventory(payload).subscribe((res: any) => {
      // alert('Article inventrory updated successfully');
      this.toastr.success('Carton inventory updated successfully');
      this.closePopup()
      this.router.navigate(['/carton-inventory']);
    });
    this.router.navigate(['/carton-inventory']);
     this.closePopup()

  }
  //=============list function=======================

  //=====================commit in Update=============================

  Commit_Update() {
    if (!this.selected_Data.Reason) {
      this.ReasonError = true;
      // this.toastr.error("Inventory reason is required");
      return;
    }

     const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);
  if (delta !== 0 && variance > delta) {
    this.toastr.error(
      `Unscanned Qty is higher than Max. allowed Limit`,'',
      { timeOut: 3000 }
    );
    return;
  }


    const payload = {
      ID: this.Carton_id,
      user_id: this.user_id ?? 0, // if not available use 0
      CategoryId: this.selected_Data.CategoryId,
      ArtNo: this.selected_Data.ArtNo,
      Color: this.selected_Data.Color,
      IsCommit: 1,
      Reason: this.selected_Data.Reason,
      IsCompleted: this.IS_COMPLETED,
      IsMultibox: this.isMultiboxChecked ,
      Entries: this.EntriesUpdate || this.selected_Data.Entries,
    };

    console.log('FINAL UPDATE PAYLOAD:', payload);

    this.service.update_Carton_inventory(payload).subscribe((res: any) => {
      // alert('Article inventrory updated successfully');
      this.toastr.success('Carton inventory updated successfully');
       this.router.navigate(['/carton-inventory']);
       this.closePopup()
          this.router.navigate(['/carton-inventory'], { queryParams: { refresh: new Date().getTime() } });
    });
  }
  OnchangeReason() {
    this.ReasonError = false;
    
  }

  showEditScreen(e: any) {
    console.log('=====================');
    this.showPopupscreen = true;
    console.log(e);
    this.record = e;
    if (e.Status === 'COMMITTED') {
      this.isCommited = true;
    }
  }
  closeEditpopup() {
    this.showPopupscreen = false;
  }

Reset_form_Edit() {
  this.selected_Data = {
    CategoryId: '',
    ArtNo: '',
    Color: '',
    Size: '',
    Reason: '',
    Entries: []
  };

  this.isStartButtonClicked = false;   // allow user to change dropdowns
  this.scannedCount = 0;
  this.Barcode_list = [];
  this.totalItems = 0;
  this.Entries = [];
  this.variance = 0;
  this.isMultiboxChecked = false;

  this.ArtNo_list = [];
  this.Color_list = [];

  console.log("Form Reset Completed →", this.selected_Data);
}

  closePopup() {
    this.router.navigate(['/carton-inventory']);
  }

  onCategorySelected() {
  this.categoryError = false;
  console.log("Selected Category ID:", this.selectedCategory);
  const payload={
    CATEGORY_ID: this.selected_Data.CategoryId
  }
  this.service.get_Artno_DropDown(payload).subscribe((res: any) => {
      console.log(res);
      // this.ArtNo_list = res.Data;
       this.ArtNo_list = res.Data.sort((a: any, b: any) => {
    return a.DESCRIPTION.localeCompare(b.DESCRIPTION, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });

    });
}

onArtnoSelected() {
  this.artnoError = false;
  console.log("Selected Art No:", this.selectedArtno);
  const payload={
    CATEGORY_ID: this.selected_Data.CategoryId,
    ART_NO: this.selected_Data.ArtNo
  }
  this.service.get_Color_DropDown(payload).subscribe((res: any) => {
      console.log(res);
      this.Color_list = res.Data;
    }); 
}

  
  //============Do not save pending article==================
  Not_save_pending_article(){
    this.Is_Pending_High=false
  }

}
