import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MyserviceService } from '../../myservice.service';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../layout/layout.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import notify from 'devextreme/ui/notify';
// import { NotifierModule, NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-add-article-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, FormsModule],
  templateUrl: './add-article-inventory.component.html',
  styleUrl: './add-article-inventory.component.scss'
})
export class AddArticleInventoryComponent {
  // private readonly notifier: NotifierService;
   @ViewChild('barcodeField') barcodeField!: ElementRef;
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
Is_Pending_High:boolean=false
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
    IS_COMPLETED: false,
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
  isLoading: boolean=false;
  LoginResponse:any;
  CanAdd:boolean=false;
  CanModify:boolean=false;
  CanDelete:boolean=false;
  CanView:boolean=false;
  CanPrint:boolean=false;
  CanReprint:boolean=false;
  CanCommit:boolean=false;
  ReasonError:boolean=false;
  EntriesInsert: any=[];
  variance: any=0;
  isAdmin: boolean=false;
  constructor(private router: Router, private service: MyserviceService,private toastr: ToastrService) {
    this.get_Api_Dropdownfunction();
    //  this.notifier = notifierService;
    // this.get_Article_list()
   const savedData = JSON.parse(sessionStorage.getItem('token') || '{}');
this.LoginResponse = savedData;

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
const Permissions = this.LoginResponse.ModuleRights?.[0] ??{};  // FIX
console.log("Permissions:", Permissions);

// Apply permissions safely
this.CanAdd    = this.isAdmin || Permissions.IS_ADD    || false;
this.CanModify = this.isAdmin || Permissions.IS_MODIFY || false;
this.CanDelete = this.isAdmin || Permissions.IS_DELETE || false;
this.CanView   = this.isAdmin || Permissions.IS_VIEW   || false;
this.CanPrint  = this.isAdmin || Permissions.IS_PRINT  || false;
this.CanReprint= this.isAdmin || Permissions.IS_REPRINT|| false;
this.CanCommit = this.isAdmin || Permissions.IS_COMMIT || false;
  }
}

  get_Api_Dropdownfunction() {
    this.service.get_Category_DropDown().subscribe((res: any) => {
      console.log(res);
      this.Category_list = res.Data;
    });
   
  }





  //=================Dropdown selection=================
