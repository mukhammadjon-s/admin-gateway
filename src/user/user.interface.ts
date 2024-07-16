import { Observable } from 'rxjs';

export interface UsersControllerInterface {
  GetAll(data?: any): Observable<any>;

  GetUsersList(data?: any): Observable<any>;

  DeleteUser(data?: any): Observable<any>;

  UpdateUserAdmin(data?: any): Observable<any>;

  Login(data: any): Observable<any>;

  ForgetPassword(data: any): Observable<any>;

  VerifyTheNumber(data: any): Observable<any>;

  ChangePassword(data: any): Observable<any>;

  LogoutUser(data: any): Observable<any>;

  AddPassword(data: any): Observable<any>;

  RefreshTokens(data: any): Observable<any>;

  GetUserById(data: any): Observable<any>;

  GetUserByMsisdn(data: any): Observable<any>;

  AssignRole(data: any): Observable<any>;

  GetRoles(): Observable<any>;

  UpdateStatus(data: any): Observable<any>;

  LoginWithPassword(data: any): Observable<any>;

  Register(data: any): Observable<any>;
}

export interface ClientControllerInterface {
  list(data?: any): Observable<any>;
}
