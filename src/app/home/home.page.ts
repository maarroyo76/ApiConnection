import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  dataList: any[] = []; 
  filteredData: any[] = []; 
  searchId: number | null = null;

  newData: any = {
    id: null,
    title: '',
    body: ''
  };

  dataToUpdate: any = { 
    id: null,
    title: '',
    body: ''
  };

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getData().subscribe((data: any) => {
      this.dataList = data;
      this.filteredData = data;
    }, (error) => {
      console.error('Error al cargar los datos:', error);
    });
  }

  searchData() {
    if (this.searchId !== null) {
      this.filteredData = this.dataList.filter(data => data.id === this.searchId);
    } else {
      this.filteredData = this.dataList;
    }
  }

  clearSearch() {
    this.searchId = null;
    this.filteredData = this.dataList;
  }

  createData() {
    if (this.newData.title && this.newData.body) {
      this.loadingController.create({
        message: 'Creando...'
      }).then((loading) => {
        loading.present();
      });
      this.apiService.createData(this.newData).subscribe((response) => {
        console.log('Nuevo dato creado:', response);
        this.dataList.push(response);
        this.loadingController.dismiss();
        this.presentToast('Nuevo dato creado!', 'success');
        this.clearNewDataFields();
      }, (error) => {
        console.error('Error al crear el dato:', error);
        this.presentToast('Error al crear el dato.', 'danger');
      });
    } else {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
    }
  }

  updateData() {
    if (this.dataToUpdate.id && this.dataToUpdate.title && this.dataToUpdate.body) {
      const existingData = this.dataList.find(data => data.id === this.dataToUpdate.id);

      if (existingData) {
        this.loadingController.create({
          message: 'Actualizando...'
        }).then((loading) => {
          loading.present();
        });
        this.apiService.updateData(this.dataToUpdate.id, this.dataToUpdate).subscribe(() => {
          existingData.title = this.dataToUpdate.title;
          existingData.body = this.dataToUpdate.body;
          this.loadingController.dismiss();
          this.presentToast('Dato actualizado!', 'success');
          this.clearUpdateFields();
        }, (error) => {
          this.presentToast('Error al actualizar el dato.', 'danger');
        });
      } else {
        this.presentToast('Dato no encontrado.', 'danger');
      }
    } else {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
    }
  }

  clearNewDataFields() {
    this.newData = { id: null, title: '', body: '' };
  }

  clearUpdateFields() {
    this.dataToUpdate = { id: null, title: '', body: '' };
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
