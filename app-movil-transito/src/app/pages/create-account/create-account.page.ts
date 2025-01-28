import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

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

  constructor(private auth: Auth, private firestore: Firestore) {}

  async createAccount() {
    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    try {
      // Crear cuenta con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      console.log('Cuenta creada con éxito:', userCredential.user);

      // Guardar datos adicionales del usuario en la colección `UserTransito`
      const userDocRef = doc(this.firestore, `UserTransito/${userCredential.user.uid}`);
      await setDoc(userDocRef, {
        Username: this.username,
        Correo: this.email,
        Contraseña: this.password, // ⚠️ Evita guardar contraseñas en texto plano
      });

      console.log('Datos del usuario guardados en Firestore en UserTransito');
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
    }
  }
}
