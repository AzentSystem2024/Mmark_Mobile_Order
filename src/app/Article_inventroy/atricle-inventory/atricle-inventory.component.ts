import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';
import { FormsModule } from '@angular/forms';
import { MyserviceService } from '../../myservice.service';
import { ToastrService } from 'ngx-toastr';
// import { DxSelectBoxModule } from 'devextreme-angular';


@Component({
  selector: 'app-atricle-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, FormsModule, 

   
  ],
  templateUrl: './atricle-inventory.component.html',
  styleUrl: './atricle-inventory.component.scss',
})
export class AtricleInventoryComponent {
   @ViewChild('barcodeField') barcodeField!: ElementRef;
  showPopup: boolean = false;
  isLoggedIn = !!sessionStorage.getItem('token');
  showEditPopup: boolean = false;
  Category_list: any = [];
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
  totalItems: any=0;
  scannedCount: any=0;
  Article_inventroy_list: any=[];
  selected_Data: any={};
  Selected_Barcode: any;
  isStartButtonClicked:boolean=false

showSheet = false;
selectedItem: any = null;
showPopupscreen:boolean=false
DeletePopupScreen:boolean=false
isCommited:boolean=false
  Load_Bardcode: any = { ART_NO: '', COLOR: '', CATEGORY_ID: 0, SIZE: '' };
  saveData = {
    USER_ID: 0,
    CATEGORY_ID: 0,
    ART_NO: '',
    COLOR: '',
    SIZE: '',
    REASON: '',
    Entries: [],
  };

  formData: any = {
  categoryId: '',
  color: '',
  artNo: '',
  size: '',
  barcode: '',
  items: 0,
  scanned: 0,
  inventoryReason: ''
};
  Article_barcodelistUpdate: any;
  categoryError: boolean=false;
  artnoError: boolean=false;


  colorError: boolean=false;
  record: any;
  scannedBarcode: any;
  barcodeFieldUpdate: any;
  LoginResponse:any;
  CanAdd:boolean=false;
  CanModify:boolean=false;
  CanDelete:boolean=false;
  CanView:boolean=false;
  CanPrint:boolean=false;
  CanReprint:boolean=false;
  CanCommit:boolean=false;
  isAdmin: any;
  constructor(private router: Router, private service: MyserviceService,private toastr: ToastrService) {
    this.get_Api_Dropdownfunction();
    this.get_Article_list()
    
      const savedData = JSON.parse(sessionStorage.getItem('token') || '{}');
console.log(savedData);
this.LoginResponse=savedData;

this.isAdmin = this.LoginResponse.IS_ADMIN 
if(this.isAdmin){
  this.CanAdd=true;
  this.CanModify=true;
  this.CanDelete=true;
  this.CanView=true;
  this.CanPrint=true;
  this.CanReprint=true;
  this.CanCommit=true;  
}
else{

const Permissions=this.LoginResponse.ModuleRights[0]
console.log(Permissions);
this.CanAdd=Permissions.IS_ADD
this.CanModify=Permissions.IS_MODIFY
this.CanDelete=Permissions.IS_DELETE
this.CanView=Permissions.IS_VIEW
this.CanPrint=Permissions.IS_PRINT
this.CanReprint=Permissions.IS_REPRINT
this.CanCommit=Permissions.IS_COMMIT
}   
  }

ngOnInit(){
  this.get_Article_list()
}

  get_Api_Dropdownfunction() {
    this.service.get_Category_DropDown().subscribe((res: any) => {
      console.log(res);
      this.Category_list = res.Data;
    });


   
  }

//=====================list function==================

get_Article_list(){
   this.service.get_Article_inventory_list().subscribe((res: any) => {
      console.log(res);
      this.Article_inventroy_list = res.data.slice().reverse();

      console.log(res.INVENTORY_TIME)
    });
}


  // Single function for all rows
  editRow(record: any) {
    
    this.router.navigate(['/edit-article-inventory'],
    
    {
    state: { data: record }
  });}


//===================Delete Row=================

deleteRow(record:any){

  this.DeletePopupScreen=true

}

setVerificationFlags() {
  const scannedList = this.selected_Data?.Entries || [];

  this.Article_barcodelistUpdate = this.Article_barcodelistUpdate.map((article:any) => {
   const isMatched = scannedList.some((s: any) => s.BARCODE === article.BARCODE);

    return {
      ...article,
      FLAG: isMatched ? 'VERIFIED' : 'UNMATCHED'
    };
  });
}

  homePage() {
    console.log('========function call============');

    this.router.navigate(['/layout']);
  }

  openPopup() {
    this.router.navigate(['/add-article-inventory']);
    // this.showPopup = true;
    // this.isStartButtonClicked=false
    // this.Reset_form()

    
  }
  closePopup() {
    this.showPopup = false;
    this.showEditPopup = false;
    this.showPopupscreen=false
    // this.Reset_form()
  }
  onDescriptionChange(e: any) {
    console.log(e, '========Art No');
  }

  ngAfterViewInit() {
    this.focusBarcodeField();
  }

  focusBarcodeField() {
    setTimeout(() => {
      this.barcodeField.nativeElement.focus();
    }, 300);
  }

//==================prevent manual entry on barcode screen=============
blockManualTyping(event: KeyboardEvent) {
  // Allow only ENTER key (scanner sends ENTER)
  if (event.key !== "Enter") {
    event.preventDefault();
  }
}


//====================inuput parameters on Change value===============


