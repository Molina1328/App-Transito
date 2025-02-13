import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc,deleteDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-codigo-transito',
  templateUrl: './codigo-transito.page.html',
  styleUrls: ['./codigo-transito.page.scss'],
})
export class CodigoTransitoPage implements OnInit {
 selectedSegment: string = 'todo';
  codigos: any[] = [];

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
      message: 'Cargando codigos de tránsito...'
    });
    await loading.present();
    try {
      const newsCollection = collection(this.firestore, 'codigoTransito');
      const newsSnapshot = await getDocs(newsCollection);
      this.codigos = newsSnapshot.docs.map(doc => ({
        id: doc.id,  // Añade el ID del documento
        ...doc.data()  // Spread operator para incluir todos los demás datos
      }));      
      console.log("codigos", this.codigos);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al cargar los códigos de tránsito',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async agregarCodigoTransito() {
    const alert = await this.alertController.create({
      header: 'Crear Código de Tránsito',
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
              message: 'Creando código de tránsito...'
            });
            await loading.present();

            try {
              await this.authService.createNewsCodigoTransito({
                title: data.title,
                content: data.content,
                date: new Date()
              });
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Código de tránsito creado correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
              this.loadNews(); // Recargar las codigos después de crear una nueva
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al crear el código de tránsito',
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
  async eliminarCodigoTransito(codigo: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Código de Tránsito',
      message: '¿Estás seguro de que deseas eliminar este código de tránsito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando código de tránsito...'
            });
            await loading.present();
  
            try {
              //Elimina la entidad de tránsito
           
              const entidadRef = doc(this.firestore, 'codigoTransito', codigo.id);
              await deleteDoc(entidadRef);
      
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Entidad eliminada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
  
              // Recargar las codigos después de eliminar
              this.loadNews();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al eliminar el código de tránsito',
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
