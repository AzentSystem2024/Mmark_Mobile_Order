import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HostListener, ElementRef, ViewChild } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent {

  @ViewChild('artBox') artBox!: ElementRef;
  @ViewChild('artInput') artInput!: ElementRef;
  
  

  cartCount = 0;
  currentImage = 0;
  startX = 0;

  artSearch = '';
  selectedCategory = '';

  artNos : any[] = [];
  filteredArtNos: string[] = [];

  categories: any[] = [];

  // selectedColor = 'Black';

  // colors = ['Black', 'Brown'];


  colors: any[] = [];

selectedColorIndex = -1;


  // productImages = [
  //   'https://mmarkgroup.in/wp-content/uploads/2024/05/03-01-3-140x195.png',
  //   'https://mmarkgroup.in/wp-content/uploads/2024/05/03-02-5-140x195.png'
  // ];

  productImage = '';

  colorThumbs = [
  'https://mmarkgroup.in/wp-content/uploads/2024/05/03-11-3-140x195.png',
  'https://mmarkgroup.in/wp-content/uploads/2024/05/03-10-3-140x195.png'
];

showImagePreview = false;

selectedTab = 'Set';

setSizes: any[] = [];
semiSizes: any[] = [];
caseSizes: any[] = [];

showCutPopup = false;

cutSizes: any[] = [];
activeCutRow: any = null;
cutError = '';

ukSizes = [7, 8, 9, 10];
selectedUkSize: number | null = null;

packingQuantity:any;
caseList:any;

quantity = 1;
distributorName='';
retailerName='';
showSemiTab = true;
userType!: number;
userName:any;
salesManDealerName:any;
salesManRetailerName:any;
salesManSubDealerName:any;
isSaving = false;
selectedCutSizeLabel = '';

showUnsavedPopup = false;
pendingNavigation = false;


pendingAction: (() => void) | null = null;
pendingArtNo: string | null = null;
previousArtNo: string = '';
previousSelectedCategory :string = '';


colorStateMap: {
  [key: string]: {
    setSizes: any[];
    semiSizes: any[];
    caseSizes: any[];
    productImage: string;
  }
} = {};

  showSnack = false;
  snackMessage = '';
  snackType: 'success' | 'error' = 'success';
  snackTimer: any;


  constructor(private router: Router,
    private service:MyserviceService,
    private toastr: ToastrService
  ) {}

  @HostListener('window:popstate', ['$event'])
onPopState(event: any) {

  if (this.hasUnsavedChanges()) {
    history.pushState(null, '', location.href); // stop navigation
    this.showUnsavedPopup = true;
  }
}

  ngOnInit() {

  history.pushState(null, '', location.href);

  const logDataStr = sessionStorage.getItem('LogData');

  if (logDataStr) {
    const logData = JSON.parse(logDataStr);

    this.distributorName = logData?.DISTRIBUTOR_NAME || '';
    this.retailerName = logData?.RETAILER_NAME || '';
    this.userName = logData?.USER_NAME || '';
    this.userType = Number(logData.USER_TYPE);
  }

  if(this.userType == 4){
    this.showSemiTab = false;
    this.selectedTab = 'Case';
  }
  else{
    this.showSemiTab = true;
    this.selectedTab = 'Set';
  }

  const orderForStr = sessionStorage.getItem('ORDER_FOR');
  if (orderForStr) {
    const orderFor = JSON.parse(orderForStr);

    const dealerId = orderFor?.DEALER_ID;
    const retailerId = orderFor?.RETAILER_ID;
    const subDealerId = orderFor?.SUB_DEALER_ID;

    this.salesManDealerName = orderFor?.DEALER_NAME;
    this.salesManRetailerName = orderFor?.RETAILER_NAME;
    this.salesManSubDealerName = orderFor?.SUB_DEALER_NAME;
    

    // ✅ CORE RULE
    // Dealer order → hide Semi
    if (retailerId) {
      this.showSemiTab = true;
      this.selectedTab = 'Set';
    }

    // ✅ Dealer or Sub Dealer Order → Hide Semi
    else if (dealerId || subDealerId) {
      this.showSemiTab = false;
      this.selectedTab = 'Case';
    }
  }

  const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
  this.cartCount = cart.length;

  this.loadCategories();
}

  goToCart() {

  if (this.hasUnsavedChanges()) {

    // show popup instead of direct navigation
    this.pendingAction = () => {
      this.router.navigate(['/cart']);
    };

    this.showUnsavedPopup = true;
    return;
  }

  this.router.navigate(['/cart']);
}



  loadCategories() {

  const payload = {
    NAME: "CATEGORY"
  };

  this.service.get_DropDown_Data(payload).subscribe((res: any) => {
    this.categories = res;
  });
}

loadArtNos() {
  this.productImage = '';

  this.artSearch = '';

  this.filteredArtNos = [];

    // Colors
    this.colors = [];
    this.selectedColorIndex = -1;

    // Sizes
    this.semiSizes = [];
    this.caseSizes = [];
    this.setSizes = [];

    // Cut popup
    this.cutSizes = [];
    this.activeCutRow = null;
    this.showCutPopup = false;

    // Tab
  this.selectedTab = this.showSemiTab ? 'Set' : 'Case';
  
  this.service.getArtNo(this.selectedCategory).subscribe((res:any)=>{
    this.artNos = res;
  });

  setTimeout(() => {
    this.artInput?.nativeElement.focus();
  }, 0);
}


  openImagePreview() {
    
    if (!this.productImage) {
    return; // ❌ no image → do nothing
  }
  this.showImagePreview = true;
}

closeImagePreview() {
  this.showImagePreview = false;
}


  onTouchStart(event: TouchEvent) {
  this.startX = event.touches[0].clientX;
}

  onTouchEnd(event: TouchEvent) {
  const endX = event.changedTouches[0].clientX;
  const diff = this.startX - endX;

  if (diff > 50) {
    // this.nextImage();
  } else if (diff < -50) {
    // this.prevImage();
  }
}

// nextImage() {
//   if (this.currentImage < this.productImages.length - 1) {
//     this.currentImage++;
//   }
// }

// prevImage() {
//   if (this.currentImage > 0) {
//     this.currentImage--;
//   }
// }

filterArtNos() {
  const term = this.artSearch.trim().toLowerCase();

  if (!term) {
    this.filteredArtNos = [];
    return;
  }

  this.filteredArtNos = this.artNos.filter(a =>
    a?.toLowerCase().startsWith(term)
  );
}

// selectArt(art: string) {

//   this.artSearch = art;
//   this.filteredArtNos = [];

//    this.selectedTab = 'Semi';     // 👈 reset tab

//   this.semiSizes = [];
//   this.caseSizes = [];
  
//   const payload={
//     ArtNo: art
//   }

//   this.service.getArtNoDetails(payload).subscribe((res: any) => {

//     if (res.flag === "1") {

//       // Convert backend colors → UI colors
//       this.colors = res.Colors.map((x: any) => ({
//         name: x.Color,
//         hex: this.getColorHex(x.Color)
//       }));

//       // Select first color automatically
//       this.selectedColorIndex = 0;

//       // Semi sizes
//       this.semiSizes = res.Semi.map((x: any) => ({
//         size: x.Size,
//         qty: 0
//       }));

//       // Case sizes
//       this.caseSizes = res.Case.map((x: any) => ({
//         size: x.Size,
//         qty: 0
//       }));

//       // Packing quantity
//       this.packingQuantity = res.packingQuantity;

//     }

//   });
// }


selectArt(art: string) {

  this.handleChangeWithConfirmation(() => {

    this.artSearch = art;
    this.previousArtNo = this.artSearch;
    this.filteredArtNos = [];
    this.selectedTab = this.showSemiTab ? 'Set' : 'Case';

    const payload = {
      ArtNo: art,
      CategoryID: this.selectedCategory,
    };

    this.service.getArtColor(payload).subscribe((res: any) => {

      if (res.flag === "1") {

        this.colors = res.Colors.map((x: any) => ({
          name: x.Color,
          hex: this.getColorHex(x.Color)
        }));

        this.selectedColorIndex = 0;

        const itemPayload = {
          ArtNo: art,
          CategoryID: this.selectedCategory,
          Color: this.colors[0].name
        };

        this.loadPacking(itemPayload);
      }
    });

  });
}



  loadPacking(payload: any) {

  this.service.getArtNoDetails(payload).subscribe((res: any) => {

    if (res.flag === "1") {

      // ✅ SET PRODUCT IMAGE
      if (res.IMAGE_NAME) {
        this.productImage = `https://mmarkonline.com/artimages/${res.IMAGE_NAME}`;
      } else {
        this.productImage = 'https://mmarkonline.com/artimages/NoImage.jpg';
      }

      this.setSizes = (res.Set || []).map((x: any) => ({
        size: x.Description,
        qty: 0,
        Combination: x.Combination,
        PairQty: x.PairQty,
        packingID: x.PackingID
      }));

      this.semiSizes = res.Semi.map((x: any) => ({
        size: x.Size,
        qty: 0,
        ID : x.ID
      }));

      this.caseSizes = res.Case.map((x: any) => ({
        size: x.Description,
        qty: 0,
        isCut: x.IsCutSize,
        Combination : x.Combination,
        PairQty : x.PairQty,
        sizes: x.Sizes,
        packingID : x.PackingID
      }));
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

  if (this.hasUnsavedChanges()) {
    this.showUnsavedPopup = true;
    this.pendingNavigation = true;
    return;
  }

  this.router.navigate(['/home']);
}


@HostListener('document:click', ['$event'])
clickOutside(event: Event) {
  if (this.artBox && !this.artBox.nativeElement.contains(event.target)) {
    this.filteredArtNos = [];   // close dropdown
  }
}

get selectedColor() {
  if (!this.colors.length || this.selectedColorIndex < 0) return null;
  return this.colors[this.selectedColorIndex];
}


selectBackendColor(i: number) {

  if (this.selectedColorIndex === i) return;



    // 🔐 save previous color data
    this.saveCurrentColorState();

    this.selectedColorIndex = i;

    const colorName = this.colors[i].name;
    const key = this.getColorKey(this.artSearch, colorName);

    // ✅ If already edited before → restore
    if (this.colorStateMap[key]) {
      const saved = this.colorStateMap[key];

      this.setSizes = this.clone(saved.setSizes);
      this.semiSizes = this.clone(saved.semiSizes);
      this.caseSizes = this.clone(saved.caseSizes);
      this.productImage = saved.productImage;
      return;
    }

    // ❌ first time this color → load fresh
    const payload = {
      ArtNo: this.artSearch,
      CategoryID: this.selectedCategory,
      Color: colorName
    };

    this.loadPacking(payload);

}


applyColorChange(i: number) {

  this.selectedColorIndex = i;

  const payload = {
    ArtNo: this.artSearch,
    CategoryID: this.selectedCategory,
    Color: this.colors[i].name
  };

  this.loadPacking(payload);
}

clearSizesOnly() {
  this.setSizes = [];
  this.semiSizes = [];
  this.caseSizes = [];
  this.cutSizes = [];
  this.activeCutRow = null;
}




selectTab(tab: string) {
  this.selectedTab = tab;
}


// selectUkSize(size: number) {
//   this.selectedUkSize = size;
// }

// increaseQty() {
//   this.quantity++;
// }

// decreaseQty() {
//   if (this.quantity > 1) {
//     this.quantity--;
//   }
// }

// validateQty() {
//   if (!this.quantity || this.quantity < 1) {
//     this.quantity = 1;
//   }
// }

get displayedSizes() {

  if (this.selectedTab === 'Set') {
    return this.setSizes || [];
  }

  if (this.selectedTab === 'Semi') {
    return this.semiSizes || [];
  }

  return this.caseSizes || [];
}

increaseRowQty(i: number) {
  this.displayedSizes[i].qty++;
  this.saveCurrentColorState();
}


blockInvalidKeys(event: KeyboardEvent) {
  const invalidKeys = ['e', 'E', '+', '-', '.'];
  if (invalidKeys.includes(event.key)) {
    event.preventDefault();
  }
}

validateRowQty(row: any) {

  // empty / null
  if (row.qty === null || row.qty === undefined || row.qty === '') {
    row.qty = 0;
    return;
  }

  // 🔑 force number + remove leading zeros
  row.qty = Number(row.qty);

  // NaN safety
  if (isNaN(row.qty)) {
    row.qty = 0;
    return;
  }

  // no decimals
  row.qty = Math.floor(row.qty);

  // no negatives
  if (row.qty < 0) {
    row.qty = 0;
  }

  // CUT SIZE RULE
  if (
    row.size.toLowerCase().includes('cut') &&
    row.qty > 0 &&
    !row.Combination
  ) {
    row.qty = 0;
    this.openCutPopup(row);
  }
  this.saveCurrentColorState();
}



decreaseRowQty(i: number) {
  if (this.displayedSizes[i].qty > 0) {
    this.displayedSizes[i].qty--;

    // If CUT row becomes zero → clear combination
    if (
      this.displayedSizes[i].qty === 0 &&
      this.displayedSizes[i].size.toLowerCase().includes('cut')
    ) {
      this.displayedSizes[i].Combination = '';
    }
  }
  this.saveCurrentColorState();
}


get totalQuantity() {
  return this.displayedSizes.reduce((a, b) => a + b.qty, 0);
}

handleCutPlus(row: any) {

  // If already has quantity → just increment
  if (row.qty > 0) {
    row.qty += 1;
    return;
  }

  // Otherwise open popup for first time
  this.openCutPopup(row);
}


openCutPopup(row: any) {

  this.selectedCutSizeLabel = row.size
    ?.split('-')
    .pop()
    ?.trim() || '';

  this.cutError = '';   // 👈 reset

  this.activeCutRow = row;

  let sizesArr: any[] = [];

  if (typeof row.sizes === 'string') {
    sizesArr = row.sizes.split(',').map((x: string) => x.trim());
  } else if (Array.isArray(row.sizes)) {
    sizesArr = row.sizes;
  }

  this.cutSizes = sizesArr.map(s => ({
    size: s,
    qty: 0
  }));

  this.showCutPopup = true;
}

closeCutPopup() {
  this.showCutPopup = false;
}

incCut(i: number) {
  this.cutSizes[i].qty++;
}

decCut(i: number) {
  if (this.cutSizes[i].qty > 0) {
    this.cutSizes[i].qty--;
  }
}

validateCutQty(item: any) {
  if (item.qty === null || item.qty === undefined || item.qty === '') {
    item.qty = 0;
    return;
  }

  item.qty = Math.floor(Number(item.qty));

  if (isNaN(item.qty) || item.qty < 0) {
    item.qty = 0;
  }

  const max = this.activeCutRow?.PairQty || 0;

  // prevent exceeding total
  if (this.totalCutQty > max) {
    item.qty -= (this.totalCutQty - max);
  }
}



get totalCutQty(): number {
  return this.cutSizes.reduce((sum, x) => sum + (Number(x.qty) || 0), 0);
}


saveCutSize() {

  const cutTotal = this.cutSizes.reduce((a, b) => a + b.qty, 0);
  const requiredQty = Number(this.activeCutRow?.PairQty || 0);

  if (cutTotal !== requiredQty) {
    this.cutError = `Total must be exactly ${requiredQty}`;
    return;
  }

  const comboArr: string[] = [];

  this.cutSizes.forEach(x => {
    if (x.qty > 0) {
      comboArr.push(`${x.size}*${x.qty}`);
    }
  });

  const combination = comboArr.join(', ');

  if (this.activeCutRow) {
    this.activeCutRow.qty += 1;
    this.activeCutRow.Combination = combination;
  }

  // 🔥🔥 THIS LINE WAS MISSING 🔥🔥
  this.saveCurrentColorState();

  this.closeCutPopup();
}


  
addToCart() {

  this.isSaving = true;

  if (!this.artSearch) {
    this.toastr.error('Please select Art');
    this.isSaving = false;
    return;
  }

  // 🔐 Save current color state before add
  this.saveCurrentColorState();

  const selectedCategoryObj = this.categories.find(
    x => x.ID === Number(this.selectedCategory)
  );

  const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

  const finalItemsToAdd: any[] = [];   // 👈 collect final data

  // 🔍 CHECK: is there ANY quantity in ANY color?
  const hasAnyQty = Object.keys(this.colorStateMap)
    .filter(k => k.startsWith(this.artSearch + '|'))
    .some(key => {
      const d = this.colorStateMap[key];
      return (
        d.setSizes.some(x => x.qty > 0) ||
        d.semiSizes.some(x => x.qty > 0) ||
        d.caseSizes.some(x => x.qty > 0)
      );
    });

  // ❌ NO QTY → STOP HERE
  if (!hasAnyQty) {
    this.toastr.error('Please add quantity');
    this.isSaving = false;
    return;
  }

  Object.keys(this.colorStateMap)
    .filter(k => k.startsWith(this.artSearch + '|'))
    .forEach(key => {

      const colorName = key.split('|')[1];
      const data = this.colorStateMap[key];

      const hasQty =
        data.setSizes.some(x => x.qty > 0) ||
        data.semiSizes.some(x => x.qty > 0) ||
        data.caseSizes.some(x => x.qty > 0);

      if (!hasQty) return;

      const cartItem = {
        artNo: this.artSearch,
        categoryName: selectedCategoryObj?.DESCRIPTION || '',
        catgoryID: Number(this.selectedCategory),
        color: colorName,
        articleImage: data.productImage,

        setSizes: data.setSizes
          .filter(x => x.qty > 0)
          .map(x => ({
            size: x.size,
            qty: x.qty,
            combination: x.Combination || '',   // ✅ explicitly log
            packingID: x.packingID
          })),

        semiSizes: data.semiSizes
          .filter(x => x.qty > 0)
          .map(x => ({
            size: x.size,
            qty: x.qty,
            ID: x.ID
          })),

        caseSizes: data.caseSizes
          .filter(x => x.qty > 0)
          .map(x => ({
            size: x.size,
            qty: x.qty,
            combination: x.Combination || '',   // ✅ explicitly log
            packingID: x.packingID
          }))
      };

      // 🔥 LOG EACH COLOR ITEM

      finalItemsToAdd.push(cartItem);
      cart.push(cartItem);
    });

  // 🔥 LOG ALL ITEMS TO BE ADDED

  sessionStorage.setItem('cart', JSON.stringify(cart));
  this.cartCount = cart.length;

  // this.toastr.success('Items added to cart');
  this.showSnackBar(
    'Items added to cart',
    'success'
  );

  // 🧹 clear everything
  this.colorStateMap = {};
  this.clearSelection();

  this.isSaving = false;
}



clearSelection() {

  // Category + Art
  // this.selectedCategory = '';
  this.artSearch = '';
  // this.artNos = [];
  this.filteredArtNos = [];
  this.productImage = '';

  // Colors
  this.colors = [];
  this.selectedColorIndex = -1;

  // Sizes
  this.semiSizes = [];
  this.caseSizes = [];
  this.setSizes = [];

  // Cut popup
  this.cutSizes = [];
  this.activeCutRow = null;
  this.showCutPopup = false;

  // Tab
  this.selectedTab = this.showSemiTab ? 'Set' : 'Case';

}

//detect unsaved data when click back button
hasUnsavedChanges(): boolean {
  const semi = this.semiSizes.some(x => x.qty > 0);
  const caseSizes = this.caseSizes.some(x => x.qty > 0);
  const setSizes = this.setSizes.some(x => x.qty > 0);

  return semi || caseSizes || setSizes;
}

cancelNavigation() {
  this.showUnsavedPopup = false;
  this.pendingAction = null;
  this.artSearch = this.previousArtNo;
  this.selectedCategory = this.previousSelectedCategory;
}

confirmNavigation() {

  this.showUnsavedPopup = false;

  if (this.pendingAction) {
    this.clearSizesOnly();
    this.pendingAction();
    this.pendingAction = null;
    return;
  }

  // If no pending action → normal back navigation
  this.router.navigate(['/home']);
}



handleChangeWithConfirmation(action: () => void) {

  if (this.hasUnsavedChanges()) {
    this.pendingAction = action;
    this.showUnsavedPopup = true;
    return;
  }

  action(); // no qty → execute immediately
}

onCategoryChange() {

  this.handleChangeWithConfirmation(() => {
    this.previousSelectedCategory = this.selectedCategory;
    this.performCategoryChange();
  });
}

performCategoryChange() {

  this.productImage = '';
  this.artSearch = '';
  this.filteredArtNos = [];
  this.colors = [];
  this.selectedColorIndex = -1;
  this.semiSizes = [];
  this.caseSizes = [];
  this.setSizes = [];
  this.cutSizes = [];
  this.activeCutRow = null;
  this.showCutPopup = false;
  this.selectedTab = this.showSemiTab ? 'Set' : 'Case';

  this.service.getArtNo(this.selectedCategory)
      .subscribe((res:any)=>{
        this.artNos = res;
      });

  setTimeout(() => {
    this.artInput?.nativeElement.focus();
  }, 0);
}

//hepers for colorartnokey
getColorKey(art: string, color: string): string {
  return `${art}|${color}`;
}

clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

//save current color state before saving 
saveCurrentColorState() {
  if (!this.artSearch || !this.selectedColor) return;

  const key = this.getColorKey(
    this.artSearch,
    this.selectedColor.name
  );

  this.colorStateMap[key] = {
    setSizes: this.clone(this.setSizes),
    semiSizes: this.clone(this.semiSizes),
    caseSizes: this.clone(this.caseSizes),
    productImage: this.productImage
  };
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
