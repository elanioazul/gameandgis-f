import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpParams, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { catchError, EMPTY, finalize, map, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SessionStorageService } from '@core/services/session-storage.service';
import { IReadAvatar, IReadUserProfile } from '../../interfaces/user-profile.interface';

type UserProfileForm = Pick<IReadUserProfile, 'name' | 'surnameOne' | 'surnameTwo' | 'email'> & { avatar: string | Blob };

export interface ValidationErrorResponse {
  message: string;
  errors: {
    field: string;
    message: string;
    code: string;
  }[]
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private httpClient: HttpClient = inject(HttpClient);
  private messageService = inject(MessageService);
  private sessionStorageService = inject(SessionStorageService);

  protected form = inject(FormBuilder).group({
    name: new FormControl('', [Validators.required]),
    surnameOne: new FormControl('', [Validators.required]),
    surnameTwo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    avatar: new FormControl<string|Blob>('')
  });

  private userData: IReadUserProfile | null = null;

  @ViewChild('fileInput')
  protected fileInput!: ElementRef<HTMLInputElement>;

  protected isLoadRequestInProgress = false;
  protected hasLoadingError = false;
  protected isSaveRequestInProgress = false;

  protected uploadProgress: number = 0;

  protected get isSaveButtonDisabled() {
    return !this.form.valid || this.isFormPristine || this.isSaveRequestInProgress;
  }

  protected get isResetButtonDisabled() {
    return this.isFormPristine || this.isSaveRequestInProgress;
  }

  /**
   * Checks if the form value reflects the last value received from the backend
   */
  private get isFormPristine(): boolean {
    if (!this.userData || !this.form.value) {
      console.log('eeeee');

      return false;
    }

    console.log('continuo');

    const formValue = this.form.value;
    const userDataSubset: Partial<IReadUserProfile> = {};

    // for (const key in formValue) {
    //   if (formValue.hasOwnProperty(key) && this.userData.hasOwnProperty(key)) {
    //     (userDataSubset[key as keyof IReadUserProfile] as any) = this.userData[key as keyof IReadUserProfile];
    //   }
    // }
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && this.userData.hasOwnProperty(key)) {
        if (key === 'avatar') {
          // Transform the avatar property to a compatible type
          const avatar = this.userData[key as keyof IReadUserProfile] as IReadAvatar;
          userDataSubset[key as keyof IReadUserProfile] = avatar.path as any;
        } else {
          (userDataSubset[key as keyof IReadUserProfile] as any) = this.userData[key as keyof IReadUserProfile];
        }
      }
    }

    return this.isEqual(formValue, userDataSubset);
  }

  /**
   * Deep equality check for two objects
   */
  private isEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key) || !this.isEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  constructor() {}

  ngOnInit() {
    this.loadUserData();
  }

  protected loadUserData() {
    // set the loading flag when the request is initiated
    this.isLoadRequestInProgress = true;

    this.getUserData$()
      .pipe(
        finalize(() => {
          // clear the loading flag when the request completes
          this.isLoadRequestInProgress = false;
        }),
        catchError((error: HttpErrorResponse) => {
          // set the loading error flag
          this.hasLoadingError = true;

          return EMPTY;
        })
      )
      .subscribe(userData => {
        // clear the loading error flag
        this.hasLoadingError = false;

        // store the user data
        this.userData = userData

        // display the user data in the form
        this.updateForm(userData);
      })
  }

  private getUserData$() {
    const currentUserData = this.sessionStorageService.getData('current-user') as any;
    const currentUser = JSON.parse(currentUserData);


    return this.httpClient.request<IReadUserProfile>('get', environment.apiDomain + `` + `${environment.iam.userDetail}` + '/' + `${currentUser.userDetails.id}`)

  }

  private updateForm(userData: IReadUserProfile) {
    // Extract the keys from the form value
    const formValueKeys = Object.keys(this.form.value);

    // Create a subset of userData containing only the keys present in form.value
    const userDataSubset: Partial<IReadUserProfile> = {};

    // Iterate over the keys and assign the corresponding values from userData to userDataSubset
    for (const key of formValueKeys) {
      if (userData.hasOwnProperty(key)) {
        if (key === 'avatar') {
          // Transform the avatar property to a compatible type
          const avatar = userData[key as keyof IReadUserProfile] as IReadAvatar;
          userDataSubset[key as keyof IReadUserProfile] = avatar.path as any;
        } else {
          (userDataSubset[key as keyof IReadUserProfile] as any) = userData[key as keyof IReadUserProfile];
        }
      }
    }

    // Reset the form with the subset of userData
    this.form.reset(userDataSubset as unknown as UserProfileForm);
  }

  protected saveUserData() {
    // set the saving flag
    this.isSaveRequestInProgress = true;

    this.saveUserData$()
      .pipe(
        finalize(() => {
          // clear the saving flag
          this.isSaveRequestInProgress = false;

          // reset the progress
          this.uploadProgress = 0;
        }),
        catchError(error => {
          // handle server-side validation errors
          if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.BadRequest) {
            this.setFormErrors(error.error)

            return EMPTY;
          }

          // display a notification when other errors occur
          this.showError()

          // if there is another type of error, throw it again.
          throw error;
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = event.total ?
            Math.round(100 * event.loaded / event.total) :
            100;
        }
        else if (event.type === HttpEventType.Response) {
          // store the user data
          this.userData = event.body!.data

          // update the form with the values received from the server
          this.restoreForm();

          // display a success notification
          this.showSuccess()
        }
      })
  }

  private saveUserData$() {
    const currentUserData = this.sessionStorageService.getData('current-user') as any;
    const currentUser = JSON.parse(currentUserData);
    return this.httpClient.request('put', environment.apiDomain + `` + `${environment.iam.userDetail}` + '/' + `${currentUser.userDetails.id}`, {
      body: this.getFormData(),
      reportProgress: true,
      observe: 'events',
    })
  }

  private setFormErrors(errorResponse: ValidationErrorResponse | null | undefined) {
    if (!errorResponse || !errorResponse.errors) {
      this.form.setErrors(null);
      return;
    }

    errorResponse.errors.forEach(error => {
      this.form.get(error.field)?.setErrors({
        [error.code]: error.message
      })
    })
  }

  protected restoreForm() {
    this.userData && this.updateForm(this.userData);

    // reset the selected image, if any
    this.fileInput.nativeElement.value = '';
  }

  protected onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.form.controls.avatar.setValue(URL.createObjectURL(file));
    }
  }

  private getFormData() {
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([fieldName, value]) => {
      if (fieldName === 'avatar') {
        value = this.fileInput.nativeElement.files?.[0] || value;
      }

      formData.append(fieldName, value as string | Blob);
    })

    return formData;
  }

  protected getAvatarFullUrl() {
    if (typeof this.form.controls.avatar.value === 'string'
      && this.form.controls.avatar.value
      && !this.form.controls.avatar.value.startsWith('blob:http')) {
      return `${environment.apiDomain}` + this.form.controls.avatar.value;
    }

    return this.form.controls.avatar.value || '/assets/avatar-placeholder.jpg';
  }

  private showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'The profile was successfully saved' });
  }
  private showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error has occurred. Please try again later.' });
}
}
