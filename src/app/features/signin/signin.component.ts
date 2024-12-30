import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReadUser } from '@core/interfaces/iam/user-read.interface';
import { IUser } from '@core/interfaces/iam/user.interface';
import { AuthService } from '@core/services/infrastructure/iam/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
	authService = inject(AuthService);
	router = inject(Router);

	recognizedUser = computed(() => this.authService.isLoggedIn());

  loginForm!: FormGroup;
	fb: FormBuilder = inject(FormBuilder);

  constructor() {
		this.loginForm = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(8)]],
		});
	}

	onSumbmit(): void {
		const user: IUser = {
			email: this.loginForm.get("email")?.value,
			password: this.loginForm.get("password")?.value
		};
		this.authService.login(user)
      .subscribe({
        next: (user: IReadUser) => {
          this.authService.setUserCredentials$.next(user);
          this.router.navigate(['/home/dashboard'])
        },
          error: (err: { error: { message: string; }; }) => {
            //this.errorMessage = err.error.message;
            this.authService.errorGettingUserCredentials$.next("not recognized user");
          }
      });
	}

  goToSignUp(): void {
    this.router.navigate(['/signup'])
  }
}
