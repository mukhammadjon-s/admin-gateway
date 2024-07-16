import { Observable } from 'rxjs/internal/Observable';

export interface ProductControllerInterface {
  GetAll(data: any, metadata?: any): Observable<any>;
  GetOne(data: any, metadata?: any): Observable<any>;
  Create(data: any, metadata?: any): Observable<any>;
  Delete(data: any, metadata?: any): Observable<any>;
  Update(data: any, metadata?: any): Observable<any>;
  UploadExcel(data: any, metadata?: any): Observable<any>;
}
