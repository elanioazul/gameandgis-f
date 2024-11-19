import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { getValidatorErrorMessage } from "@core/utils/validators-utils";
@Component({
	selector: "app-error-form",
	templateUrl: "./error-form.component.html",
	styleUrls: ["./error-form.component.scss"],
})
export class ErrorFormComponent {
	@Input()
	control!: AbstractControl;

	constructor() {}

	get errorMessage() {
		for (const validatorName in this.control?.errors) {
			if (this.control.touched)
				return getValidatorErrorMessage(
					validatorName,
					this.control.errors[validatorName]
				);
		}
		return null;
	}
}