  onCategoryChangeUpdate(){
    console.log('Selected Category:', this.selected_Data.CATEGORY_ID);
    const Categoryid=this.selected_Data.CATEGORY_ID
    const payload = {
      CATEGORY_ID: Categoryid,
    };



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
        console.log(this.totalItems)
    });

     

   

  }

  //========================barcode scanning===============
  
  checkBarcodeUpdate() {
    let matched = false;

    this.Article_barcodelistUpdate.forEach((item:any) => {
      if (item.BARCODE === this.Selected_Barcode.trim()) {
        item.FLAG = 'VERIFIED'; // Set matched
        matched = true;
      }
    });

    // If NO match → mark all as unmatched? OR only mark typed value?
    if (!matched) {
      this.Article_barcodelistUpdate.forEach((item:any) => {
        item.FLAG = '';
      });
    }

    this.scannedCount = this.Article_barcodelistUpdate.filter(
      (item:any) => item.BARCODE === this.Selected_Barcode
    ).length;

    console.log(this.scannedCount,this.Selected_Barcode)
  

    // Clear input
  }

  onBarcodechangeUpdate() {
    console.log(this.Selected_Barcode);
  }

  processScannedBarcodeUpdate() {
  if (!this.isStartButtonClicked || !this.Selected_Barcode?.trim()) return;

  const code = this.Selected_Barcode.trim();
  console.log("Scanned Barcode (Update):", code);

  // match barcode
  const matchedItem = this.Article_barcodelistUpdate.find(
    (item:any) => item.BARCODE === code
  );

  if (!matchedItem) {
    console.warn("Barcode NOT found in update list");
    return;
  }

  // increase count
  if (!matchedItem.SCAN_COUNT) matchedItem.SCAN_COUNT = 0;
  matchedItem.SCAN_COUNT++;

  // mark scanned
  matchedItem.FLAG = "VERIFIED";

  // push into Entries array
  this.Entries.push({
    ARTICLE_ID: matchedItem.ARTICLE_ID,
    IS_SCANNED: true
  });
  console.log("Entries (Update):", this.Entries);

  // clear + refocus
  setTimeout(() => {
    this.Selected_Barcode = "";
    // this.barcodeFieldUpdate.nativeElement.focus();
  }, 200);
}

  //=====================update inventory===================
  updateInventory() {

  const payload = {
    ID: this.selected_Data.ID,
    USER_ID: this.selected_Data.USER_ID ?? 0,   // if not available use 0
    CATEGORY_ID: this.selected_Data.CATEGORY_ID,
    ART_NO: this.selected_Data.ART_NO,
    COLOR: this.selected_Data.COLOR,
    SIZE: this.selected_Data.SIZE,
    IS_COMMIT: 0,
    REASON: this.selected_Data.REASON,

    Entries:  [...this.selected_Data.Entries, ...this.Entries]
  };

  console.log("FINAL UPDATE PAYLOAD:", payload);

  this.service.update_Article_inventory(payload).subscribe((res: any) => {
    alert("Inventory Commited successfully");
    this.closePopup();
      this.get_Article_list()
  });
}

//=====================commit in Update=============================

Commit_Update(){


  const payload = {
    ID: this.selected_Data.ID,
    USER_ID: this.selected_Data.USER_ID ?? 0,   // if not available use 0
    CATEGORY_ID: this.selected_Data.CATEGORY_ID,
    ART_NO: this.selected_Data.ART_NO,
    COLOR: this.selected_Data.COLOR,
    SIZE: this.selected_Data.SIZE,
    IS_COMMIT: 1,
    REASON: this.selected_Data.REASON,

    // Only VERIFIED barcodes should be sent
    Entries: this.Article_barcodelistUpdate
      .filter((item:any) => item.FLAG === 'VERIFIED')
      .map((item:any) => ({
        ARTICLE_ID: item.ARTICLE_ID,
        IS_SCANNED: true,
       
      }))
  };

  console.log("FINAL UPDATE PAYLOAD:", payload);

  this.service.update_Article_inventory(payload).subscribe((res: any) => {
    alert("Inventory updated successfully");
    this.closePopup();
      this.get_Article_list()
  });
}

//TESTINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
showEditScreen(e:any){
  console.log("=====================")
  this.showPopupscreen=true
  console.log(e)
   this.record = e;    
   if(e.STATUS==="COMMITTED"){
   this.isCommited=true
   }
   else{
    this.isCommited=false
   }
}
closeEditpopup(){
   this.showPopupscreen=false
}

Reset_form_Edit(){

   this.selected_Data = {
    USER_ID: 0,
    CATEGORY_ID: 0,
    ART_NO: '',
    COLOR: '',
    SIZE: '',
    REASON: '',
    Entries: [],
  };
this.isStartButtonClicked=false

}

Reset_form(){
  this.isStartButtonClicked=false
   this.saveData = {
    USER_ID: 0,
    CATEGORY_ID: 0,
    ART_NO: '',
    COLOR: '',
    SIZE: '',
    REASON: '',
    Entries: [],
  };

  this.selectdColor=''
  this.selectedArtno=''
  this.selectedCategory=''
  this.selectedsize=''
  this.Selected_Barcode=''

}

//==============================delete button function call==============
confirmDelete(record:any){
  this.service.delete_Article_inventroy(record.DOC_NO).subscribe((res:any)=>{
    console.log(res)
    this.get_Article_list()
       this.toastr.success("Article  inventory deleted successfully");

    this.DeletePopupScreen=false
    this.showPopupscreen=false
  
  })
}

closeDeletePopup(){
this.DeletePopupScreen=false
}
}
