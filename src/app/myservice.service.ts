import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyserviceService {
  //  private baseUrl = 'http://coreapi.mmarkonline.com/api/';

  // private baseUrl = 'https://localhost:44306/api/';
  // private baseUrl = 'http://costrxapi.diligenzit.com/api/';

  private baseUrl = 'https://mobileapi.mmarkonline.com/api/';


  constructor(private http: HttpClient) {}

  // ✅ Example GET request to your C# API
  Login(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}Login/login`, payload);
  }

  logout(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}Login/logout`, payload);
  }

  get_DropDown_Data(item:any){
    const payload = item;
    return this.http.post(`${this.baseUrl}DropDown`, payload);
  }

  getArtNo(categoryId: string) {
  return this.http.post(`${this.baseUrl}NewOrder/GetArtNo`, {
    CategoryID: categoryId
  });
}

  getArtNoDetails(payload: any) {
  return this.http.post(`${this.baseUrl}NewOrder/GetArtNoDetails`, payload);
}

  getArtColor(payload :any){
    return this.http.post(`${this.baseUrl}NewOrder/GetArtColor`, payload);
  }

  saveNewOrder(payload :any){
    return this.http.post(`${this.baseUrl}NewOrder/SaveNewOrder`, payload);
  }

  getOrderList(payload:any) {
  return this.http.post(
    `${this.baseUrl}NewOrder/GetOrderList`,
    payload
  );
}
  viewOrder(payload:any) {
  return this.http.post(
    `${this.baseUrl}NewOrder/ViewOrders`,
    payload
  );
}

  //============================Article Inventory==========================

  get_Category_DropDown() {
    return this.http.post(`${this.baseUrl}ArticleInventory/getcategory`, {});
  }
  get_Artno_DropDown(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}ArticleInventory/getartno`, payload);
  }
  get_Color_DropDown(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}ArticleInventory/getcolor`, payload);
  }
  get_Size_DropDown(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}ArticleInventory/getsize`, payload);
  }

  get_Article_bardcode(item: any) {
    const payload = item;
    return this.http.post(
      `${this.baseUrl}ArticleInventory/getarticle`,
      payload
    );
  }

  Inset_Article_Inventory(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}ArticleInventory/insert`, payload);
  }

  get_Article_inventory_list() {
    return this.http.post(`${this.baseUrl}ArticleInventory/list`, {});
  }

  select_Article_inventory(id: any) {
    return this.http.post(`${this.baseUrl}ArticleInventory/select/${id}`, {});
  }

  update_Article_inventory(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}ArticleInventory/update`, payload);
  }

  Commit_Article_Inventory(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}ArticleInventory/commit`, payload);
  }
  //=================delete article inventrory==============================

  delete_Article_inventroy(id: any) {
    return this.http.post(`${this.baseUrl}ArticleInventory/delete/${id}`, {});
  }

  //============================Carton Inventory==========================

    get_getavailable_bardcode(item: any) {
    const payload = item;
    return this.http.post(
      `${this.baseUrl}CartonInventory/getavailable`,
      payload
    );
  }


  //=================insert carton inventrory==============================
    Inset_Carton_Inventory(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}CartonInventory/insert`, payload);
  }
  //=================get carton inventrory list==============================
    get_Carton_inventory_list() {
    return this.http.post(`${this.baseUrl}CartonInventory/list`, {});
  }

  //=================select carton inventrory==============================
  
  select_Carton_inventory(id: any) {
    return this.http.post(`${this.baseUrl}CartonInventory/select/${id}`, {});
  }

    Commit_carton_Inventory(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}CartonInventory/commit`, payload);
  }

  //===================update carton inventory==========================
    update_Carton_inventory(item: any) {
    const payload = item;
    return this.http.post(`${this.baseUrl}CartonInventory/update`, payload);
  }

//=================delete carton inventrory==============================

  delete_Carton_inventory(id: any) {
    return this.http.post(`${this.baseUrl}CartonInventory/delete/${id}`, {});
  }

  
}
