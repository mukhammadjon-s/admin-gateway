import { Observable } from 'rxjs';
import { Region } from '../dto/region.dto';

export interface RegionControllerInterface {
  getAll(data: any): Observable<{ data: Region[] }>;
  create(data: any): Observable<Region>;
  update(data: any): Observable<Region>;
  delete(data: any): Observable<{ success: boolean }>;
}
