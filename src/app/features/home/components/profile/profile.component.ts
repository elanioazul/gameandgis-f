import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { catchError, EMPTY, finalize, map, tap } from 'rxjs';
import { Message } from 'primeng/api';
import { IReadAvatar, IReadUserProfile } from '../../interfaces/user-profile.interface';
import { UtilsJS } from 'src/app/core/utils/js-utils';
import { UserService } from '@core/services/user.service';
type UserProfileForm = Pick<IReadUserProfile, 'name' | 'surnameOne' | 'surnameTwo' | 'email'> & { avatar: string | Blob };

// export interface ValidationErrorResponse {
//   message: string;
//   errors: {
//     field: string;
//     message: string;
//     code: string;
//   }[]
// }
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private userService = inject(UserService);

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

  messages!: Message[];

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
      return false;
    }

    const formValue = this.form.value;
    const userDataSubset: Partial<IReadUserProfile> = {};

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

    return UtilsJS.isEqual(formValue, userDataSubset);
  }

  constructor() {}

  ngOnInit() {
    this.loadUserData();
  }

  protected loadUserData() {
    // set the loading flag when the request is initiated
    this.isLoadRequestInProgress = true;

    this.userService.getUserData()
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

    this.disableForm();

    const formData = this.generateFormData();

    this.userService.saveUserData(formData)
      .pipe(
        finalize(() => {
          // clear the saving flag
          this.isSaveRequestInProgress = false;

          this.enableForm();

          // reset the progress
          this.uploadProgress = 0;
        }),
        catchError(error => {
          // handle server-side validation errors
          if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.BadRequest) {
            //this.setFormErrors(error.error)

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

  /**
   * Generates a FormData object from the given form values.
   *
   * @returns The FormData object ready to be sent in an HTTP request.
   */
  private generateFormData(): FormData {
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
      return `${environment.apiDomain}` + '/' + this.form.controls.avatar.value;
    }

    return this.form.controls.avatar.value || '/assets/avatar-placeholder.jpg';
  }

  private showSuccess() {
    this.messages = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }]
  }

  private showError() {
    this.messages = [{ severity: 'error', summary: 'Error', detail: 'An unexpected error has occurred. Please try again later.' }]
  }

  private disableForm() {
    Object.values(this.form.controls).forEach(control => {
      control.disable()
    })
  }

  private enableForm() {
    Object.values(this.form.controls).forEach(control => {
      control.enable()
    })
  }
}
