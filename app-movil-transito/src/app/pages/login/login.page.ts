import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  users: any;
  email: string = '';
  password: string = '';

  constructor() {}

  login() {
    // Aquí va la lógica para el inicio de sesión
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
  }
}
