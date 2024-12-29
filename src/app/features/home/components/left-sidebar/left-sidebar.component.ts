import { Component, inject, input, output, Signal } from '@angular/core';
import {ActivatedRoute, Router, RouterModule } from "@angular/router"
import { AuthService } from '@core/services/infrastructure/iam/auth.service';
import {
	faUser,
	faArrowRightFromBracket,
	faBars,
  faWarehouse,
	faHouse,
	faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss'
})
export class LeftSidebarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  faArrowRightFromBracket = faArrowRightFromBracket;
	faBars = faBars;
	faHouse = faHouse;
  faWarehouse = faWarehouse;
  faCommentDots = faCommentDots;
	faUser = faUser;

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: 'dashboard',
      icon: faHouse,
      label: 'Dashboard',
    },
    {
      routeLink: 'hunting-areas',
      icon: faWarehouse,
      label: 'Cotos',
    },
    {
      routeLink: 'chat',
      icon: faCommentDots,
      label: 'Chats',
    },
    {
      routeLink: 'profile',
      icon: faUser,
      label: 'Perfil',
    },
  ];

  recognizedUser = true;

  constructor(public route: ActivatedRoute) {}

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

	logout(): void {
		this.authService.logout();
		this.router.navigate(["/signin"]);
	}
}
