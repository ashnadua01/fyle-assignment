import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SubjectsService } from '../../core/services/subjects.service';
import { Book } from 'src/app/core/models/book-response.model';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'front-end-internship-assignment-trending-subjects',
  templateUrl: './trending-subjects.component.html',
  styleUrls: ['./trending-subjects.component.scss'],
})
export class TrendingSubjectsComponent implements OnInit {
  isLoading: boolean = true;
  subjectName: string = '';
  allBooks: Book[] = [];
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService
  ) {}

  getAllBooks() {
    this.subjectsService
      .getAllBooks(this.subjectName)
      .pipe(
        catchError((error: any) => {
          this.errorMessage = 'An error occurred while fetching books.';
          return throwError(error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data) => {
        this.allBooks = data?.works;
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectName = params.get('name') || '';
      this.isLoading = true;
      this.errorMessage = '';
      this.getAllBooks();
    });
  }
}
