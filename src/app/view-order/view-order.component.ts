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

