import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  user: any;
  userProfile: any = {
    displayName: '',
    phoneNumber: '',
    address: '',
    profileImageUrl: ''
  };
  selectedImage: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore,
    private storage: Storage,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    // Obtener el usuario autenticado
    const user = await this.authService.getLoggedInUser();
    this.user = user;

    if (user) {
      // Cargar el perfil del usuario desde Firestore
      await this.loadUserProfile();
    }
  }

  async loadUserProfile() {
    try {
      // Referencia al documento del usuario en Firestore
      const userDocRef = doc(this.firestore, 'userProfiles', this.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Si existe el perfil, cargarlo
        this.userProfile = userDocSnap.data();
      } else {
        // Si no existe, crear un documento para el usuario
        await setDoc(userDocRef, {
          displayName: this.user.displayName || '',
          phoneNumber: this.user.phoneNumber || '',
          address: '',
          profileImageUrl: ''
        });
      }
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error);
    }
  }

  async selectProfileImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.selectedImage = file;
        this.uploadProfileImage();
      }
    };
    fileInput.click();
  }

  async uploadProfileImage() {
    if (!this.selectedImage) return;

    const loading = await this.loadingController.create({
      message: 'Subiendo imagen...'
    });
    await loading.present();

    try {
      // Si ya había una imagen previa, eliminarla
      if (this.userProfile.profileImageUrl) {
        try {
          const oldImageRef = ref(this.storage, this.userProfile.profileImageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error('Error al eliminar la imagen anterior:', error);
          // Continuar con la subida aunque falle la eliminación
        }
      }

      // Subir la nueva imagen
      const fileName = `profile_${this.user.uid}_${new Date().getTime()}`;
      const storageRef = ref(this.storage, `profile_images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, this.selectedImage);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
          loading.dismiss();
        },
        async () => {
          // Obtener la URL de la imagen
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Actualizar el perfil del usuario
          const userDocRef = doc(this.firestore, 'userProfiles', this.user.uid);
          await updateDoc(userDocRef, {
            profileImageUrl: downloadURL
          });
          
          // Actualizar la UI
          this.userProfile.profileImageUrl = downloadURL;
          this.selectedImage = null;
          
          await loading.dismiss();
          
          const successAlert = await this.alertController.create({
            header: 'Éxito',
            message: 'Imagen de perfil actualizada correctamente',
            buttons: ['OK']
          });
          await successAlert.present();
        }
      );
    } catch (error) {
      await loading.dismiss();
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al subir la imagen',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async editUserProfile() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          placeholder: 'Nombre completo',
          value: this.userProfile.displayName
        },
        {
          name: 'phoneNumber',
          type: 'tel',
          placeholder: 'Teléfono',
          value: this.userProfile.phoneNumber
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'Dirección',
          value: this.userProfile.address
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            const loading = await this.loadingController.create({
              message: 'Actualizando perfil...'
            });
            await loading.present();

            try {
              // Actualizar el perfil en Firestore
              const userDocRef = doc(this.firestore, 'userProfiles', this.user.uid);
              await updateDoc(userDocRef, {
                displayName: data.displayName,
                phoneNumber: data.phoneNumber,
                address: data.address
              });

              // Actualizar localmente
              this.userProfile.displayName = data.displayName;
              this.userProfile.phoneNumber = data.phoneNumber;
              this.userProfile.address = data.address;

              await loading.dismiss();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Perfil actualizado correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
            } catch (error) {
              await loading.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al actualizar el perfil',
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

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}