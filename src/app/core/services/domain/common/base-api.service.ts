import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected basePath: string = '';
  protected httpClient: HttpClient = inject(HttpClient);
}
