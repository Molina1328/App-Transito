import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-infracciones-transito',
  templateUrl: './infracciones-transito.page.html',
  styleUrls: ['./infracciones-transito.page.scss'],
})
export class InfraccionesTransitoPage implements OnInit {
  selectedSegment: string = 'todo';
  infracciones: any[] = [];
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
      message: 'Cargando infracciones...'
    });
    await loading.present();
    try {
      const newsCollection = collection(this.firestore, 'infraccionTranst');
      const newsSnapshot = await getDocs(newsCollection);
      this.infracciones = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
          text: 'Siguiente',
          handler: async (data) => {
            this.openImageSelector(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async openImageSelector(infraccionData: any) {
    const alert = await this.alertController.create({
      header: 'Añadir Imagen',
      message: '¿Deseas añadir una imagen a esta infracción?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.saveInfraccion(infraccionData);
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
                this.saveInfraccion(infraccionData);
              }
            };
            fileInput.click();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveInfraccion(infraccionData: any) {
    const loading = await this.loadingController.create({
      message: 'Guardando infracción...'
    });
    await loading.present();

    try {
      let imageUrl: string | null = null;
      
      // Si hay una imagen seleccionada, subirla a Firebase Storage
      if (this.selectedImage) {
        imageUrl = await this.uploadImage(this.selectedImage);
      }

      // Crear la infracción con o sin imagen
      await this.authService.createNewsInfraccionTranst({
        title: infraccionData.title,
        content: infraccionData.content,
        date: new Date(),
        imageUrl: imageUrl
      });

      this.selectedImage = null;
      await loading.dismiss();
      
      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Infracción creada correctamente',
        buttons: ['OK']
      });
      await successAlert.present();
      this.loadNews(); // Recargar infracciones
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al crear la infracción',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  // Método para subir imagen a Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const fileName = new Date().getTime() + '_' + file.name;
      const storageRef = ref(this.storage, `infraccion_images/${fileName}`);
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

  async eliminarInfraccion(infraccion: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Infracción de Tránsito',
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
              // Elimina la imagen de Firebase Storage si existe
              if (infraccion.imageUrl) {
                try {
                  // Obtener la referencia de la URL
                  const imageRef = ref(this.storage, infraccion.imageUrl);
                  // Eliminar el archivo
                  await deleteObject(imageRef);
                } catch (error) {
                  console.error('Error al eliminar imagen:', error);
                  // Continuar con la eliminación de la infracción aunque falle la eliminación de la imagen
                }
              }

              // Elimina la infracción de Firestore
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