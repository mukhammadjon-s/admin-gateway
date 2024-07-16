import { Observable } from 'rxjs';
import { District } from '../dto/district.dto';

export interface DistrictControllerInterface {
  getAll(data: any): Observable<{ data: District[] }>;
  create(data: any): Observable<District>;
  update(data: any): Observable<District>;
  delete(data: any): Observable<{ success: boolean }>;
}
