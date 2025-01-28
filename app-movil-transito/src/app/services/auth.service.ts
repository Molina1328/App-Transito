import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User,onAuthStateChanged  } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private newsCollection: any;
  constructor(private readonly auth: Auth,private firestore: Firestore) {
    this.newsCollection = collection(this.firestore, '1234');
  }

  // Registro con email y contraseña
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login con email y contraseña
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Cerrar sesión
  logout() {
    return signOut(this.auth);
  }
  // Obtener datos del usuario logueado
  getLoggedInUser() {
    return new Promise<User | null>((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  }
   // Crear noticia en la colección '1234'
   createNews(news: { title: string, content: string, date: Date }) {
    return addDoc(this.newsCollection, news);
  }
}
