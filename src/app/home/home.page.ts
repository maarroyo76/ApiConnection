import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchId: number | null = null;

  postToUpdate: any = {
    id: null,
    title: '',
    body: ''
  };

  constructor(
    private apiService: ApiService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.apiService.getData().subscribe((data: any) => {
      this.posts = data;
      this.filteredPosts = data;
    }, (error) => {
      console.error('Error al cargar los datos:', error);
    });
  }

  searchPost() {
    if (this.searchId !== null) {
      this.filteredPosts = this.posts.filter(post => post.id === this.searchId);
    } else {
      this.filteredPosts = this.posts;
    }
  }

  clearSearch() {
    this.searchId = null;
    this.filteredPosts = this.posts;
  }

  updatePost() {
    // Validar que todos los campos estén completos
    if (this.postToUpdate.id && this.postToUpdate.title && this.postToUpdate.body) {
      const postToUpdate = this.posts.find(post => post.id === this.postToUpdate.id);
      
      if (postToUpdate) {
        this.apiService.updatePost(this.postToUpdate.id, this.postToUpdate).subscribe(() => {
          postToUpdate.title = this.postToUpdate.title;
          postToUpdate.body = this.postToUpdate.body;
          this.presentToast('Post actualizado!', 'success');
          this.clearUpdateFields();
        }, (error) => {
          this.presentToast('Error al actualizar el post.', 'danger');
        });
      } else {
        this.presentToast('Post no encontrado.', 'danger');
      }
    } else {
      this.presentToast('Por favor, complete todos los campos.', 'warning');
    }
  }

  clearUpdateFields() {
    this.postToUpdate = { id: null, title: '', body: '' };
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
