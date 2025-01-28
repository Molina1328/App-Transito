import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  users: any;
  email: string = '';
  password: string = '';

  constructor(    private readonly authService: AuthService,
    private readonly alertController: AlertController,
    private readonly navCtrl: NavController) {
    
  }

  async login() {
    // Aquí va la lógica para el inicio de sesión
    try {
      await this.authService.login(this.email, this.password);
      console.log('getLoggedInUser', this.authService.getLoggedInUser());
      this.navCtrl.navigateRoot('/home'); // Navegar a la página principal
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Credenciales incorrectas. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await alert.present();
    }
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
  }
}
