import { Injectable } from '@angular/core';
// @ts-ignore
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly newsCollectionHome: any;
  private readonly newsCollectionUserTransito: any;
  private readonly newsCollectionCodigoTransito: any;
  private readonly newsCollectionEntidadTrans: any;
  private readonly newsCollectionInfraccionTranst: any;
  private readonly newsCollectionRecursoTransito: any;
  private readonly newsCollectionSenalTranst: any;
  constructor(private readonly auth: Auth, private readonly firestore: Firestore) {
    this.newsCollectionHome = collection(this.firestore, '1234');
    this.newsCollectionUserTransito = collection(this.firestore, 'UserTransito');
    this.newsCollectionCodigoTransito = collection(this.firestore, 'codigoTransito');
    this.newsCollectionEntidadTrans = collection(this.firestore, 'entidadTrans');
    this.newsCollectionInfraccionTranst = collection(this.firestore, 'infraccionTranst');
    this.newsCollectionRecursoTransito = collection(this.firestore, 'recursoTransito');
    this.newsCollectionSenalTranst = collection(this.firestore, 'senalTranst');
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
    return addDoc(this.newsCollectionHome, news);
  }

  // Crear noticia en la colección 'UserTransito'
  createNewsUserTransito(news: { title: string, content: string, date: Date }) {
    return addDoc(this.newsCollectionUserTransito, news);
  }

  // Crear noticia en la colección 'CodigoTransito'
  createNewsCodigoTransito(news: { title: string, content: string, date: Date }) {
    return addDoc(this.newsCollectionCodigoTransito, news);
  }

  // Crear noticia en la colección 'EntidadTrans'
  createNewsEntidadTrans(news: { title: string, content: string, date: Date }) {
    return addDoc(this.newsCollectionEntidadTrans, news);
  }

  // Crear noticia en la colección 'InfraccionTranst'
  createNewsInfraccionTranst(news: { title: string, content: string, date: Date }) {
    return addDoc(this.newsCollectionInfraccionTranst, news);
  }
  // Crear noticia en la colección 'RecursoTransito'
  createNewsRecursoTransito(news: { title: string, content: string, date: Date }) {
    return addDoc(this.newsCollectionRecursoTransito, news);
  }

  // Crear noticia en la colección 'SenalTranst'
  createNewsSenalTranst(news: { title: string, content: string, date: Date }) {
    return addDoc(this.newsCollectionSenalTranst, news);
  }
}
