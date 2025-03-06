import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc, deleteDoc } from '@angular/fire/firestore';
// Importa lo necesario para Storage
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-codigo-transito',
  templateUrl: './codigo-transito.page.html',
  styleUrls: ['./codigo-transito.page.scss'],
})
export class CodigoTransitoPage implements OnInit {
  selectedSegment: string = 'todo';
  codigos: any[] = [];
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
    const loading = await this.loadingController.create({
      message: 'Cargando codigos de tránsito...'
    });
    await loading.present();
    try {
      const newsCollection = collection(this.firestore, 'codigoTransito');
      const newsSnapshot = await getDocs(newsCollection);
      this.codigos = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
          text: 'Siguiente',
          handler: async (data) => {
            this.openImageSelector(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async openImageSelector(codigoData: any) {
    const alert = await this.alertController.create({
      header: 'Añadir Imagen',
      message: '¿Deseas añadir una imagen a este código de tránsito?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.saveCodigo(codigoData);
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
                this.saveCodigo(codigoData);
              }
            };
            fileInput.click();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveCodigo(codigoData: any) {
    const loading = await this.loadingController.create({
      message: 'Guardando código de tránsito...'
    });
    await loading.present();

    try {
      let imageUrl: string | null = null;
      
      // Si hay una imagen seleccionada, súbela a Firebase Storage
      if (this.selectedImage) {
        imageUrl = await this.uploadImage(this.selectedImage);
      }

      // Crear el código de tránsito con o sin imagen
      await this.authService.createNewsCodigoTransito({
        title: codigoData.title,
        content: codigoData.content,
        date: new Date(),
        imageUrl: imageUrl
      });

      this.selectedImage = null;
      await loading.dismiss();
      
      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Código de tránsito creado correctamente',
        buttons: ['OK']
      });
      await successAlert.present();
      this.loadNews(); // Recargar codigos
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

  // Método para subir imagen a Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const fileName = new Date().getTime() + '_' + file.name;
      const storageRef = ref(this.storage, `codigo_images/${fileName}`);
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
              // Elimina la imagen de Firebase Storage si existe
              if (codigo.imageUrl) {
                try {
                  // Obtener la referencia de la URL
                  const imageRef = ref(this.storage, codigo.imageUrl);
                  // Eliminar el archivo
                  await deleteObject(imageRef);
                } catch (error) {
                  console.error('Error al eliminar imagen:', error);
                  // Continuar con la eliminación aunque falle la eliminación de la imagen
                }
              }

              // Elimina el código de tránsito de Firestore
              const entidadRef = doc(this.firestore, 'codigoTransito', codigo.id);
              await deleteDoc(entidadRef);
      
              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Código de tránsito eliminado correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
  
              // Recargar los códigos después de eliminar
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