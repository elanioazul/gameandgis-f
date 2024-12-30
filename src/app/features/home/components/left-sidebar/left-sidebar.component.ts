import { Component, inject, input, OnInit, output, Signal } from '@angular/core';
import {ActivatedRoute, Router, RouterModule } from "@angular/router"
import { AuthService } from '@core/services/infrastructure/iam/auth.service';
import { SessionStorageService } from '@core/services/session-storage.service';
import {
	faUser,
	faArrowRightFromBracket,
	faBars,
  faWarehouse,
	faHouse,
	faCommentDots,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss'
})
export class LeftSidebarComponent implements OnInit {
  authService = inject(AuthService);
  sessionStorageService = inject(SessionStorageService);
  router = inject(Router);
  faArrowRightFromBracket = faArrowRightFromBracket;
	faBars = faBars;
	faHouse = faHouse;
  faWarehouse = faWarehouse;
  faCommentDots = faCommentDots;
	faUser = faUser;
  faMagnifyingGlass = faMagnifyingGlass;

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
  ];

  recognizedUser = false;

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getCurrentUserName();
  }

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

	logout(): void {
		this.authService.logout();
    this.recognizedUser = false;
		this.router.navigate(["/signin"]);
	}

  public getCurrentUserName(): string | null {
    const currentUserData = this.sessionStorageService.getData('current-user');
    if (currentUserData) {
        try {
            const currentUser = JSON.parse(currentUserData);
            this.recognizedUser = true;
            return currentUser.userDetails.name;
        } catch (e) {
            console.error('Error parsing current user data from session storage', e);
            return null;
        }
    }
    return null;
}
}
