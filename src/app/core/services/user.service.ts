import { inject, Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './domain/common/base-api.service';
import { IReadUserProfile } from 'src/app/features/home/interfaces/user-profile.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {
  private sessionStorageService = inject(SessionStorageService);


  getUserData(): Observable<IReadUserProfile> {
    const currentUserData = this.sessionStorageService.getData('current-user') as any;
    const currentUser = JSON.parse(currentUserData);


    return this.httpClient.request<IReadUserProfile>('get', environment.apiDomain + `` + `${environment.iam.userDetail}` + '/' + `${currentUser.userDetails.id}`)

  }

  saveUserData(formData: FormData) {
    const currentUserData = this.sessionStorageService.getData('current-user') as any;
    const currentUser = JSON.parse(currentUserData);
    return this.httpClient.request('put', environment.apiDomain + `` + `${environment.iam.userDetail}` + '/' + `${currentUser.userDetails.id}`, {
      body: formData,
      reportProgress: true,
      observe: 'events',
    })
  }
}
