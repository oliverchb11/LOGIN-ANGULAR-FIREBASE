import { Component, OnInit } from "@angular/core";
import { UsuarioMondel } from "../../models/usuario.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioMondel = new UsuarioMondel();
  errorInvalid: string;
  recordarUsuario = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}
  onSubmit(formulario: NgForm) {
    if (formulario.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere un momento por favor",
    });
    this.authService.nuevoUsuario$(this.usuario).subscribe(
      (data) => {
        console.log(data);
        Swal.close();
        if (this.recordarUsuario) {
          localStorage.setItem("email", this.usuario.email);
        }
        this.router.navigateByUrl("/login");
      },
      (error) => {
        this.errorInvalid = error.error.error.errors[0].message;
        Swal.fire({
          type: "error",
          title: "Error al llenar los datos",
          text: this.errorInvalid,
        });
      }
    );
  }
}
