import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedSegment: string = 'todo';

  noticias = [
    {
      titulo: 'Nuevas señales de tránsito en Ecuador',
      fecha: new Date('2024-10-04'),
      imagen: 'assets/images/senal-transito.png',
      categoria: 'noticias'
    },
    {
      titulo: 'Mejoras en la aplicación',
      fecha: new Date('2024-07-23'),
      imagen: 'assets/images/mejoras-app.png',
      categoria: 'noticias'
    },
    {
      titulo: '¿Ya pagaste tu impuesto vehicular? Estos vehículos deben pagarlo',
      fecha: new Date('2024-04-27'),
      imagen: 'assets/images/impuesto-vehicular.png',
      categoria: 'blog'
    },
    {
      titulo: 'Multa por no portar el "kit de carreteras" en moto?',
      fecha: new Date('2024-04-06'),
      imagen: 'assets/images/kit-carreteras.png',
      categoria: 'blog'
    },
    {
      titulo: 'Distancia de seguridad entre vehículos',
      fecha: new Date('2024-03-16'),
      imagen: 'assets/images/distancia-seguridad.png',
      categoria: 'blog'
    },
    // Agrega más noticias con sus categorías respectivas
  ];

  constructor() {}

  // Método para filtrar noticias por categoría
  getFilteredNoticias() {
    if (this.selectedSegment === 'todo') {
      return this.noticias;
    }
    return this.noticias.filter(item => item.categoria === this.selectedSegment);
  }
}
