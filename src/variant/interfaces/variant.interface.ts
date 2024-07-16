import { Observable } from 'rxjs/internal/Observable';

// TODO: We should avoid to use 'any' types
export interface VariantInterface {
  GetVariantGroupByProductId(data: any, metadata?: any): Observable<any>;
  GetVariantGroups(data: { productId: string }): Observable<any>;
  SetVariantGroupImages(data: {
    groupId: string;
    photos: string[];
    sku: string;
  }): Observable<any>;
  GetVariantGroup(data: any, metadata?: any): Observable<any>;
  AddImage(data: any, metadata?: any): Observable<any>;
  UpdateImage(data: any, metadata?: any): Observable<any>;
  RemoveImage(data: any, metadata?: any): Observable<any>;
  GetAll(data: any, metadata?: any): Observable<any>;
  GetAllVariants(data: any, metadata?: any): Observable<any>;
  GetProductVariant(data: any, metadata?: any): Observable<any>;
  GetOne(data: any, metadata?: any): Observable<any>;
  GetProductByVariantId(data: any, metadata?: any): Observable<any>;
  AddNew(data: any, metadata?: any): Observable<any>;
  VariantAdd(data: any, metadata?: any): Observable<any>;
  Delete(data: any, metadata?: any): Observable<any>;
  Update(data: any, metadata?: any): Observable<any>;
  GetCategories(data: any, metadata?: any): Observable<any>;
  GetTreeCategory(data?: any, metadata?: any): Observable<any>;
  SetDiscountPercentageForVariant(data?: any, metadata?: any): Observable<any>;
  SetDiscountPercentageForVariantGroup(data?: any, metadata?: any): Observable<any>;
  GetValueByImportId(data?: any, metadata?: any): Observable<any>;
  UpdateQuantity(data?: any, metadata?: any): Observable<any>;
  PublishVariantGroup(data?: any, metadata?: any): Observable<any>;
  UnpublishedGroups(data?: any, metadata?: any): Observable<any>;
  Publish(data?: any, metadata?: any): Observable<any>;
  SyncAllVariantGroup(data?: any, metadata?: any): Observable<any>;
}
