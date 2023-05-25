import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from 'src/app/core/services/search.service';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  searchResults: any[] = [];
  isLoading: boolean = false;

  constructor(
    private searchService: SearchService,
    private elementRef: ElementRef
  ) {
    this.bookSearch = new FormControl('');
  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  private searchSubscription: Subscription | undefined;

  ngOnInit(): void {
    const inputElement = this.elementRef.nativeElement.querySelector(
      '#searchInput'
    );

    fromEvent<KeyboardEvent>(inputElement, 'keyup')
      .pipe(
        filter((event: KeyboardEvent) => event.keyCode === 13)
      )
      .subscribe(() => {
        this.search(this.bookSearch.value);
      });
  }

  search(value: string): void {
    if (value.trim().length === 0) {
      this.clearSearch();
      return;
    }

    this.isLoading = true;
    this.searchResults = [];

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    this.searchSubscription = this.searchService.searchList(value).subscribe(
      (resp: any) => {
        this.searchResults = resp.docs;
        console.log('searchResults', this.searchResults);
        this.isLoading = false;
      },
      (error: any) => {
        console.error('API error:', error);
        this.isLoading = false;
      }
    );
  }

  clearSearch(): void {
    this.bookSearch.setValue('');
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.isLoading = false;
  }
}
