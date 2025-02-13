import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc,deleteDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-infracciones-transito',
  templateUrl: './infracciones-transito.page.html',
  styleUrls: ['./infracciones-transito.page.scss'],
})
export class InfraccionesTransitoPage implements OnInit {
  selectedSegment: string = 'todo';
  infracciones: any[] = [];
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
      message: 'Cargando infracciones...'
    });
    await loading.present();
    try {
      const newsCollection = collection(this.firestore, 'infraccionTranst');
      const newsSnapshot = await getDocs(newsCollection);
      this.infracciones = newsSnapshot.docs.map(doc => ({
        id: doc.id,  // Añade el ID del documento
        ...doc.data()  // Spread operator para incluir todos los demás datos
      }));      
      console.log("infracciones", this.infracciones);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al cargar las infracciones',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async agregarInfracciones() {
    const alert = await this.alertController.create({
      header: 'Crear Infracciones de Tránsito',
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
              message: 'Creando infracción...'
            });
            await loading.present();

            try {
              await this.authService.createNewsInfraccionTranst({
                title: data.title,
                content: data.content,
                date: new Date()
              });
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Infracción creada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
              this.loadNews(); // Recargar las infracciones después de crear una nueva
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al crear la infracción de tránsito',
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
  async eliminarInfraccion(infraccion: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Entidad de Tránsito',
      message: '¿Estás seguro de que deseas eliminar esta infracción de tránsito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando infracción...'
            });
            await loading.present();
  
            try {
              //Elimina la entidad de tránsito
           
              const entidadRef = doc(this.firestore, 'infraccionTranst', infraccion.id);
              await deleteDoc(entidadRef);
      
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Infracción eliminada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
  
              // Recargar las infracciones después de eliminar
              this.loadNews();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al eliminar la infracción de tránsito',
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
