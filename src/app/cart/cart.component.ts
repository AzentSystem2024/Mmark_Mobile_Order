import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems:any[] = [];
  isSaving = false;
  userType:any;

  constructor(
    private service:MyserviceService, 
    private toastr: ToastrService,
    private routes: Router,){
      
    }

  ngOnInit() {
  this.cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
  
  const login = JSON.parse(sessionStorage.getItem('LogData') || '{}');
  this.userType = Number(login.USER_TYPE);
}

  removeItem(index: number) {

  this.cartItems.splice(index, 1);

  // Update sessionStorage
  sessionStorage.setItem('cart', JSON.stringify(this.cartItems));
}

  getColorHex(color: string): string {

  switch (color.toUpperCase().trim()) {

    case 'BLACK': return '#000000';
    case 'BROWN': return '#8b5a2b';
    case 'TAN': return '#d2b48c';
    case 'WHITE': return '#ffffff';
    case 'OFF WHITE': return '#f5f5f5';
    case 'CREAM': return '#fffdd0';

    case 'NAVY': return '#000080';
    case 'BLUE': return '#1e90ff';
    case 'SKY BLUE': return '#87ceeb';

    case 'GREY':
    case 'GRAY': return '#808080';
    case 'DARK GREY': return '#4f4f4f';
    case 'LIGHT GREY': return '#d3d3d3';

    case 'RED': return '#b22222';
    case 'MAROON': return '#800000';
    case 'BURGUNDY': return '#800020';

    case 'GREEN': return '#228b22';
    case 'OLIVE': return '#6b8e23';
    case 'DARK GREEN': return '#006400';

    case 'YELLOW': return '#ffd700';
    case 'MUSTARD': return '#ffdb58';

    case 'ORANGE': return '#ff8c00';

    case 'PINK': return '#ff69b4';
    case 'PEACH': return '#ffdab9';

    case 'PURPLE': return '#800080';
    case 'VIOLET': return '#8a2be2';

    case 'BEIGE': return '#f5f5dc';
    case 'CAMEL': return '#c19a6b';
    case 'COFFEE': return '#6f4e37';
    case 'CHOCOLATE': return '#3f2a14';

    case 'GOLD': return '#d4af37';
    case 'SILVER': return '#c0c0c0';

    case 'MULTI':
    case 'MULTICOLOR': return 'linear-gradient(45deg, red, yellow, green, blue)';

    default:
      return '#cccccc'; // fallback unknown color
  }
}

goBack() {
  history.back();
}

submitOrder() {

  this.isSaving = true;

  const payload = this.buildPayload();

  console.log(payload);

  this.service.saveNewOrder(payload).subscribe((res: any) => {

    if (res?.flag === "1") {

      // ✅ clear cart
      sessionStorage.removeItem('cart');
      this.cartItems = [];

      // ✅ toast success
      this.toastr.success(res.message || 'Order submitted successfully');
      this.isSaving = false;

      this.routes.navigate(['/home']);

    } else {

      // ❌ backend returned failure
      this.toastr.error(res?.message || 'Failed to submit order');
      this.isSaving = false;
    }

  }, err => {

    // ❌ API/network error
    this.toastr.error('Failed to submit order');
    this.isSaving = false;

  });

}


// buildPayload() {

//   const order_header: any[] = [];
//   const order_entry: any[] = [];
//   const order_combination: any[] = [];

//   let orderNo = 1;   // frontend generated

//   this.cartItems.forEach(item => {

//     // ================= HEADER =================
//     order_header.push({
//       SALESMAN_ID: 1,
//       DEALER_ID: 2,
//       RETAILER_ID: 3,
//       ORDER_NO: orderNo
//     });

//     // ================= SEMI ENTRIES =================
//     item.semiSizes.forEach((s:any) => {

//       order_entry.push({
//         ORDER_NO: orderNo,
//         ART_NO: item.artNo,
//         COLOR: item.color,
//         CATEGORY_ID: item.catgoryID,
//         PAIR_SIZE: s.ID,
//         PACKING_ID: 0,
//         ORDER_QTY: s.qty
//       });

//     });

//     // ================= CASE ENTRIES =================
//     item.caseSizes.forEach((c:any) => {

