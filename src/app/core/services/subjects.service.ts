import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BookResponse } from 'src/app/core/models/book-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private cache: { [subjectName: string]: Observable<BookResponse> } = {};

  constructor(private apiService: ApiService) { }

  getAllBooks(subjectName: string): Observable<BookResponse> {
    const limit = 10;

    if (this.cache[subjectName]) {
      return this.cache[subjectName];
    }

    const request$ = this.apiService.get(`/subjects/${subjectName.toLowerCase().split(' ').join('_')}.json?limit=${limit}`).pipe(
      tap((response: any) => {
        this.cache[subjectName] = of(response);
      })
    );

    this.cache[subjectName] = request$;
    return request$;
  }
}
