import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PhimAnh } from '../models/phim-anh';

@Injectable({
  providedIn: 'root',
})
export class PhimAnhService {
  private phimAnhUrl = `${environment.apiUrl}/phimanh`;
  constructor(private _http: HttpClient) {}

  gets(maDTQS: string): Observable<PhimAnh[]> {
    return this._http.get<any>(`${this.phimAnhUrl}?maDTQS=${maDTQS}`).pipe(
      map((result) => {
        let phimAnhs: PhimAnh[] = [];
        for (let index = 0; index < result.phimAnhs.length; index++) {
          phimAnhs.push(new PhimAnh(result.phimAnhs[index]));
        }
        return phimAnhs;
      })
    );
  }
}
