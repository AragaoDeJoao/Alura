import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {Router} from '@angular/router';
import {CadastroService} from '../../shared/services/cadastro.service';

@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss']
})
export class DadosPessoaisFormComponent implements OnInit {

  dadosPessoaisForm!: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cadastroService = inject(CadastroService);

  ngOnInit() {
    this.dadosPessoaisForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      estado: ['', Validators.required],
      cidade:['', Validators.required],
      email:['', Validators.required],
      senha:['', Validators.required],
      repitaSenha: ['', Validators.required],
    })
  }

  onAnterior(): void {}

  onProximo(): void {}
}
