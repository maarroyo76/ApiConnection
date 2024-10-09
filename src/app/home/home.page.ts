import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  posts: any[] = [];

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.apiService.getData().subscribe((data: any) => {
      this.posts = data;
      console.log('Datos cargados:', this.posts);
    }, (error) => {
      console.error('Error al cargar los datos:', error);
    }
  );
  }
}