import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const getValidatorErrorMessage = (
	validatorName: string,
	validatorErrors?: ValidationErrors
): string | undefined => {
	let args = messages
		.get(validatorName)
		?.validatorErrorsKey?.map((name) => validatorErrors?.[name]);
	return args
		? stringFormat(messages.get(validatorName)?.message, ...args)
		: messages.get(validatorName)?.message;
};

const messages = new Map<
	string,
	{ message: string; validatorErrorsKey?: string[] }
>([
	["required", { message: "Este campo es requerido" }],
	[
		"minlength",
		{
			message: "Son requeridos al menos {0} carácteres",
			validatorErrorsKey: ["requiredLength"],
		},
	],
	[
		"maxlength",
		{
			message: "El máximo número de carácteres a introducir es de {0}",
			validatorErrorsKey: ["requiredLength"],
		},
	],
	["email", { message: "Dirección de email incorrecta" }],
	[
		"passwordStrength",
		{
			message: "Debe tener un número, minúsculas y al menos una mayúscula",
			validatorErrorsKey: ["passwordStrength"],
		},
	],
	[
		"passwordMismatch",
		{
			message: "Las contraseñas no coinciden",
			validatorErrorsKey: ["passwordMismatch"],
		},
	],
]);

function stringFormat(template: string | undefined, ...args: any[]) {
	if (template) {
		return template.replace(/{(\d+)}/g, (match, index) => {
			return typeof args[index] !== "undefined" ? args[index] : match;
		});
	}
	return undefined;
}
