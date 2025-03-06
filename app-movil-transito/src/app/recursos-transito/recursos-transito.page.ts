import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-recursos-transito',
  templateUrl: './recursos-transito.page.html',
  styleUrls: ['./recursos-transito.page.scss'],
})
export class RecursosTransitoPage implements OnInit {
  selectedSegment: string = 'todo';
  recursos: any[] = [];
  selectedImage: File | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly alertController: AlertController,
    private readonly loadingController: LoadingController,
    private readonly firestore: Firestore,
    private readonly storage: Storage // Añadido el servicio Storage
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
        id: doc.id,
        ...doc.data()
      }));      
      console.log("recursos", this.recursos);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al cargar los recursos',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async agregarRecursos() {
    const alert = await this.alertController.create({
      header: 'Crear Recurso de Tránsito',
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

  async openImageSelector(recursoData: any) {
    const alert = await this.alertController.create({
      header: 'Añadir Imagen',
      message: '¿Deseas añadir una imagen a este recurso?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.saveRecurso(recursoData);
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
                this.saveRecurso(recursoData);
              }
            };
            fileInput.click();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveRecurso(recursoData: any) {
    const loading = await this.loadingController.create({
      message: 'Guardando recurso...'
    });
    await loading.present();

    try {
      let imageUrl: string | null = null;
      
      // Si hay una imagen seleccionada, subirla a Firebase Storage
      if (this.selectedImage) {
        imageUrl = await this.uploadImage(this.selectedImage);
      }

      // Crear el recurso con o sin imagen
      await this.authService.createNewsRecursoTransito({
        title: recursoData.title,
        content: recursoData.content,
        date: new Date(),
        imageUrl: imageUrl
      });

      this.selectedImage = null;
      await loading.dismiss();
      
      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Recurso creado correctamente',
        buttons: ['OK']
      });
      await successAlert.present();
      this.loadNews(); // Recargar recursos
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al crear el recurso',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  // Método para subir imagen a Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const fileName = new Date().getTime() + '_' + file.name;
      const storageRef = ref(this.storage, `recurso_images/${fileName}`);
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
              message: 'Eliminando recurso...'
            });
            await loading.present();
  
            try {
              // Elimina la imagen de Firebase Storage si existe
              if (recurso.imageUrl) {
                try {
                  // Obtener la referencia de la URL
                  const imageRef = ref(this.storage, recurso.imageUrl);
                  // Eliminar el archivo
                  await deleteObject(imageRef);
                } catch (error) {
                  console.error('Error al eliminar imagen:', error);
                  // Continuar con la eliminación del recurso aunque falle la eliminación de la imagen
                }
              }

              // Elimina el recurso de Firestore
              const entidadRef = doc(this.firestore, 'recursoTransito', recurso.id);
              await deleteDoc(entidadRef);
      
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Recurso eliminado correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
  
              // Recargar los recursos después de eliminar
              this.loadNews();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al eliminar el recurso',
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