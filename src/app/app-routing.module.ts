import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
