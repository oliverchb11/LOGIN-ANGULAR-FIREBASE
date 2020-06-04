import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioMondel } from "../models/usuario.model";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private URL = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private API_KEY = "AIzaSyB-jPQw4E16pdSV30EXAW09XLaTqXIMqgA";
  userToken: string;
  // private URL_CREAR_USUARIOS = `${this.URL}signUp?key=${this.API_KEY}`;

  // private URL_LOGIN = `${this.URL}signInWithPassword?key=${this.API_KEY}`;
  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logout$() {
    localStorage.removeItem("token");
  }

  login$(usuario: UsuarioMondel) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };
    return this.http
      .post(`${this.URL}signInWithPassword?key=${this.API_KEY}`, authData)
      .pipe(
        map((res) => {
          this.guardarToken(res["idToken"]);
          return res;
        })
      );
  }

  nuevoUsuario$(usuario: UsuarioMondel) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };
    return this.http
      .post(`${this.URL}signUp?key=${this.API_KEY}`, authData)
      .pipe(
        map((res) => {
          this.guardarToken(res["idToken"]);
          return res;
        })
      );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    let hoy = new Date();

    hoy.setSeconds(3600);

    localStorage.setItem("expira", hoy.getTime().toString());
  }

  private leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
  }

  estaAuth(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expira = Number(localStorage.getItem("expira"));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
