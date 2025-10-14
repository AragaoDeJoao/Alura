import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AbstractControl, AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors, ValidatorFn,
  Validators
} from '@angular/forms';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {Router} from '@angular/router';
import {CadastroService} from '../../shared/services/cadastro.service';
import {BehaviorSubject, Observable, of, startWith, switchMap, tap} from 'rxjs';
import {Cidade, Estado} from '../../shared/models/ibge.interface';
import {IbgeService} from '../../shared/services/ibge.service';

@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss'],
})


export class DadosPessoaisFormComponent implements OnInit {

  dadosPessoaisForm!: FormGroup;


  estados$!: Observable<Estado[]>;
  cidade$!: Observable<Cidade[]>;

  carregandoCidades$ = new BehaviorSubject<boolean>(false)

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cadastroService = inject(CadastroService);
  private ibgeService = inject(IbgeService);

  ngOnInit() {
    this.dadosPessoaisForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required]
    })
    this.carregarEstados();
    this.configurarListenerEstado();
  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/areaAtuacao'])
  }

  onProximo(): void {
    if (this.dadosPessoaisForm.valid) {
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    } else {
      this.dadosPessoaisForm.markAllAsTouched()
    }
  }

  private salvarDadosAtuais() {
    const formValue = this.dadosPessoaisForm.value;
    this.cadastroService.updateCadastroData({
      nomeCompleto: formValue.nomeCompleto,
      estado: formValue.estado,
      cidade: formValue.cidade,
      email: formValue.email,
      senha: formValue.senha
    })
  }

  private carregarEstados() {
    this.estados$ = this.ibgeService.getEstados();
  }

  private configurarListenerEstado() {
    const estadoControl = this.dadosPessoaisForm.get('estado');
    if (estadoControl) {
      this.cidade$ = estadoControl.valueChanges.pipe(
        startWith(''), tap(() => {
          this.resetarCidades();
          this.carregandoCidades$.next(true);
        }), switchMap(uf => {
          if (uf) {
            return this.ibgeService.getCidadesPorEstado(uf).pipe(
              tap(() => this.carregandoCidades$.next(false)));
          }
          return of([]);
        })
      )
    }
  }

  private resetarCidades() {
    this.dadosPessoaisForm.get('cidade')?.setValue('');
  }

}