onCategorySelected() {
  this.categoryError = false;
  console.log("Selected Category ID:", this.selectedCategory);
  const payload={
    CATEGORY_ID: this.selectedCategory
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
    CATEGORY_ID: this.selectedCategory,
    ART_NO: this.selectedArtno
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
    CATEGORY_ID: this.selectedCategory,
    ART_NO: this.selectedArtno,
    COLOR: this.selectdColor
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
  
  ngAfterViewInit() {
    this.focusBarcodeField();
  }

   focusBarcodeField() {
    setTimeout(() => {
      this.barcodeField.nativeElement.focus();
    }, 300);
  }


// ==================load barcode list==================

    Add_Load_Barcode_list() {
      

  this.focusBarcodeField(); 
// reset errors
  this.categoryError = false;
  this.artnoError = false;
  this.colorError = false;

  // validation
  if (!this.selectedCategory) {
    this.categoryError = true;
  }

  if (!this.selectedArtno) {
    this.artnoError = true;
  }

  if (!this.selectdColor) {
    this.colorError = true;
  }

  // if any error → stop start button
  if (this.categoryError || this.artnoError || this.colorError) {

    return;

  }
  else{
    this.isLoading = true;
  }

  
    console.log(
      '====================bar code function called==================='
    );
    const payload = {
      ...this.Load_Bardcode,
      ART_NO: this.selectedArtno,
      COLOR: this.selectdColor,
      CATEGORY_ID: this.selectedCategory,
      SIZE: this.selectedsize,
    };
    this.service.get_Article_bardcode(payload).subscribe((res: any) => {

      console.log(res);
      this.isLoading = false;
      this.Article_barcodelist = res.Data;
      
         this.totalItems = this.Article_barcodelist.length;
         if(res.Data.length===0){

             this.toastr.warning("There is no barcode available for the selected criteria",'',
       { timeOut: 3000 });


         }
         else{
            this.isStartButtonClicked=true
         }
        console.log(this.totalItems)
    });

     

   

  }

//===============barcode scaning==================

processScannedBarcode() {
  if (!this.isStartButtonClicked || !this.scannedBarcode?.trim()) return;

  const code = this.scannedBarcode.trim();
  console.log("Scanned Barcode:", code);

  // STEP 1: find matching item
  const matchedItem = this.Article_barcodelist.find(
    item => item.BARCODE === code
  );

  // ❌ NOT MATCHED → RESET FORM
  if (!matchedItem) {
    console.warn("Scanned barcode does NOT belong to selected article");

    // Reset everything
    this.scannedBarcode = "";
    this.EntriesInsert = [];
    this.scannedCount = 0;

    this.Article_barcodelist.forEach(item => {
      item.FLAG = "UNVERIFIED";   // reset all flags
      item.SCAN_COUNT = 0;        // reset scan count
    });

    return; // stop execution
  }

  // STEP 2: Multiple scans → increase count
  if (!matchedItem.SCAN_COUNT) matchedItem.SCAN_COUNT = 0;
  matchedItem.SCAN_COUNT++;

  // STEP 3: Mark as VERIFIED
  matchedItem.FLAG = "VERIFIED";

  // STEP 4: Update total scanned count
  this.scannedCount = this.Article_barcodelist.filter(
    item => item.FLAG === "VERIFIED"
  ).length;

  // ***********************
  // STEP 4.1: Calculate VARIANCE
  // ***********************
  this.variance =
  this.totalItems- this.scannedCount;

  console.log("Variance Updated:", this.variance);


  // Make sure all other items remain UNVERIFIED
  this.Article_barcodelist.forEach(item => {
    if (item.FLAG !== "VERIFIED") {
      item.FLAG = "UNVERIFIED";
    }
  });

  // STEP 5: Rebuild EntriesInsert → include ALL items (true/false)
  this.EntriesInsert = this.Article_barcodelist.map(item => ({
    ARTICLE_ID: item.ARTICLE_ID,
    IS_SCANNED: item.FLAG === "VERIFIED"
  }));

  console.log("Entries:", this.EntriesInsert);

  // Clear field after delay
  setTimeout(() => {
    this.scannedBarcode = "";
  }, 300);
}




//======================insert Data=============
  saveRecord() {
 const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);

    
  // validation
  if (!this.selectedCategory) {
    this.categoryError = true;
  }

  if (!this.selectedArtno) {
    this.artnoError = true;
  }

  if (!this.selectdColor) {
    this.colorError = true;
  }

  if(!this.saveData.REASON ){
    this.ReasonError=true
  }
  else{
    this.ReasonError=false
  }
  // if any error → stop start button
  if (this.categoryError || this.artnoError || this.colorError || this.ReasonError) {
    return;
  }

    console.log(this.scannedBarcode, '========barcode========');


    console.log(this.Entries);
    if(this.scannedCount===0){
      this.toastr.error("Please scan at least one barcode before saving.");
      return;
    }
    if(variance>=delta && delta!=0){
      this.Is_Pending_High=true
        return;
    }
    

    const payload = {
      ...this.saveData,
      USER_ID: this.LoginResponse.USER_ID,
      CATEGORY_ID: this.selectedCategory,
      ART_NO: this.selectedArtno,
      COLOR: this.selectdColor,
      SIZE: this.selectedsize,
      IS_COMPLETED:this.saveData.IS_COMPLETED,
      Entries: this.EntriesInsert,
    };

    this.service.Inset_Article_Inventory(payload).subscribe((res:any)=>{
      console.log(res)

      this.closePopup()
      this.toastr.success("Article  inventory saved successfully");

      // this.get_Article_list()
    })

    console.log(payload);
    this.EntriesInsert=[];
  }
//================save with pending article==================
  Save_with_pending_Article(){

    
  // validation
  if (!this.selectedCategory) {
    this.categoryError = true;
  }

  if (!this.selectedArtno) {
    this.artnoError = true;
  }

  if (!this.selectdColor) {
    this.colorError = true;
  }

  if(!this.saveData.REASON ){
    this.ReasonError=true
  }
  else{
    this.ReasonError=false
  }
  // if any error → stop start button
  if (this.categoryError || this.artnoError || this.colorError || this.ReasonError) {
    return;
  }

    console.log(this.scannedBarcode, '========barcode========');


    console.log(this.Entries);
    if(this.scannedCount===0){
      this.toastr.error("Please scan at least one barcode before saving.");
      return;
    }
    

    const payload = {
      ...this.saveData,
      USER_ID: this.LoginResponse.USER_ID,
      CATEGORY_ID: this.selectedCategory,
      ART_NO: this.selectedArtno,
      COLOR: this.selectdColor,
      SIZE: this.selectedsize,
      IS_COMPLETED:this.saveData.IS_COMPLETED,
      Entries: this.EntriesInsert,
    };

    this.service.Inset_Article_Inventory(payload).subscribe((res:any)=>{
      console.log(res)

      this.closePopup()
      this.toastr.success("Article  inventory saved successfully");

      // this.get_Article_list()
    })

    console.log(payload);
    this.EntriesInsert=[];
  }


  //============Do not save pending article==================
  Not_save_pending_article(){
    this.Is_Pending_High=false
  }
  //========================commit in insert====================

commitArticleInventroy(){
   // validation
  if (!this.selectedCategory) {
    this.categoryError = true;
  }

  if (!this.selectedArtno) {
    this.artnoError = true;
  }

  if (!this.selectdColor) {
    this.colorError = true;
  }

  if(!this.saveData.REASON ){
    this.ReasonError=true
  }
  else{
    this.ReasonError=false
  }
  // if any error → stop start button
  if (this.categoryError || this.artnoError || this.colorError || this.ReasonError) {
    return;
  }
    if(this.scannedCount===0){
      this.toastr.error("Please scan at least one barcode before saving.",'',{ timeOut: 3000 });
      return;
    }
  const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);

  // ------------------------------
  // 🔐 STEP 2: Apply Validation Rule
  // ------------------------------
  if (delta !== 0 && variance >= delta) {
    this.toastr.error(
      `Unscanned Qty is higher than Max. allowed Limit`,'',
       { timeOut: 3000 }  // 3 seconds
    );
    return;
  }

    console.log(this.Entries);

  const payload={
      USER_ID: this.LoginResponse.USER_ID,
  CATEGORY_ID: this.selectedCategory,
  ART_NO: this.selectedArtno,
  COLOR: this.selectdColor,
  SIZE:this.selectedsize,
  REASON:this.saveData.REASON ,
  Entries: this.EntriesInsert
  }
  console.log(payload);

  this.service.Commit_Article_Inventory(payload).subscribe((res:any)=>{
    console.log(res)
    this.closePopup()
      // this.get_Article_list()
        this.toastr.success("Article inventory committed successfully");
  })
  
}

//======================form reset=================
Reset_form(){
  this.isStartButtonClicked=false
   this.saveData = {
    USER_ID: 0,
    CATEGORY_ID: 0,
    ART_NO: '',
    COLOR: '',
    SIZE: '',
    IS_COMPLETED: false,
    REASON: '',
    Entries: [],
  };

  this.selectdColor=''
  this.selectedArtno=''
  this.selectedCategory=''
  this.selectedsize=''
  this.Selected_Barcode=''
  this.Article_barcodelist=[]

}

closePopup(){
this.router.navigate(['/article-inventory']);
this.Reset_form();
}


convertCheckbox(){
  console.log("Checkbox changed. IS_COMPLETED:", this.saveData.IS_COMPLETED);
}
}
