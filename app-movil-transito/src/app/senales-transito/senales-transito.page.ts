import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc, deleteDoc } from '@angular/fire/firestore';
// Importa lo necesario para Storage
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-senales-transito',
  templateUrl: './senales-transito.page.html',
  styleUrls: ['./senales-transito.page.scss'],
})
export class SenalesTransitoPage implements OnInit {
  selectedSegment: string = 'todo';
  senales: any[] = [];
  selectedImage: File | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly alertController: AlertController,
    private readonly loadingController: LoadingController,
    private readonly firestore: Firestore,
    private storage: Storage // Añade el servicio Storage
  ) {}

  ngOnInit() {
    this.loadNews();
  }

  async loadNews() {
    const newsCollection = collection(this.firestore, 'senalTranst');
    const newsSnapshot = await getDocs(newsCollection);
    this.senales = [];
    newsSnapshot.forEach((doc) => {
      this.senales.push({
        id: doc.id,
        ...doc.data()
      });
    });
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
          text: 'Siguiente',
          handler: async (data) => {
            this.openImageSelector(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async openImageSelector(senalData: any) {
    const alert = await this.alertController.create({
      header: 'Añadir Imagen',
      message: '¿Deseas añadir una imagen a esta señal de tránsito?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.saveSenal(senalData);
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
                this.saveSenal(senalData);
              }
            };
            fileInput.click();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveSenal(senalData: any) {
    const loading = await this.loadingController.create({
      message: 'Guardando señal de tránsito...'
    });
    await loading.present();

    try {
      let imageUrl: string | null = null;
      
      // Si hay una imagen seleccionada, súbela a Firebase Storage
      if (this.selectedImage) {
        imageUrl = await this.uploadImage(this.selectedImage);
      }

      // Crear la señal de tránsito con o sin imagen
      await this.authService.createNewsSenalTranst({
        title: senalData.title,
        content: senalData.content,
        date: new Date(),
        imageUrl: imageUrl
      });

      this.selectedImage = null;
      await loading.dismiss();
      
      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Señal de tránsito creada correctamente',
        buttons: ['OK']
      });
      await successAlert.present();
      this.loadNews(); // Recargar señales
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

  // Método para subir imagen a Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const fileName = new Date().getTime() + '_' + file.name;
      const storageRef = ref(this.storage, `senal_images/${fileName}`);
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
              // Elimina la imagen de Firebase Storage si existe
              if (senal.imageUrl) {
                try {
                  // Obtener la referencia de la URL
                  const imageRef = ref(this.storage, senal.imageUrl);
                  // Eliminar el archivo
                  await deleteObject(imageRef);
                } catch (error) {
                  console.error('Error al eliminar imagen:', error);
                  // Continuar con la eliminación aunque falle la eliminación de la imagen
                }
              }

              // Elimina la señal de tránsito de Firestore
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