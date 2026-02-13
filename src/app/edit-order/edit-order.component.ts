import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HostListener} from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss'
})
export class EditOrderComponent {

  @ViewChild('artBox') artBox!: ElementRef;
    
  editIndex!: number;
  editItem: any;
  
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
  
  
  setSizes: any[] = [];
  semiSizes: any[] = [];
  caseSizes: any[] = [];

  selectedTab = 'Set';

  
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
  isSaving = false;
  selectedCutSizeLabel = '';
  
  showUnsavedPopup = false;
  pendingNavigation = false;
  
  
    constructor(private router: Router,
      private service:MyserviceService,
      private toastr: ToastrService,
      private route:ActivatedRoute
    ) {}
  
  
  ngOnInit() {

  this.loadCategories();   // 👈 ADD THIS

  this.editIndex = Number(this.route.snapshot.paramMap.get('index'));

  const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

  this.editItem = cart[this.editIndex];
  console.log(this.editItem,"editItem ")

  if (!this.editItem) {
    this.router.navigate(['/cart']);
    return;
  }

  this.patchItemToScreen();
}


  patchItemToScreen() {

  this.selectedCategory = this.editItem.catgoryID;
  this.artSearch = this.editItem.artNo;

  // Load colors first
  const payload = {
    ArtNo: this.artSearch,
    CategoryID: this.selectedCategory
  };

  this.service.getArtColor(payload).subscribe((res: any) => {

    if (res.IMAGE_NAME) {
          this.productImage = `https://mmarkonline.com/artimages/${res.IMAGE_NAME}`;
  } else {
          this.productImage = 'https://mmarkonline.com/artimages/NoImage.jpg';
   }

    this.colors = res.Colors.map((x: any) => ({
      name: x.Color,
      hex: this.getColorHex(x.Color)
    }));

    

    this.selectedColorIndex =
      this.colors.findIndex(c => c.name === this.editItem.color);

    this.loadPacking({
      ArtNo: this.artSearch,
      CategoryID: this.selectedCategory,
      Color: this.editItem.color
    }, () => {

      // ⭐ runs only after sizes loaded
      this.patchQuantities();
    });
  });
}

  patchQuantities() {

  // SET
  this.editItem.setSizes?.forEach((s: any) => {
    const row = this.setSizes.find(x => x.size === s.size);
    if (row) {
      row.qty = s.qty;
      row.Combination = s.combination || '';
    }
  });

  // SEMI
  this.editItem.semiSizes?.forEach((s: any) => {
    const row = this.semiSizes.find(x => x.size === s.size);
    if (row) row.qty = s.qty;
  });

  // CASE
  this.editItem.caseSizes?.forEach((c: any) => {
    const row = this.caseSizes.find(x => x.size === c.size);
    if (row) {
      row.qty = c.qty;
      row.Combination = c.combination || '';
    }
  });
}



  updateCart() {

  this.isSaving = true;

  const updatedItem = {
  ...this.editItem,

  setSizes: this.setSizes.filter(x => x.qty > 0),

  semiSizes: this.semiSizes.filter(x => x.qty > 0),

  caseSizes: this.caseSizes.filter(x => x.qty > 0),

  totalQty: this.totalQuantity
};

  const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

  cart[this.editIndex] = updatedItem;

  sessionStorage.setItem('cart', JSON.stringify(cart));

  this.toastr.success('Cart updated successfully');

  this.router.navigate(['/cart']);

  this.isSaving = false;
}


