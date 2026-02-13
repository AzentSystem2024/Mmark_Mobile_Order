import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';
import { MyserviceService } from '../../myservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-carton-inventory',
  standalone: true,
  imports: [CommonModule,RouterModule,LayoutComponent],
  templateUrl: './carton-inventory.component.html',
  styleUrl: './carton-inventory.component.scss'
})
export class CartonInventoryComponent {
  isLoggedIn = !!sessionStorage.getItem('token');
  Carton_inventory_list: any[] = [];
showPopupscreen: boolean = false;
DeletePopupScreen: boolean = false;

record: any = null;

CanAdd: boolean = true;        // Permission for Add button
CanDelete: boolean = true;     // Permission for Delete button
isCommited: boolean = false;   // Used to hide delete button when committed
  Selected_Data: any;


  constructor(private router:Router, private service: MyserviceService,private toastr: ToastrService) {
    this.get_Carton_list()

  }
   ngOnInit() {
    console.log("LIST INIT CALLED");
    this.get_Carton_list();   // ✅ Now it will refresh when route reloads
  }

  homePage(){
    console.log('========function call============')
    
    this.router.navigate(['/layout'])
    
  }
  showEditScreen(record: any) {
  console.log("Action popup opened:", record);
  this.record = record;
  this.showPopupscreen = true;

  this.Selected_Data=record


  this.isCommited = record.Status === "COMMITTED";
}
closeEditpopup() {
  this.showPopupscreen = false;
  this.record = null;
}
editRow(record:any) {
  console.log("Edit clicked:", this.record);
  console.log("Navigate to Details screen:", this.record);


  this.router.navigate(['/edit-carton-inventory'],
    {
     state: { data: this.record }
    }
  );
}
deleteRow() {
  console.log("Delete clicked:", this.record);
  this.DeletePopupScreen = true;
}
confirmDelete() {
  console.log("Deleted:", this.record);

  // remove from list (dummy)
  this.Carton_inventory_list = this.Carton_inventory_list.filter(
    (item) => item.DocNo !== this.record.DocNo
  );
  this.service.delete_Carton_inventory(this.record.DocNo).subscribe((res:any)=>{
    console.log(res)
    this.get_Carton_list()
    this.toastr.success("Carton inventory deleted successfully");

    this.DeletePopupScreen=false
    this.showPopupscreen=false
  
  })

  this.DeletePopupScreen = false;
  this.showPopupscreen = false;

  // alert("Deleted record: " + record.DocNo);
}

closeDeletePopup() {
  this.DeletePopupScreen = false;
}
openPopup() {
  console.log("Open New Inventory Form");
  // alert("New Inventory Form (Dummy)");
  this.router.navigate(['/add-carton-inventory']);
}
//=====================list function==================

get_Carton_list(){
   this.service.get_Carton_inventory_list().subscribe((res: any) => {
      console.log(res);
      this.Carton_inventory_list = res.Data.slice().reverse();

      console.log(res.INVENTORY_TIME)
    });
}
}