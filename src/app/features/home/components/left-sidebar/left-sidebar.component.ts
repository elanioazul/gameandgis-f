import { Component, input, output } from '@angular/core';
import {
	faUser,
	faWindowClose,
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

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
