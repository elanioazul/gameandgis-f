import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { IUser } from '@core/interfaces/iam/user.interface';
import { SessionStorageService } from '../../session-storage.service';
import { Observable, Subject } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseApiService } from '@core/services/domain/common/base-api.service';
import { environment } from 'src/environments/environment';
import { IReadUser } from '@core/interfaces/iam/user-read.interface';

const CURRENTUSER = "current-user";
const ACCESS_TOKEN = 'auth-user';

export interface AuthState {
	user: IReadUser | null;
	isLoggedIn: boolean;
	error: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {

  sessionStorageService = inject(SessionStorageService);

	//state
	private state = signal<AuthState>({
		user: null,
		isLoggedIn: false,
		error: null,
	});

	//selectors
	user = computed(() => this.state().user);
	isLoggedIn = computed(() => this.state().isLoggedIn);
	isLoggedOut= computed(() => !this.state().isLoggedIn);

	//sources
	setUserCredentials$ = new Subject<IReadUser>();
	errorGettingUserCredentials$ = new Subject<string>();
	logOut$ = new Subject<null>();

	constructor() {
    super();
		this.setUserCredentials$.pipe(takeUntilDestroyed()).subscribe({
			next: (credentials: IReadUser) =>
				this.state.update((state) => ({
					...state,
					user: credentials,
					isLoggedIn: true,
					error: null,
				})),
		});

		this.errorGettingUserCredentials$
			.pipe(takeUntilDestroyed())
			.subscribe((error) =>
				this.state.update((state) => ({
					...state,
					user: null,
					isLoggedIn: false,
					error: error,
				}))
			);

		this.logOut$.pipe(takeUntilDestroyed()).subscribe({
			next: (credentials: null) =>
				this.state.update((state) => ({
					...state,
					user: credentials,
					isLoggedIn: false,
					error: null,
				})),
		});

		//efects
		effect(() => {
			if (this.isLoggedIn()) {
				this.sessionStorageService.saveData(
					CURRENTUSER,
					JSON.stringify(this.user())
				);
				this.sessionStorageService.saveData(
					ACCESS_TOKEN,
					JSON.stringify(this.user()?.accessToken)
				);
			}
			if (this.isLoggedOut()) {
				this.sessionStorageService.removeData(
					CURRENTUSER
				);
				this.sessionStorageService.removeData(
					ACCESS_TOKEN
				);
			}
		});
	}

  login(user: IUser): Observable<any> {
    return this.httpClient.request<IReadUser>('post', environment.apiDomain + `${this.basePath}` + `${environment.iam.signIn}`, {
      body: user
    })
  }

	logout(): void {
		this.logOut$.next(null);
	}
}
