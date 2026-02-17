import { Component } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss'
})
export class ViewOrderComponent {

order!: ViewOrderResponse;
loading = true;
orderNo:any;
userType:any;

constructor(private service:MyserviceService, private route:ActivatedRoute){}

ngOnInit() {
  const orderId = Number(this.route.snapshot.paramMap.get('id'));
  this.orderNo = history.state?.ORDER_NO;
  console.log(orderId,"orderId")

  const login = JSON.parse(sessionStorage.getItem('LogData') || '{}');
  this.userType = Number(login.USER_TYPE);

  const payload ={
    ORDER_ID : orderId
  }

  this.service.viewOrder(payload).subscribe({
    next: (res: any) => {
      if (res.flag === '1') {
        this.order = res;
      }
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
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
  history.back();
}

hasQty(arr: any[]): boolean {
  return Array.isArray(arr) && arr.some(x => x.qty > 0);
}

getSetTotal(item: any): number {
  return (item.setSizes || [])
    .reduce((a: number, b: any) => a + (b.qty || 0), 0);
}

getSemiTotal(item: any): number {
  return (item.semiSizes || [])
    .reduce((a: number, b: any) => a + (b.qty || 0), 0);
}

getCaseTotal(item: any): number {
  return (item.caseSizes || [])
    .reduce((a: number, b: any) => a + (b.qty || 0), 0);
}


getColumnClass(item: any): string {
  const hasSet  = this.userType != 4 && this.hasQty(item.setSizes);
  const hasSemi = this.userType != 4 && this.hasQty(item.semiSizes);
  const hasCase = this.hasQty(item.caseSizes);

  const count = [hasSet, hasSemi, hasCase].filter(Boolean).length;

  if (count === 1) return 'one-col-right';
  if (count === 2) return 'two-col-right';
  return 'three-col'; // 🔥 FIX
}

}



export interface ViewOrderResponse {
  orderID: number;
  orderDate: string;
  items: ViewOrderItem[];
  flag: string;
  message: string;
}

export interface ViewOrderItem {
  artNo: string;
  categoryID: number;
  categoryName: string;
  color: string;
  setSizes : SetSize[];
  semiSizes: SemiSize[];
  caseSizes: CaseSize[];
}

export interface SetSize {
  size: string;
  qty: number;
}

export interface SemiSize {
  size: string;
  qty: number;
}

export interface CaseSize {
  packingID: number;
  size: string;
  qty: number;
  combination: string;
}

