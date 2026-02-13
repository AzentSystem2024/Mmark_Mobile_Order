import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MyserviceService } from '../../myservice.service';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../layout/layout.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-article-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, FormsModule],
  templateUrl: './edit-article-inventory.component.html',
  styleUrl: './edit-article-inventory.component.scss',
})
export class EditArticleInventoryComponent {
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

  Article_barcodelistUpdate: any[] = [];
  categoryError: boolean = false;
  artnoError: boolean = false;
  colorError: boolean = false;
  record: any;
  scannedBarcode: any;
  barcodeFieldUpdate: any;
  isLoading: boolean = false;
  EntriesUpdate: any;
  Art_Id: any;
  user_id: any;
  IS_COMPLETED: boolean = false;
  LoginResponse: any;
  Is_Pending_High: boolean=false;
  variance: any;
  isMultiboxChecked: boolean = false;

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
    const id = record.DOC_NO;
    this.isStartButtonClicked = true;

    if (record.STATUS === 'COMMITTED') {
      this.isCommited = true;
    } else {
      this.isCommited = false;
    }

    this.service.select_Article_inventory(id).subscribe((res: any) => {
      console.log('API Response:', res);
      this.selected_Data = res;

      this.Art_Id = this.selected_Data.ID;
      this.user_id = this.selected_Data.USER_ID;
      this.scannedCount = this.selected_Data.Entries.length;
      const IsCompleted = this.selected_Data.STATUS_ID;

      this.isMultiboxChecked = this.selected_Data.Is_MultiBox;
      if (IsCompleted == 1) {
        this.IS_COMPLETED = true;
      } else {
        this.IS_COMPLETED = false;
      }
      if (this.selected_Data.CATEGORY_ID) {
        const payload = {
          CATEGORY_ID: this.selected_Data.CATEGORY_ID,
        };
        this.service.get_Artno_DropDown(payload).subscribe((res: any) => {
          console.log(res);
          this.ArtNo_list = res.Data;
        });
      }
      if (this.selected_Data.ART_NO) {
        const payload = {
          CATEGORY_ID: this.selected_Data.CATEGORY_ID,
          ART_NO: this.selected_Data.ART_NO,
        };
        this.service.get_Color_DropDown(payload).subscribe((res: any) => {
          console.log(res);
          this.Color_list = res.Data;
        });
      }
      if (this.selected_Data.COLOR) {
        const payload = {
          CATEGORY_ID: this.selected_Data.CATEGORY_ID,
          ART_NO: this.selected_Data.ART_NO,
          COLOR: this.selected_Data.COLOR,
        };
        this.service.get_Size_DropDown(payload).subscribe((res: any) => {
          console.log(res);
          this.Size_List = res.Data;
        });
      }
      // this.Load_Barcode_listUpdate();
      const barcode_payload = {
        ART_NO: res.ART_NO,
        COLOR: res.COLOR,
        CATEGORY_ID: res.CATEGORY_ID,
        SIZE: res.SIZE,
      };
      //  this.Article_barcodelistUpdate=this.selected_Data.Entries
      if (this.selected_Data && this.selected_Data.Entries) {
        const entries = this.selected_Data.Entries;

        this.Article_barcodelistUpdate = entries.map((item: any) => ({
          ...item,
          FLAG: item.IS_SCANNED ? 'VERIFIED' : 'UNMATCHED',
        }));

        this.totalItems = this.Article_barcodelistUpdate.length;

        this.scannedCount = entries.filter((e: any) => e.IS_SCANNED).length;
        this.variance=this.totalItems-this.scannedCount;
        console.log('Loaded All Entries →', this.Article_barcodelistUpdate);
      }

    });
   
  }

  setVerificationFlags() {
    this.Article_barcodelistUpdate = this.Article_barcodelistUpdate.map(
      (article: any) => ({
        ...article,
        FLAG: article.IS_SCANNED ? 'VERIFIED' : 'UNMATCHED',
      })
    );

    this.scannedCount = this.Article_barcodelistUpdate.filter(
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
    console.log(
      '====================bar code function called==================='
    );
    const payload = {
      ART_NO: this.selected_Data.ART_NO,
      COLOR: this.selected_Data.COLOR,
      CATEGORY_ID: this.selected_Data.CATEGORY_ID,
      SIZE: this.selected_Data.SIZE,
    };
    this.service.get_Article_bardcode(payload).subscribe((res: any) => {
      console.log(res);

      this.Article_barcodelistUpdate = res.Data;
      this.totalItems = this.Article_barcodelistUpdate.length;
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
    const matchedItem = this.Article_barcodelistUpdate.find(
      (item: any) => item.BARCODE === code
    );

    // ❌ NOT MATCHED → RESET FORM
    if (!matchedItem) {
      console.warn('Scanned barcode does NOT belong to selected article');

      // Reset everything
      this.scannedBarcode = '';
      this.EntriesUpdate = [];
      this.scannedCount = 0;

      this.Article_barcodelistUpdate.forEach((item) => {
        item.FLAG = 'UNVERIFIED'; // reset all flags
        item.SCAN_COUNT = 0; // reset scan count
      });

      return; // stop execution
    }

    // 2️⃣ Update scan count
    matchedItem.SCAN_COUNT = (matchedItem.SCAN_COUNT || 0) + 1;



    // 3️⃣ Mark this item as scanned
    matchedItem.IS_SCANNED = true;
    matchedItem.FLAG = 'VERIFIED';

    // 4️⃣ Rebuild Entries array fresh (NO duplicates, NO missing scan)
    this.EntriesUpdate = this.Article_barcodelistUpdate.map((item: any) => ({
      ARTICLE_ID: item.ARTICLE_ID,
      IS_SCANNED: item.IS_SCANNED === true,
    }));

    console.log('Entries (Updated):', this.EntriesUpdate);

    // 5️⃣ Update scanned count
    this.scannedCount = this.EntriesUpdate.filter(
      (e: any) => e.IS_SCANNED
    ).length;

      this.variance = this.totalItems - this.scannedCount;
    // 6️⃣ Clear input and refocus
    setTimeout(() => {
      this.Selected_Barcode = '';
      // this.barcodeFieldUpdate.nativeElement.focus();
    }, 150);
  }



  //=================Dropdown selection=================
onCategorySelected() {
  this.categoryError = false;
  console.log("Selected Category ID:", this.selectedCategory);
  const payload={
    CATEGORY_ID: this.selected_Data.CATEGORY_ID
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
    CATEGORY_ID: this.selected_Data.CATEGORY_ID,
    ART_NO: this.selected_Data.ART_NO
  }
  this.service.get_Color_DropDown(payload).subscribe((res: any) => {
      console.log(res);
      this.Color_list = res.Data;
    }); 
}

onColorSelected() {
  this.colorError = false;
  console.log("Selected Color:", this.selectdColor);
  const payload={ 
    CATEGORY_ID: this.selected_Data.CATEGORY_ID,
    ART_NO:this.selected_Data.ART_NO,
    COLOR: this.selected_Data.COLOR
  }     

  this.service.get_Size_DropDown(payload).subscribe((res: any) => {
      console.log(res);
 this.Size_List = res.Data.sort((a: any, b: any) => 
    a.DESCRIPTION.localeCompare(b.DESCRIPTION, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  );
    } );
}
  convertCheckbox() {
    console.log('Checkbox changed. IS_COMPLETED:', this.IS_COMPLETED);
  }

  //=====================update inventory===================
  updateInventory() {
    if (!this.selected_Data.REASON) {
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
      ID: this.Art_Id,
      USER_ID: this.user_id ?? 0, // if not available use 0
      CATEGORY_ID: this.selected_Data.CATEGORY_ID,
      ART_NO: this.selected_Data.ART_NO,
      COLOR: this.selected_Data.COLOR,
      SIZE: this.selected_Data.SIZE,      
      IS_COMMIT: 0,
      REASON: this.selected_Data.REASON,
      IS_COMPLETED: this.IS_COMPLETED,
      Entries: this.EntriesUpdate || this.selected_Data.Entries,
    };

    console.log('FINAL UPDATE PAYLOAD:', payload);

    this.service.update_Article_inventory(payload).subscribe((res: any) => {
      // alert('Article inventrory updated successfully');
      this.toastr.success('Article inventrory updated successfully');
          this.closePopup();
      this.router.navigate(['/article-inventory']);
    });

    this.router.navigate(['/article-inventory']);
  }

  //===============update with pending article==================
  Update_with_pending_Article(){
        if (!this.selected_Data.REASON) {
      this.ReasonError = true;
      // this.toastr.error("Inventory reason is required");
      return;
    }



    const payload = {
      ID: this.Art_Id,
      USER_ID: this.user_id ?? 0, // if not available use 0
      CATEGORY_ID: this.selected_Data.CATEGORY_ID,
      ART_NO: this.selected_Data.ART_NO,
      COLOR: this.selected_Data.COLOR,
      SIZE: this.selected_Data.SIZE,      
      IS_COMMIT: 0,
      REASON: this.selected_Data.REASON,
      IS_COMPLETED: this.IS_COMPLETED,
      Entries: this.EntriesUpdate || this.selected_Data.Entries,
    };

    console.log('FINAL UPDATE PAYLOAD:', payload);

    this.service.update_Article_inventory(payload).subscribe((res: any) => {
      // alert('Article inventrory updated successfully');
      this.toastr.success('Article inventrory updated successfully');
        this.closePopup();
      this.router.navigate(['/article-inventory']);
    });
    this.router.navigate(['/article-inventory']);

  }
  //=============list function=======================

  //=====================commit in Update=============================

  Commit_Update() {
  if (!this.selected_Data.REASON) {
    this.ReasonError = true;
    return;
  }

  // ------------------------------
  // 🔍 STEP 1: Calculate variance
  // ------------------------------
  const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);
  if (delta !== 0 && variance >= delta) {
    this.toastr.error(
      `Unscanned Qty is higher than Max. allowed Limit`,'',
      { timeOut: 3000 }
    );
    return;
  }
    const payload = {
      ID: this.Art_Id,
      USER_ID: this.user_id ?? 0, // if not available use 0
      CATEGORY_ID: this.selected_Data.CATEGORY_ID,
      ART_NO: this.selected_Data.ART_NO,
      COLOR: this.selected_Data.COLOR,
      SIZE: this.selected_Data.SIZE,
      IS_COMMIT: 1,
      REASON: this.selected_Data.REASON,

      // Only VERIFIED barcodes should be sent
      Entries: this.EntriesUpdate || this.selected_Data.Entries,
    };

    console.log('FINAL UPDATE PAYLOAD:', payload);

    this.service.update_Article_inventory(payload).subscribe((res: any) => {
      this.toastr.success('Article inventrory commited successfully');
      this.closePopup();
      this.router.navigate(['/article-inventory']);
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
    if (e.STATUS === 'COMMITTED') {
      this.isCommited = true;
    }
  }
  closeEditpopup() {
    this.showPopupscreen = false;
  }

  Reset_form_Edit() {
    this.selected_Data = {
      USER_ID: 0,
      CATEGORY_ID: 0,
      ART_NO: '',
      COLOR: '',
      SIZE: '',
      REASON: '',
      Entries: [],
    };
    this.isStartButtonClicked = false;
    this.scannedCount = 0;
    this.Article_barcodelistUpdate = [];
    this.totalItems = 0;
    this.Entries = [];
  }
  closePopup() {
    this.router.navigate(['/article-inventory']);
  }


  
  //============Do not save pending article==================
  Not_save_pending_article(){
    this.Is_Pending_High=false
  }
}
