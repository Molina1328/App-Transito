import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = '';
  loading: boolean = false;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async mostrarMensaje(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private validarFormulario(): boolean {
    if (!this.email || !this.password || !this.username || !this.confirmPassword) {
      this.mostrarMensaje('Error', 'Todos los campos son obligatorios');
      return false;
    }

    if (this.password.length < 6) {
      this.mostrarMensaje('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.mostrarMensaje('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  }

  async createAccount() {
    if (!this.validarFormulario()) return;

    this.loading = true;
    const loadingIndicator = await this.loadingController.create({
      message: 'Creando cuenta...'
    });
    await loadingIndicator.present();

    try {
      // Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      // Guardar datos adicionales en Firestore
      const userDocRef = doc(this.firestore, 'UserTransito', userCredential.user.uid);
      await setDoc(userDocRef, {
        Username: this.username,
        Correo: this.email,
        fechaCreacion: new Date(),
        uid: userCredential.user.uid
      });

      await this.mostrarMensaje('¡Éxito!', 'Cuenta creada correctamente');
      this.router.navigate(['/login']);

    } catch (error: any) {
      let mensaje = 'Error al crear la cuenta';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          mensaje = 'El correo electrónico ya está en uso';
          break;
        case 'auth/invalid-email':
          mensaje = 'El correo electrónico no es válido';
          break;
        case 'auth/operation-not-allowed':
          mensaje = 'Operación no permitida';
          break;
        case 'auth/weak-password':
          mensaje = 'La contraseña es muy débil';
          break;
      }
      
      await this.mostrarMensaje('Error', mensaje);
    } finally {
      this.loading = false;
      await loadingIndicator.dismiss();
    }
  }
}