//       order_entry.push({
//         ORDER_NO: orderNo,
//         ART_NO: item.artNo,
//         COLOR: item.color,
//         CATEGORY_ID: item.catgoryID,
//         PAIR_SIZE: 0,
//         PACKING_ID: c.packingID || 0,
//         ORDER_QTY: c.qty
//       });

//       // ================= CUT COMBINATION =================
//       if (c.combination && c.combination.trim() !== '') {

//       this.parseCombination(c.combination)
//         .filter(x => x.quantity > 0)   // 👈 CRITICAL
//         .forEach((x:any) => {

//           order_combination.push({
//             ORDER_NO: orderNo,
//             PACKING_ID: c.packingID || 0,
//             SIZE: x.size,
//             QUANTITY: x.quantity
//           });

//         });
//     }

//     });

//     orderNo++;   // next cart item → next header
//   });

//   return {
//     order_header,
//     order_entry,
//     order_combination
//   };
// }

// buildPayload() {

//   const login = JSON.parse(sessionStorage.getItem('LogData') || '{}');

//   const SALESMAN_ID = login.USER_ID || 0;
//   const DEALER_ID   = login.DISTRIBUTOR_ID || 0;
//   const RETAILER_ID = login.RETAILER_ID || 0;

//   const order_header: any[] = [];
//   const order_entry: any[] = [];
//   const order_combination: any[] = [];

//   let orderNo = 1;

//   this.cartItems.forEach(item => {

//     let entryNo = 1;   // 👈 reset per order

//     // HEADER
//     order_header.push({
//       SALESMAN_ID: SALESMAN_ID,
//       DEALER_ID: DEALER_ID,
//       RETAILER_ID: RETAILER_ID,
//       ORDER_NO: orderNo
//     });

//     // SEMI
//     item.semiSizes.forEach((s: any) => {

//       order_entry.push({
//         ORDER_NO: orderNo,
//         ENTRY_NO: entryNo,
//         ART_NO: item.artNo,
//         COLOR: item.color,
//         CATEGORY_ID: item.catgoryID,
//         PAIR_SIZE: s.ID,
//         PACKING_ID: 0,
//         ORDER_QTY: s.qty
//       });

//       entryNo++;
//     });

//     // CASE
//     item.caseSizes.forEach((c: any) => {

//       const currentEntryNo = entryNo;

//       order_entry.push({
//         ORDER_NO: orderNo,
//         ENTRY_NO: currentEntryNo,
//         ART_NO: item.artNo,
//         COLOR: item.color,
//         CATEGORY_ID: item.catgoryID,
//         PAIR_SIZE: 0,
//         PACKING_ID: c.packingID || 0,
//         ORDER_QTY: c.qty
//       });

//       // CUT combinations
//       if (c.combination?.trim()) {

//         this.parseCombination(c.combination)
//           .filter(x => x.quantity > 0)
//           .forEach((x: any) => {

//             order_combination.push({
//               ORDER_NO: orderNo,
//               ENTRY_NO: currentEntryNo,   // 👈 KEY LINK
//               PACKING_ID: c.packingID || 0,
//               SIZE: x.size,
//               QUANTITY: x.quantity
//             });

//           });
//       }

//       entryNo++;
//     });

//     orderNo++;
//   });

//   return {
//     order_header,
//     order_entry,
//     order_combination
//   };
// }


