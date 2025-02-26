import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { NotificationService } from '../services/notification.service';


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
    private notificationService: NotificationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: Firestore
  ) { }

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
      this.noticias = newsSnapshot.docs.map(doc => ({
        id: doc.id,  // Añade el ID del documento
        ...doc.data()  // Spread operator para incluir todos los demás datos
      }));
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
              const keywords = ['accidente', 'choque', 'incendio', 'derrumbe', 'inundación'];
              const vias: { [key: string]: string[] } = {
                'av. 6 de diciembre': ['Av. Eloy Alfaro', 'Av. 10 de Agosto', 'Av. Shyris'],
                'av. amazonas': ['Av. República', 'Av. Colón', 'Av. Naciones Unidas'],
                'av. patria': ['Av. 12 de Octubre', 'Av. 10 de Agosto', 'Av. 6 de Diciembre'],
                'av. gonzález suárez': ['Av. 12 de Octubre', 'Av. Orellana', 'Av. Colón'],
                'av. mariscal sucre': ['Av. La Prensa', 'Av. Occidental', 'Av. América'],
                'autopista general rumiñahui': ['Av. Río Amazonas', 'Av. General Enríquez'],
                'avenida general enríquez sector sangolquí': ['Bulevar Santa Clara'],
                'avenida general enríquez sector selva alegre': ['Av. Luis Cordero', 'Vía Selva Alegre – Alangasí'],
                'avenida ilaló': ['Av. General Enríquez', 'Av. Luis Cordero', 'Ruta por Selva Alegre'],
                'calle pichincha y ascázubi': ['Calle Venezuela', 'Calle García Moreno', 'Av. Abdon Calderón'],
                'avenida general enríquez y calle luis cordero': ['Av. Abdon Calderón', 'Calle García Moreno', 'Bulevar Santa Clara'],
                'avenida general rumiñahui dirección a e35': ['Av Río Samora y Calle Betania'],
                'troncal de la sierra E20': ['Av. Los Shyris', 'Calle Samborondón'],
                'ruta viva': ['Av. E35', 'Av. 2 de agosto e Inter Valles'],
                'avenida mariana de jesús': ['Agustín Miranda', 'Calle Avelina Lasso'],
              };
              const lowerTitle = data.title.trim().toLowerCase();
              // 🔎 Detectar palabra clave y vía
              const matchedKeyword = keywords.find(keyword => lowerTitle.includes(keyword));
              const matchedVia = Object.keys(vias).find(via => lowerTitle.includes(via));

              if (matchedKeyword && matchedVia) {
                const rutas = vias[matchedVia].map((ruta, index) => `${index + 1}️⃣ ${ruta}`).join('\n');

                // 📝 Mensaje de notificación
                const mensaje = `🚨 Ha ocurrido un ${matchedKeyword} en la ${matchedVia}.\nTome las siguientes rutas alternas:\n${rutas}`;

                this.notificationService.sendMessage(mensaje);
              }
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Noticia creada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
              this.loadNews(); // Recargar noticias
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


  async eliminarNoticia(noticia: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Noticia de Tránsito',
      message: '¿Estás seguro de que deseas eliminar esta noticia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando noticia...'
            });
            await loading.present();

            try {
              //Elimina la noticia de tránsito

              const entidadRef = doc(this.firestore, '1234', noticia.id);
              await deleteDoc(entidadRef);

              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Noticia eliminada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();

              // Recargar las entidades después de eliminar
              this.loadNews();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al eliminar la noticia de tránsito',
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