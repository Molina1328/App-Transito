import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getLoggedInUser().then(user => {
      this.user = user;
    });
  }
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
