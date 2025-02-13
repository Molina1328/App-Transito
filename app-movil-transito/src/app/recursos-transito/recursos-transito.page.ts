import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc,deleteDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-recursos-transito',
  templateUrl: './recursos-transito.page.html',
  styleUrls: ['./recursos-transito.page.scss'],
})
export class RecursosTransitoPage implements OnInit {
  selectedSegment: string = 'todo';
  recursos: any[] = [];
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
      message: 'Cargando recursos...'
    });
    await loading.present();
    try {
      const newsCollection = collection(this.firestore, 'recursoTransito');
      const newsSnapshot = await getDocs(newsCollection);
      this.recursos = newsSnapshot.docs.map(doc => ({
        id: doc.id,  // Añade el ID del documento
        ...doc.data()  // Spread operator para incluir todos los demás datos
      }));      
      console.log("recursos", this.recursos);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al cargar las recursos',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async agregarRecursos() {
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
              message: 'Creando recurso...'
            });
            await loading.present();

            try {
              await this.authService.createNewsRecursoTransito({
                title: data.title,
                content: data.content,
                date: new Date()
              });
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Recurso creada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
              this.loadNews(); // Recargar las recursos después de crear una nueva
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al crear el recursode tránsito',
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
  async eliminarRecursos(recurso: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Recurso de Tránsito',
      message: '¿Estás seguro de que deseas eliminar este recurso?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando...'
            });
            await loading.present();
  
            try {
              //Elimina la entidad de tránsito
           
              const entidadRef = doc(this.firestore, 'recursoTransito', recurso.id);
              await deleteDoc(entidadRef);
      
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Recurso eliminado correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
  
              // Recargar las recursos después de eliminar
              this.loadNews();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al eliminar',
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
