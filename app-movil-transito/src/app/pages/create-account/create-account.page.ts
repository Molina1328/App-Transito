import { Component } from '@angular/core';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage {
  users: any;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor() {}

  createAccount() {
    if (this.password !== this.confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }

    // Aquí va la lógica para crear una cuenta
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
  }
}
