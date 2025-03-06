import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { NotificationService } from '../services/notification.service';
// Importaciones correctas para Firebase Storage
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  selectedSegment: string = 'noticias';
  noticias: any[] = [];
  selectedImage: File | null = null;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firestore: Firestore,
    private storage: Storage // Inyección del servicio Storage
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
        id: doc.id,
        ...doc.data()
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
          text: 'Siguiente',
          handler: async (data) => {
            this.openImageSelector(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async openImageSelector(newsData: any) {
    const alert = await this.alertController.create({
      header: 'Añadir Imagen',
      message: '¿Deseas añadir una imagen a esta noticia?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.saveNews(newsData);
          }
        },
        {
          text: 'Sí',
          handler: () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = (event: any) => {
              const file = event.target.files[0];
              if (file) {
                this.selectedImage = file;
                this.saveNews(newsData);
              }
            };
            fileInput.click();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveNews(newsData: any) {
    const loading = await this.loadingController.create({
      message: 'Guardando noticia...'
    });
    await loading.present();

    try {
      let imageUrl: string | null = null;
      
      // Si hay una imagen seleccionada, súbela a Firebase Storage
      if (this.selectedImage) {
        imageUrl = await this.uploadImage(this.selectedImage);
      }

      // Crear la noticia con o sin imagen
      await this.authService.createNews({
        title: newsData.title,
        content: newsData.content,
        date: new Date(),
        imageUrl: imageUrl
      }as any);

      this.selectedImage = null;
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
      const lowerTitle = newsData.title.trim().toLowerCase();
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

  // Método para subir imagen a Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const fileName = new Date().getTime() + '_' + file.name;
      const storageRef = ref(this.storage, `news_images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Opcionalmente puedes usar esto para mostrar el progreso
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            reject(error);
          },
          async () => {
            // Cuando la carga se completa, obtener URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
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
              // Elimina la imagen de Firebase Storage si existe
              if (noticia.imageUrl) {
                try {
                  // Obtener la referencia de la URL
                  const imageRef = ref(this.storage, noticia.imageUrl);
                  // Eliminar el archivo
                  await deleteObject(imageRef);
                } catch (error) {
                  console.error('Error al eliminar imagen:', error);
                  // Continuar con la eliminación de la noticia aunque falle la eliminación de la imagen
                }
              }

              // Elimina la noticia de Firestore
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