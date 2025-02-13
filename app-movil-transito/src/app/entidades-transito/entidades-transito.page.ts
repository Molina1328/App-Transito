import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc,deleteDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-entidades-transito',
  templateUrl: './entidades-transito.page.html',
  styleUrls: ['./entidades-transito.page.scss'],
})
export class EntidadesTransitoPage implements OnInit {
  selectedSegment: string = 'todo';
  entidades: any[] = [];

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
      message: 'Cargando entidades...'
    });
    await loading.present();
    try {
      const newsCollection = collection(this.firestore, 'entidadTrans');
      const newsSnapshot = await getDocs(newsCollection);
      this.entidades = newsSnapshot.docs.map(doc => ({
        id: doc.id,  // Añade el ID del documento
        ...doc.data()  // Spread operator para incluir todos los demás datos
      }));      
      console.log("entidades", this.entidades);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al cargar las entidades',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async agregarEntidad() {
    const alert = await this.alertController.create({
      header: 'Crear Entidad de Tránsito',
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
              message: 'Creando entidad...'
            });
            await loading.present();

            try {
              await this.authService.createNewsEntidadTrans({
                title: data.title,
                content: data.content,
                date: new Date()
              });
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Entidad creada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
              this.loadNews(); // Recargar las entidades después de crear una nueva
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al crear la entidad de tránsito',
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
  async eliminarEntidad(entidad: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Entidad de Tránsito',
      message: '¿Estás seguro de que deseas eliminar esta entidad?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando entidad...'
            });
            await loading.present();
  
            try {
              //Elimina la entidad de tránsito
           
              const entidadRef = doc(this.firestore, 'entidadTrans', entidad.id);
              await deleteDoc(entidadRef);
      
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Entidad eliminada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
  
              // Recargar las entidades después de eliminar
              this.loadNews();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al eliminar la entidad de tránsito',
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