import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from "@core/guards/iam/auth.guard";
const routes: Routes = [
  {
		path: "",
		redirectTo: "/signin",
		pathMatch: "full",
	},
  {
		path: "signup",
		loadChildren: () =>
			import("./pages/public/signup-page/signup-page.module").then(
				(m) => m.SignupPageModule
			),
	},
	{
		path: "signin",
		loadChildren: () =>
			import("./pages/public/signin-page/signin-page.module").then(
				(m) => m.SigninPageModule
			),
	},
	{
		path: "home",
		loadChildren: () =>
			import("./pages/private/home-page/home-page.module").then(
				(m) => m.HomePageModule
			),
    canActivate: [authGuard]
	},
  {
    path: 'pop-up',
    loadChildren: () => import('./shared/features/popup/popup.module').then(m => m.PopupModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
