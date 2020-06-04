import { Component, OnInit } from "@angular/core";
import { UsuarioMondel } from "src/app/models/usuario.model";
import { FormGroup } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuarioModelo: UsuarioMondel = new UsuarioMondel();
  errorInvalid: string;
  recordarUsuario = false;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("email")) {
      this.usuarioModelo.email = localStorage.getItem("email");
      this.recordarUsuario = true;
    }
  }
  loginForm(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere un momento por favor",
    });
    Swal.showLoading();
    this.auth.login$(this.usuarioModelo).subscribe(
      (data) => {
        console.log(data);
        Swal.close();

        if (this.recordarUsuario) {
          localStorage.setItem("email", this.usuarioModelo.email);
        }

        this.router.navigateByUrl("/home");
      },
      (error) => {
        console.log(error);
        this.errorInvalid = error.error.error.errors[0].message;
        Swal.fire({
          type: "error",
          title: "Error al autenticar",
          text: this.errorInvalid,
        });
      }
    );
  }
}
