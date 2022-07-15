import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'public/app/models/TarjetaCredito.model';
import { TarjetaService } from 'public/app/services/targeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  titulo: string = 'crear tarjeta'
  loading:boolean = false;
  form: FormGroup;
  id: string | undefined;
  constructor(
    private fb: FormBuilder,
    private _tarjetaService: TarjetaService,
    private toastr: ToastrService
    ) { 
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [
        Validators.required,
        Validators.minLength(19),
        Validators.maxLength(19),
      ]],
      fechaExpiracion: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ]],
      cvv: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]]

    })
  }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe((data) => {
      this.id = data.id;
      this.titulo = 'Editar Tarjeta';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      })
    })
  
  }

  guardarTarjeta() {
    if(this.id === undefined) {
      this.crearTarjeta()
    }
    else {
      this.editarTarjeta(this.id)
    }
  }

  editarTarjeta(id: string) {
    const TARJETA: any = {
      titular:this.form.value.titular,
      numeroTarjeta:this.form.value.numeroTarjeta,
      fechaExpiracion:this.form.value.fechaExpiracion,
      cvv:this.form.value.cvv,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._tarjetaService.editarTarjeta(id, TARJETA)
    .then(() => {
      this.loading = false;
      this.toastr.info('Tarjeta Actualizada', 'Exito!');
      this.titulo = 'crear tarjeta';
      this.form.reset();
      this.id = undefined
    })
    .catch(() => {
      this.toastr.error('Opss... Ha ocurrido un error', 'Error')
    })
  }


  crearTarjeta() {

    this.loading = true;
    const TARJETA: TarjetaCredito = {
      titular:this.form.value.titular,
      numeroTarjeta:this.form.value.numeroTarjeta,
      fechaExpiracion:this.form.value.fechaExpiracion,
      cvv:this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this._tarjetaService.guardarTarjeta(TARJETA)
    .then(() => {
      this.loading = false;
      this.toastr.success('Su tarjeta fue registrada Con Exito', 'Targeta agregada!', {
        progressAnimation: 'increasing'
      });
      this.form.reset();
    })
    .catch(() => {
      this.loading = false;
      this.toastr.error('Opss... Ha ocurrido un error', 'Error')
    })
  }
  onChangeInput(event: HTMLInputElement) {
    
    if(event.value.length === 4 || event.value.length === 9 || event.value.length === 14) {
      event.value += '-';
    }
  }
  inputChangeExpiracion(event: HTMLInputElement) {
    if(event.value.length === 2) {
      event.value += '/'
    }
  }

}
