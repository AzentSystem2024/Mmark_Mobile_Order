import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';
import { CommonModule } from '@angular/common';
import { MyserviceService } from '../../myservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-carton-add',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, FormsModule],
  templateUrl: './carton-add.component.html',
  styleUrl: './carton-add.component.scss'
})
export class CartonAddComponent {
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
    Carton_barcodelist: any[] = [];
    barcodeInput: any;
    Entries: any = [];
    totalItems: any=0;
    scannedCount: any=0;
    Carton_inventroy_list: any=[];
    selected_Data: any={};
    Selected_Barcode: any;
  isStartButtonClicked:boolean=false
  
  showSheet = false;
  selectedItem: any = null;
  showPopupscreen:boolean=false
  DeletePopupScreen:boolean=false
  isCommited:boolean=false
  isMultiboxChecked:boolean=false
  Load_Bardcode: any = { ArtNo: '', Color: '', CategoryId: 0, IsMultibox: 0};
  
    saveData = {
    UserId: 0,
  CategoryId: 0,
  ArtNo: "",
  Color: "",
  Reason:"",
  IsCommit: 0,
  IsCompleted: false,
  IsMultibox: false,
    Entries: [],
  };
    Carton_barcodelistUpdate: any;
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
  Is_Pending_High: boolean=false;
  isAdmin: boolean=false;

