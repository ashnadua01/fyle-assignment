import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private cache: { [searchText: string]: any } = {};

  constructor(private apiService: ApiService) { }

  searchList(searchText: string): Observable<any> {
    if (this.cache[searchText]) {
      return of(this.cache[searchText]);
    }

    return this.apiService.get(`/search.json?q=${searchText}`).pipe(
      tap((response: any) => {
        this.cache[searchText] = response;
      })
    );
  }
}