    goToCart() {
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
  
      // Colors
      this.colors = [];
      this.selectedColorIndex = -1;
  
      // Sizes
      this.semiSizes = [];
      this.caseSizes = [];
  
      // Cut popup
      this.cutSizes = [];
      this.activeCutRow = null;
      this.showCutPopup = false;
  
      // Tab
    this.selectedTab = this.showSemiTab ? 'Semi' : 'Case';
    
    this.service.getArtNo(this.selectedCategory).subscribe((res:any)=>{
      this.artNos = res;
    });
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
    
    this.artSearch = art;        // ⭐ bind to input
    this.filteredArtNos = [];
  
    this.selectedTab = this.showSemiTab ? 'Semi' : 'Case';
    this.semiSizes = [];
    this.caseSizes = [];
  
    const payload={
      ArtNo: art,
      CategoryID : this.selectedCategory,
    }
  
    this.service.getArtColor(payload).subscribe((res: any) => {
  
      if (res.flag === "1") {
  
        // Convert backend colors → UI colors
        this.colors = res.Colors.map((x: any) => ({
          name: x.Color,
          hex: this.getColorHex(x.Color)
        }));
  
        // Auto select first color
        this.selectedColorIndex = 0;
  
        // 2️⃣ Load Semi + Case using first color
        const itemPayload = {
          ArtNo: art,
          CategoryID: this.selectedCategory,
          Color: this.colors[0].name
        };
  
        this.loadPacking(itemPayload);
      }
    });
  }
  
  
    loadPacking(payload: any, callback?: () => void) {

  this.service.getArtNoDetails(payload).subscribe((res: any) => {

    if (res.flag === "1") {

      this.semiSizes = res.Semi.map((x: any) => ({
        size: x.Size,
        qty: 0,
        ID: x.ID
      }));

      this.caseSizes = res.Case.map((x: any) => ({
        size: x.Description,
        qty: 0,
        Combination: x.Combination,
        PairQty: x.PairQty,
        sizes: x.Sizes,
        packingID: x.PackingID
      }));

      this.setSizes = (res.Set || []).map((x: any) => ({
      size: x.Description,
      qty: 0,
      Combination: x.Combination,
      PairQty: x.PairQty,
      packingID: x.PackingID
    }));


      // ⭐ NOW SAFE TO PATCH
      callback?.();
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
  
    this.selectedColorIndex = i;
  
    const payload = {
      ArtNo: this.artSearch,
      CategoryID: this.selectedCategory,
      Color: this.colors[i].name
    };
  
    this.loadPacking(payload);
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
  
    // validation
    if (cutTotal !== requiredQty) {
      this.cutError = `Total must be exactly ${requiredQty}`;
      return;
    }
  
    this.cutError = '';
  
    // 1️⃣ Build combination string
    // Example: [{6,2},{7,1}] => "6,6,7"
    const comboArr: string[] = [];
  
    this.cutSizes.forEach(x => {
    if (x.qty > 0) {
      comboArr.push(`${x.size}*${x.qty}`);
      }
    });
  
    const combination = comboArr.join(', ');
  
    // 2️⃣ Write back to main Cut row
    if (this.activeCutRow) {
      this.activeCutRow.qty += 1;
      this.activeCutRow.Combination = combination;   // 👈 THIS LINE
    }
  
    this.closeCutPopup();
  }
  
    
  addToCart() {
  
    this.isSaving = true;
  
  
    const selectedCategoryObj = this.categories.find(
    x => x.ID === Number(this.selectedCategory)
  );
  
  const selectedSemi = this.semiSizes.filter(x => x.qty > 0);
  const selectedCase = this.caseSizes.filter(x => x.qty > 0);
  console.log(selectedCase,"selectedCase")
  
  if (!selectedSemi.length && !selectedCase.length) {
    this.toastr.error('Please add quantity');
    this.isSaving = false;
    return;
  }
  
  if (!this.selectedColor) {
    this.toastr.error('Please select color');
    this.isSaving = false;
    return;
  }
  
    const cartItem = {
      artNo: this.artSearch,
      categoryName: selectedCategoryObj?.DESCRIPTION || '',
      catgoryID : Number(this.selectedCategory),
      color: this.selectedColor?.name || '',
      totalQty: this.totalQuantity,
  
      semiSizes: selectedSemi.map(x => ({
        size: x.size,
        qty: x.qty,
        ID:x.ID
      })),
  
      caseSizes: selectedCase.map(x => ({
        size: x.size,
        qty: x.qty,
        combination: x.Combination || '',
        packingID:x.packingID
      }))
    };
  
    // Existing cart
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    sessionStorage.setItem('cart', JSON.stringify(cart));
  
    // ✅ Update cart count
    this.cartCount = cart.length;
  
    // ✅ Toast
    this.toastr.success('Item added to cart');
  
    // ✅ Clear current screen
    this.clearSelection();
    this.isSaving = false;
  }
  
  clearSelection() {
  
    // Category + Art
    this.selectedCategory = '';
    this.artSearch = '';
    this.artNos = [];
    this.filteredArtNos = [];
    this.productImage = '';
  
    // Colors
    this.colors = [];
    this.selectedColorIndex = -1;
  
    // Sizes
    this.semiSizes = [];
    this.caseSizes = [];
  
    // Cut popup
    this.cutSizes = [];
    this.activeCutRow = null;
    this.showCutPopup = false;
  
    // Tab
    this.selectedTab = this.showSemiTab ? 'Semi' : 'Case';
  
  }
  
  
  
  cancelNavigation() {
    this.showUnsavedPopup = false;
  }
  
  confirmNavigation() {
    this.showUnsavedPopup = false;
    this.router.navigate(['/home']);
  }
  
  
}
