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

  showRemoveConfirm = false;
  removeIndex: number | null = null;
  showSubmitConfirm = false;

  startX = 0;
  currentX = 0;
  swipeIndex: number | null = null;

  translateX: { [key: number]: number } = {};

  showSnack = false;
  snackMessage = '';
  snackType: 'success' | 'error' = 'success';
  snackTimer: any;

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
  this.removeIndex = index;
  this.showRemoveConfirm = true;
}

confirmRemove() {

  if (this.removeIndex === null) return;

  this.cartItems.splice(this.removeIndex, 1);

  sessionStorage.setItem('cart', JSON.stringify(this.cartItems));

  this.showRemoveConfirm = false;
  this.removeIndex = null;
}

cancelRemove() {
  this.showRemoveConfirm = false;
  this.removeIndex = null;
}


  getColorHex(color: string): string {

  if (!color) return '#cccccc';

  const c = color.toUpperCase().trim();

  switch (c) {

    /* ================= BLACK / WHITE ================= */
    case 'BLACK':
    case 'FULL BLACK':
    case 'PLAIN BLACK':
      return '#000000';

    case 'WHITE':
    case 'FULL WHITE':
      return '#ffffff';

    case 'IVORY':
    case 'CREAM':
      return '#fffdd0';

    /* ================= BLUE FAMILY ================= */
    case 'BLUE':
    case 'PLAIN BLUE':
      return '#1e90ff';

    case 'NAVY BLUE':
      return '#000080';

    case 'SKY BLUE':
      return '#87ceeb';

    case 'STONE BLUE':
      return '#6a8fa5';

    case 'CYAN BLUE':
      return '#00bcd4';

    case 'TEAL':
      return '#008080';

    /* ================= RED FAMILY ================= */
    case 'RED':
      return '#b22222';

    case 'CHERRY':
      return '#b11226';

    case 'MAROON':
      return '#800000';

    case 'SALMON':
      return '#fa8072';

    /* ================= GREEN FAMILY ================= */
    case 'GREEN':
      return '#228b22';

    case 'FOREST GREEN':
      return '#0b6623';

    case 'OLIVE':
    case 'OLIVE GREEN':
      return '#6b8e23';

    case 'PISTA':
      return '#93c572';

    case 'MEHANDI':
      return '#5f7f3a';

    case 'D GREEN':
      return '#006400';

    /* ================= YELLOW / ORANGE ================= */
    case 'YELLOW':
      return '#ffd700';

    case 'MUSTARD':
      return '#ffdb58';

    case 'LEMON':
      return '#fff44f';

    case 'ORANGE':
      return '#ff8c00';

    case 'PEANUT':
      return '#c9a15b';

    /* ================= GREY FAMILY ================= */
    case 'GREY':
    case 'GRAY':
    case 'FULL GREY':
    case 'STEEL GREY':
    case 'GREY RER':       // typo handled
      return '#808080';

    case 'MOUSE':
      return '#9e9e9e';

    case 'CITADEL':
      return '#7a7f86';

    /* ================= BROWN / EARTH ================= */
    case 'BROWN':
    case 'D BROWN':
    case 'F BROWN':
      return '#8b5a2b';

    case 'COFFEE':
    case 'MOCHA':
      return '#6f4e37';

    case 'COFFEE BROWN':
      return '#5a3a1e';

    case 'CHOCO':
      return '#3f2a14';

    case 'CAMEL':
    case 'CHIKU':
    case 'TAN':
    case 'FULL TAN':
    case 'D TAN':
      return '#d2b48c';

    case 'TAN BLACK':
      return 'linear-gradient(45deg, #d2b48c, #000000)';

    case 'MUD':
      return '#70543e';

    case 'RED BROWN':
      return '#7a2e2e';

    case 'TOFFEE':
      return '#c68642';

    /* ================= PINK / PURPLE ================= */
    case 'PINK':
      return '#ff69b4';

    case 'PEACH':
      return '#ffdab9';

    case 'LAVENDER':
      return '#e6e6fa';

    case 'PURPLE':
      return '#800080';

    case 'VIOLET':
      return '#8a2be2';

    case 'GRAPE':
      return '#6f2da8';

    /* ================= METALLIC ================= */
    case 'GOLD':
      return '#d4af37';

    case 'SILVER':
      return '#c0c0c0';

    case 'COPPER':
      return '#b87333';

    /* ================= SUEDE ================= */
    case 'SUEDE BRN':
      return '#704214';

    case 'SUEDE MS':
    case 'SUEDE MDI':
      return '#5a5a5a';

    /* ================= SPECIAL ================= */
    case 'PEACOCK':
      return '#006d6f';

    /* ================= DUAL / MIX COLORS ================= */
    case 'BLACK WHITE':
    case 'WHITE BLACK':
    case 'BEIGE BLACK':
    case 'BLACK GREY':
    case 'GREY BLACK':
    case 'GREY BLUE':
    case 'BLUE GREY':
    case 'BLUE BLACK':
    case 'SILVER BLACK':
    case 'WHILE BLUE':     // typo handled
      return 'linear-gradient(45deg, #000000, #ffffff)';

    case 'GREEN RED':
      return 'linear-gradient(45deg, #228b22, #b22222)';

    case 'BLUE RED':
      return 'linear-gradient(45deg, #1e90ff, #b22222)';

    case 'GREY RED':
      return 'linear-gradient(45deg, #808080, #b22222)';

    case 'GREY YELLOW':
      return 'linear-gradient(45deg, #808080, #ffd700)';

    /* ================= FALLBACK ================= */
    default:
      return '#cccccc';
  }
}

