import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
	@Input() type!: string;
	@Input() inputText!: string;
  @Input() label!: string;
  @Input() loading!: boolean;
	@Input() isDisabled!: boolean;

  //auth0 dashboard
	@Input() variant: "text" | "solid" | "outline" = "solid";
	@Input() customClass = "";
	@Input() enabled = true;

	@Output() buttonClick = new EventEmitter<void>();

	onButtonClick(): void {
		this.buttonClick.emit();
	}
}
