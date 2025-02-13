import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc,deleteDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-senales-transito',
  templateUrl: './senales-transito.page.html',
  styleUrls: ['./senales-transito.page.scss'],
})
export class SenalesTransitoPage implements OnInit {

 selectedSegment: string = 'todo';
  senales: any[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly alertController: AlertController,
    private readonly loadingController: LoadingController,
    private readonly firestore: Firestore
  ) {}

  ngOnInit() {
    this.loadNews();

  }

  async loadNews() {
    const loading = await this.loadingController.create({
      message: 'Cargando señales...'
    });
    await loading.present();
    try {
      const newsCollection = collection(this.firestore, 'senalTranst');
      const newsSnapshot = await getDocs(newsCollection);
      this.senales = newsSnapshot.docs.map(doc => ({
        id: doc.id,  // Añade el ID del documento
        ...doc.data()  // Spread operator para incluir todos los demás datos
      }));      
      console.log("señales", this.senales);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al cargar las señales',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async agregarSenal() {
    const alert = await this.alertController.create({
      header: 'Crear Señal de Tránsito',
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
              message: 'Creando señal de tránsito...'
            });
            await loading.present();

            try {
              await this.authService.createNewsSenalTranst({
                title: data.title,
                content: data.content,
                date: new Date()
              });
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Señal de tránsito creada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
              this.loadNews(); // Recargar las señales después de crear una nueva
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al crear la señal de tránsito',
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
  async eliminarSenal(senal: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Señal de Tránsito',
      message: '¿Estás seguro de que deseas eliminar esta señal de tránsito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando señal de tránsito...'
            });
            await loading.present();
  
            try {
              //Elimina la entidad de tránsito
           
              const entidadRef = doc(this.firestore, 'senalTranst', senal.id);
              await deleteDoc(entidadRef);
      
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Señal de tránsito eliminada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
  
              // Recargar las señales después de eliminar
              this.loadNews();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al eliminar la señal de tránsito',
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