import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(
    private http: HttpClient
  ) { }

  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updatePost(id: number, post: any) {
    return this.http.put(`https://jsonplaceholder.typicode.com/posts/${id}`, post);
  }
}
