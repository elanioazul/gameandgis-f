import {
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	inject,
} from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  router = inject(Router);
	registerForm!: FormGroup;
	fb: FormBuilder = inject(FormBuilder);

  @ViewChild("password") inputPass!: ElementRef<HTMLInputElement>;
	@ViewChild("confirmPassword") inputPassConfirm!: ElementRef<HTMLInputElement>;
	constructor() {
		this.registerForm = this.fb.group(
			{
				name: ["", Validators.required],
				surnames: ["", Validators.required],
				email: ["", [Validators.required, Validators.email]],
				password: [
					"",
					[
						Validators.required,
						Validators.minLength(8),
						Validators.maxLength(24),
						this.createPasswordStrengthValidator(),
					],
				],
				confirmPassword: ["", Validators.required],
			},
			{
				validator: this.createPasswordMatchValidator(
					"password",
					"confirmPassword"
				),
			}
		);
	}

	ngOnInit(): void {
		this.registerForm.statusChanges
			.pipe(filter((val) => val === "VALID"))
			.subscribe((val) => {
				this.inputPass.nativeElement.style.backgroundColor = "#eee";
				this.inputPassConfirm.nativeElement.style.backgroundColor = "#eee";
			});
	}

	get password() {
		return this.registerForm.controls["password"];
	}

	get confirmPassword() {
		return this.registerForm.controls["confirmPassword"];
	}

	createPasswordStrengthValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			if (!value) {
				return null;
			}
			const hasUpperCase = /[A-Z]+/.test(value);
			const hasLowerCase = /[a-z]+/.test(value);
			const hasNumeric = /[0-9]+/.test(value);

			const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

			return !passwordValid ? { passwordStrength: true } : null;
		};
	}

	createPasswordMatchValidator = (
		password: string,
		confirmPassword: string
	): ValidatorFn => {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const passwordControl = control.get(password);
			const confirmPasswordControl = control.get(confirmPassword);

			if (!passwordControl || !confirmPasswordControl) {
				return null;
			}

			if (
				confirmPasswordControl.errors &&
				!confirmPasswordControl.errors["passwordMismatch"]
			) {
				return null;
			}

			if (passwordControl.value !== confirmPasswordControl.value) {
				confirmPasswordControl.setErrors({ passwordMismatch: true });
				return { passwordMismatch: true };
			} else {
				confirmPasswordControl.setErrors(null);
				return null;
			}
		};
	};

  goSignin(): void {
    this.router.navigate(['/signin'])
  }
}
