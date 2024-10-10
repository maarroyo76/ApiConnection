import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  @ViewChild('myTabs', { static: false }) tabs!: IonTabs; // Referencia al componente ion-tabs
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

  originalData: any = {};

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.loadData();
  }


  loadData() {
    this.apiService.getData().subscribe((data: any) => {
      this.dataList = data.map((item: any) => ({ ...item, editing: false }));
      this.filteredData = this.dataList;
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

  async createData() {
    if (this.newData.title && this.newData.body) {
      const loading = await this.loadingController.create({
        message: 'Creando...'
      });
      await loading.present();

      this.apiService.createData(this.newData).subscribe(
        (response) => {
          console.log('Nuevo dato creado:', response);
          this.dataList.push(response);
          loading.dismiss();
          this.presentToast('Nuevo dato creado!', 'success');
          this.tabs.select('getData'); 
          this.clearNewDataFields();
        },
        (error) => {
          console.error('Error al crear el dato:', error);
          loading.dismiss();
          this.presentToast('Error al crear el dato.', 'danger');
        }
      );
    } else {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
    }
  }

  enableEditing(data: any) {
    this.originalData = { ...data };
    data.title = '';
    data.body = '';
    data.editing = true;
  }

  async saveChanges(data: any) {
    if (data.id && data.title && data.body) {
      const loading = await this.loadingController.create({
        message: 'Guardando cambios...'
      });
      await loading.present();

      this.apiService.updateData(data.id, data).subscribe(
        () => {
          data.editing = false; 
          loading.dismiss();
          this.presentToast('Cambios guardados!', 'success');
        },
        (error) => {
          console.error('Error al guardar los cambios:', error);
          loading.dismiss();
          this.presentToast('Error al guardar los cambios.', 'danger');
        }
      );
    } else {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
    }
  }

  cancelEditing(data: any) {
    data.title = this.originalData.title;
    data.body = this.originalData.body;
    data.editing = false;
  }

  async updateData() {
    if (this.dataToUpdate.id && this.dataToUpdate.title && this.dataToUpdate.body) {
      const existingData = this.dataList.find(data => data.id === this.dataToUpdate.id);

      if (existingData) {
        const loading = await this.loadingController.create({
          message: 'Actualizando...'
        });
        await loading.present();

        this.apiService.updateData(this.dataToUpdate.id, this.dataToUpdate).subscribe(
          () => {
            existingData.title = this.dataToUpdate.title;
            existingData.body = this.dataToUpdate.body;
            loading.dismiss();
            this.presentToast('Dato actualizado!', 'success');
            this.tabs.select('getData'); 
            this.clearUpdateFields();
          },
          (error) => {
            console.error('Error al actualizar el dato:', error);
            loading.dismiss(); 
            this.presentToast('Error al actualizar el dato.', 'danger');
          }
        );
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