goBack() {
  this.routes.navigate(['/home']);
}

openSubmitConfirm() {

  if (!this.cartItems.length) return;

  this.showSubmitConfirm = true;
}


cancelSubmit() {
  this.showSubmitConfirm = false;
}

confirmSubmit() {
  this.showSubmitConfirm = false;
  this.submitOrder(); // existing logic
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
      // this.toastr.success(res.message || 'Order submitted successfully');
      this.showSnackBar(
        res.message || 'Order submitted successfully',
        'success'
      );
      this.isSaving = false;

      // ✅ show snack FIRST
      this.showSnackBar(
        res.message || 'Order submitted successfully',
        'success'
      );

      this.isSaving = false;

      // ⏳ navigate AFTER snack duration
      setTimeout(() => {
        this.routes.navigate(['/home']);
      }, 2500);

    } else {

      // ❌ backend returned failure
      // this.toastr.error(res?.message || 'Failed to submit order');
      this.showSnackBar(
        res.message || 'Failed to submit order',
        'error'
      );
      this.isSaving = false;
    }

  }, err => {

    // ❌ API/network error
    // this.toastr.error('Failed to submit order');
    this.showSnackBar(
        'Failed to submit order',
        'error'
      );
    this.isSaving = false;

  });

}



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

// parseCombination(str:string) {

//   if (!str) return [];

//   return str.split(',')
//     .map(x => {

//       const parts = x.split('*');

//       return {
//         size: parts[0]?.trim(),
//         quantity: Number(parts[1] || 0)
//       };

//     })
//     .filter(x => x.quantity > 0);   // 👈 DOUBLE SAFETY
// }

parseCombination(str: string): { size: string; quantity: number }[] {

  if (!str) return [];

  return str
    .split(',')
    .map((raw: string): { size: string; quantity: number } => {

      const cleaned = raw.replace(/"/g, '').trim();

      // 🔒 CUT SIZE ONLY → must contain '*'
      if (!cleaned.includes('*')) {
        return { size: '', quantity: 0 };
      }

      const parts = cleaned.split('*');

      const size = parts[0]?.trim();
      const qty = Number(parts[1]?.trim() || 0);

      return {
        size,
        quantity: qty
      };
    })
    .filter(
      (x: { size: string; quantity: number }) =>
        x.size !== '' && x.quantity > 0
    );
}





editItem(index: number) {
  this.routes.navigate(['/edit-order', index]);
}


getSetTotal(item: any): number {
  return item.setSizes?.reduce(
    (sum: number, x: any) => sum + (x.qty || 0),
    0
  ) || 0;
}

getSemiTotal(item: any): number {
  return item.semiSizes?.reduce(
    (sum: number, x: any) => sum + (x.qty || 0),
    0
  ) || 0;
}

getCaseTotal(item: any): number {
  return item.caseSizes?.reduce(
    (sum: number, x: any) => sum + (x.qty || 0),
    0
  ) || 0;
}


getVisibleColumns(item: any): number {
  let count = 0;

  if (item.setSizes?.length) count++;
  if (this.userType !== 4 && item.semiSizes?.length) count++;
  if (item.caseSizes?.length) count++;

  return count;
}

getLayoutClass(item: any): string {
  const cols = this.getVisibleColumns(item);

  if (cols === 1) return 'one-col-right';
  if (cols === 2) return 'two-col-right';
  return 'three-col';
}



showSnackBar(
  message: string,
  type: 'success' | 'error' = 'success',
  duration = 2500
) {
  this.snackMessage = message;
  this.snackType = type;
  this.showSnack = true;

  clearTimeout(this.snackTimer);

  this.snackTimer = setTimeout(() => {
    this.showSnack = false;
  }, duration);
}


}
