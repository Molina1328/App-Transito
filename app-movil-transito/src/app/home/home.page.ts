import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  selectedSegment: string = 'todo';
  noticias: any[] = [];

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.loadNews();
  }

  async loadNews() {
    const loading = await this.loadingController.create({
      message: 'Cargando noticias...'
    });
    await loading.present();

    try {
      const newsCollection = collection(this.firestore, '1234');
      const newsSnapshot = await getDocs(newsCollection);
      this.noticias = newsSnapshot.docs.map(doc => doc.data());
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al cargar las noticias',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async createNews() {
    const alert = await this.alertController.create({
      header: 'Crear Noticia',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título'
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Contenido'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            const loading = await this.loadingController.create({
              message: 'Creando noticia...'
            });
            await loading.present();

            try {
              await this.authService.createNews({
                title: data.title,
                content: data.content,
                date: new Date()
              });
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Noticia creada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
              this.loadNews(); // Recargar las noticias después de crear una nueva
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al crear la noticia',
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}