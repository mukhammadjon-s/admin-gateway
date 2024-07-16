import { Observable } from 'rxjs';
import {
  UserAddressCommonDto,
  UserAddressCreateDto,
  UserAddressCreateResponseDto,
  UserAddressDeleteDto,
  UserAddressDeleteResponseDto,
  UserAddressGetAllDto,
  UserAddressGetAllResponseDto,
  UserAddressUpdateResponseDto,
} from './dto/user-address.dto';

export interface UserAddressControllerInterface {
  Create(data: UserAddressCreateDto): Observable<UserAddressCreateResponseDto>;
  Update(data: UserAddressCommonDto): Observable<UserAddressUpdateResponseDto>;
  Delete(data: UserAddressDeleteDto): Observable<UserAddressDeleteResponseDto>;
  GetAll(data: UserAddressGetAllDto): Observable<UserAddressGetAllResponseDto>;
}
