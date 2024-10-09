import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchId: number | null = null;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.apiService.getData().subscribe((data: any) => {
      this.posts = data;
      this.filteredPosts = data;
      console.log('Datos cargados:', this.posts);
    }, (error) => {
      console.error('Error al cargar los datos:', error);
    });
  }

  searchPost() {
    if (this.searchId !== null) {
      this.filteredPosts = this.posts.filter(post => post.id === this.searchId);
      console.log('Datos filtrados:', this.filteredPosts);
    } else {
      this.filteredPosts = this.posts;
    }
  }

  clearSearch() {
    this.searchId = null;
    this.filteredPosts = this.posts;
  }
}