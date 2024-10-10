import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
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

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Asegúrate de que las tabs están listas para usarse
    if (this.tabs) {
      console.log('Tabs component is ready:', this.tabs);
    } else {
      console.error('Tabs component is not ready');
    }
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
          loading.dismiss(); // Cerrar el loading después de la operación exitosa
          this.presentToast('Nuevo dato creado!', 'success');
          this.tabs.select('getData'); // Cambiar a la tab de "Get Data"
          this.clearNewDataFields();
        },
        (error) => {
          console.error('Error al crear el dato:', error);
          loading.dismiss(); // Cerrar el loading incluso si ocurre un error
          this.presentToast('Error al crear el dato.', 'danger');
        }
      );
    } else {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
    }
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
            loading.dismiss(); // Cerrar el loading después de la operación exitosa
            this.presentToast('Dato actualizado!', 'success');
            this.tabs.select('getData'); // Cambiar a la tab de "Get Data"
            this.clearUpdateFields();
          },
          (error) => {
            console.error('Error al actualizar el dato:', error);
            loading.dismiss(); // Cerrar el loading incluso si ocurre un error
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