buildPayload() {

  const login = JSON.parse(sessionStorage.getItem('LogData') || '{}');

  const orderForStr = sessionStorage.getItem('ORDER_FOR');

  const userType = Number(login.USER_TYPE);
  
  this.userType = Number(login.USER_TYPE);

  let SALESMAN_ID = login.USER_ID || 0;
  let DEALER_ID = 0;
  let RETAILER_ID = 0;
  let SUB_DEALER_ID = 0;

  /* ================= USER TYPE RULES ================= */

  if (userType === 4) {
    // Dealer-only user
    DEALER_ID = login.DISTRIBUTOR_ID || 0;
    RETAILER_ID = 0;
    SUB_DEALER_ID = 0;
  }

  if (userType === 13) {
    // Retailer-capable user
    DEALER_ID = 0;
    RETAILER_ID = login.RETAILER_ID || 0;
    SUB_DEALER_ID = 0;
  }

  /* ================= ORDER_FOR OVERRIDE ================= */
  // Apply ONLY if not USER_TYPE = 4

  if (userType !== 4 && orderForStr) {
    const orderFor = JSON.parse(orderForStr);

    const dealerId = orderFor?.DEALER_ID;
    const retailerId = orderFor?.RETAILER_ID;
    const subDealerID = orderFor?.SUB_DEALER_ID;
  if (retailerId) {
        DEALER_ID = 0;
        SUB_DEALER_ID = 0;
        RETAILER_ID = retailerId;
      }

    // 🔹 Sub Dealer Order
    else if (subDealerID) {
      DEALER_ID = 0;
      SUB_DEALER_ID = subDealerID;
      RETAILER_ID = 0;
    }

    // 🔹 Dealer Order
    else if (dealerId) {
      DEALER_ID = dealerId;
      SUB_DEALER_ID = 0;
      RETAILER_ID = 0;
    }
  }

  const order_header: any[] = [];
  const order_entry: any[] = [];
  const order_combination: any[] = [];

  const ORDER_NO = 1;        // ✅ single order
  let entryNo = 1;           // ✅ increments per entry

  // ================= HEADER (ONLY ONCE) =================
  order_header.push({
    SALESMAN_ID: SALESMAN_ID,
    DEALER_ID: DEALER_ID,
    RETAILER_ID: RETAILER_ID,
    SUB_DEALER_ID : SUB_DEALER_ID,
    ORDER_NO: ORDER_NO
  });

  // ================= LOOP CART ITEMS =================
  this.cartItems.forEach(item => {


    // ---------- SET ----------
    item.setSizes?.forEach((s: any) => {

      const currentEntryNo = entryNo;

      order_entry.push({
        ORDER_NO: ORDER_NO,
        ENTRY_NO: currentEntryNo,
        ART_NO: item.artNo,
        COLOR: item.color,
        CATEGORY_ID: item.catgoryID,
        PAIR_SIZE: 0,
        PACKING_ID : 0,
        SET_ID: s.packingID || 0,
        ORDER_QTY: s.qty
      });

      entryNo++;
    });


    // ---------- SEMI ----------
    item.semiSizes.forEach((s: any) => {

      order_entry.push({
        ORDER_NO: ORDER_NO,
        ENTRY_NO: entryNo,
        ART_NO: item.artNo,
        COLOR: item.color,
        CATEGORY_ID: item.catgoryID,
        PAIR_SIZE: s.ID,
        PACKING_ID: 0,
        SET_ID : 0,
        ORDER_QTY: s.qty
      });

      entryNo++;
    });

    // ---------- CASE ----------
    item.caseSizes.forEach((c: any) => {

      const currentEntryNo = entryNo;

      order_entry.push({
        ORDER_NO: ORDER_NO,
        ENTRY_NO: currentEntryNo,
        ART_NO: item.artNo,
        COLOR: item.color,
        CATEGORY_ID: item.catgoryID,
        PAIR_SIZE: 0,
        PACKING_ID: c.packingID || 0,
        SET_ID:0,
        ORDER_QTY: c.qty
      });

      // ---------- CUT COMBINATION ----------
      if (c.combination?.trim()) {

        this.parseCombination(c.combination)
          .filter(x => x.quantity > 0)
          .forEach((x: any) => {

            order_combination.push({
              ORDER_NO: ORDER_NO,
              ENTRY_NO: currentEntryNo,   
              PACKING_ID: c.packingID || 0,
              SIZE: x.size,
              QUANTITY: x.quantity
            });

          });
      }

      entryNo++;
    });

  });

  return {
    order_header,
    order_entry,
    order_combination
  };
}





parseCombination(str:string) {

  if (!str) return [];

  return str.split(',')
    .map(x => {

      const parts = x.split('*');

      return {
        size: parts[0]?.trim(),
        quantity: Number(parts[1] || 0)
      };

    })
    .filter(x => x.quantity > 0);   // 👈 DOUBLE SAFETY
}


editItem(index: number) {
  this.routes.navigate(['/edit-order', index]);
}

}