  constructor(private router:Router,private service:MyserviceService, private toastr: ToastrService) {
    this.get_Api_Dropdownfunction();

        
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

  
closePopup(){
                          this.router.navigate(['/carton-inventory']);
  this.Reset_form()
}


Load_Barcode_list(){

// reset errors
  this.categoryError = false;
  this.artnoError = false;
  this.colorError = false;

    if (!this.isMultiboxChecked) {

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
}

  
    console.log(
      '====================bar code function called==================='
    );
    const payload = {
      ...this.Load_Bardcode,
      ArtNo: this.selectedArtno,
      Color: this.selectdColor,
      CategoryId: Number(this.selectedCategory),
      IsMultibox:this.isMultiboxChecked?1:0
      
    };
    this.service.get_getavailable_bardcode(payload).subscribe((res: any) => {

      console.log(res);
      this.isLoading = false;
      this.Carton_barcodelist = res.Data;
      console.log(this.Carton_barcodelist);
      
         this.totalItems = this.Carton_barcodelist.length;
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
processScannedBarcode() {
  if (!this.isStartButtonClicked || !this.scannedBarcode?.trim()) return;

  const code = this.scannedBarcode.trim();
  console.log("Scanned Barcode:", code);

  // STEP 1: find matching item
  const matchedItem = this.Carton_barcodelist.find(
    item => item.Barcode === code
  );

  // ❌ NOT MATCHED → RESET FORM
  if (!matchedItem) {
    console.warn("Scanned barcode does NOT belong to selected article");

    // Reset everything
    this.scannedBarcode = "";
    // this.EntriesInsert = [];
    // this.scannedCount = 0;

    return; // stop execution
  }

  // STEP 2: Multiple scans → increase count
  if (!matchedItem.SCAN_COUNT) matchedItem.SCAN_COUNT = 0;
  matchedItem.SCAN_COUNT++;

  // STEP 3: Mark as VERIFIED
  matchedItem.FLAG = "VERIFIED";

  // STEP 4: Update total scanned count
  this.scannedCount = this.Carton_barcodelist.filter(
    item => item.FLAG === "VERIFIED"
  ).length;

  // ***********************
  // STEP 4.1: Calculate VARIANCE
  // ***********************
  this.variance =this.totalItems-this.scannedCount;

  console.log("Variance Updated:", this.variance);


  // Make sure all other items remain UNVERIFIED
  this.Carton_barcodelist.forEach(item => {
    if (item.FLAG !== "VERIFIED") {
      item.FLAG = "UNVERIFIED";
    }
  });

  // STEP 5: Rebuild EntriesInsert → include ALL items (true/false)
  this.EntriesInsert = this.Carton_barcodelist.map(item => ({
    BoxId: item.PackingId,
    IsScanned: item.FLAG === "VERIFIED"
  }));

  console.log("Entries:", this.EntriesInsert);

  // Clear field after delay
  setTimeout(() => {
    this.scannedBarcode = "";
  }, 300);
}
onColorSelected(){

}
onSizeSelected(){
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

//=================save in committ================

commitCartonInventory(){

  const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);

    if(!this.isMultiboxChecked){
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
  if (this.categoryError || this.artnoError || this.colorError || this.ReasonError) {
    return;
  }
}

  if(!this.saveData.Reason ){
    this.ReasonError=true
    return
  }
  else{
    this.ReasonError=false
  }


    console.log(this.scannedBarcode, '========barcode========');


    console.log(this.EntriesInsert,'========EntriesInsert========');
    if(this.scannedCount===0){
      this.toastr.error("Please scan at least one barcode before saving.");
      return;
    }
      // ------------------------------
  if (variance>delta) {
    this.toastr.error(
      `Unscanned Qty is higher than Max. allowed Limit`,'',
       { timeOut: 3000 }  // 3 seconds
    );
    return;
  }

  
const payload={
  UserId:this.LoginResponse.USER_ID,
  CategoryId: Number(this.selectedCategory),
 ArtNo: this.selectedArtno,
  Color: this.selectdColor,
    Reason:this.saveData.Reason,
      Entries: this.EntriesInsert,
      IsMultibox: this.isMultiboxChecked,
}

    this.service.Commit_carton_Inventory(payload).subscribe((res:any)=>{
      console.log(res)

      this.closePopup()
      this.toastr.success("Carton inventory saved successfully");
        this.router.navigate(['/carton-inventory']);

      // this.get_Article_list()
    })

  this.router.navigate(['/carton-inventory']);

}
saveRecord(){
  if(this.isMultiboxChecked){
    this.selectdColor=''
    this.selectedArtno=''
    this.selectedCategory=''    
  }
  const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);

    if(!this.isMultiboxChecked){
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
  if (this.categoryError || this.artnoError || this.colorError || this.ReasonError) {
    return;
  }
}

  if(!this.saveData.Reason ){
    this.ReasonError=true
    return
  }
  else{
    this.ReasonError=false
  }


    console.log(this.scannedBarcode, '========barcode========');


    console.log(this.EntriesInsert,'========EntriesInsert========');
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
      UserId: this.LoginResponse.USER_ID,
      CategoryId:Number(this.selectedCategory),
      ArtNo: this.selectedArtno,
      Color: this.selectdColor,
      IsCompleted:this.saveData.IsCompleted,
      Reason:this.saveData.Reason,
      Entries: this.EntriesInsert,
      IsMultibox: this.isMultiboxChecked,
    };


    this.service.Inset_Carton_Inventory(payload).subscribe((res:any)=>{
      console.log(res)

      this.closePopup()
      this.toastr.success("Article  inventory saved successfully");

      // this.get_Article_list()
    })

    console.log(payload);
    this.EntriesInsert=[];

}

Save_with_pending_Article(){
  
  const totalItem = this.totalItems
  const scannedItem = this.scannedCount
  const variance = totalItem - scannedItem;

  const delta = this.LoginResponse.MAXIMUM_DELTA_TOLERANCE ?? 0;  // user delta

  console.log("Variance:", variance, "Delta:", delta);

    if(!this.isMultiboxChecked){
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
  if (this.categoryError || this.artnoError || this.colorError || this.ReasonError) {
    return;
  }
}

  if(!this.saveData.Reason ){
    this.ReasonError=true
  }
  else{
    this.ReasonError=false
  }
   if (this.ReasonError) {
    return;
  }

    console.log(this.scannedBarcode, '========barcode========');


    console.log(this.EntriesInsert,'========EntriesInsert========');
    if(this.scannedCount===0){
      this.toastr.error("Please scan at least one barcode before saving.");
      return;
    }


    const payload = {
      ...this.saveData,
      UserId: this.LoginResponse.USER_ID,
      CategoryId: Number(this.selectedCategory),
      ArtNo: this.selectedArtno,
      Color: this.selectdColor,
      IsCompleted:this.saveData.IsCompleted,
      Reason:this.saveData.Reason,
      Entries: this.EntriesInsert,
      IsMultibox: this.isMultiboxChecked,
    };


    this.service.Inset_Carton_Inventory(payload).subscribe((res:any)=>{
      console.log(res)

      this.closePopup()
      this.toastr.success("Article  inventory saved successfully");

      // this.get_Article_list()
    })

    console.log(payload);
    this.EntriesInsert=[];

}
convertCheckbox(){
  console.log("Checkbox changed. IS_COMPLETED:", this.saveData.IsCompleted);
}
Not_save_pending_article(){
  this.Is_Pending_High=false
}
Reset_form(){
  console.log("Reset form called");
 this. saveData = {
    UserId: 0,
  CategoryId: 0,
  ArtNo: "",
  Color: "",
  Reason:"",
  IsCommit: 0,
  IsCompleted: false,
  IsMultibox: false,
    Entries: [],
  };
this.isMultiboxChecked=false
 this.selectedCategory=''
 this.selectedArtno=''
 this.selectdColor=''
 this.Carton_barcodelist=[]
 this.scannedBarcode=''
 this.scannedCount=0
 this.totalItems=0
 this.EntriesInsert=[]
 this.isStartButtonClicked=false
 this.variance=0
}

OnchangeReason(){
  this.ReasonError=false

}
}
