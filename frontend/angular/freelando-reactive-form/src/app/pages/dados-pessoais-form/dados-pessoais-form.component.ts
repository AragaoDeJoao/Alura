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
import {async, BehaviorSubject, Observable, of, startWith, switchMap, tap} from 'rxjs';
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

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cadastroService = inject(CadastroService);
  private ibgeService = inject(IbgeService);
  dadosPessoaisForm!: FormGroup;
  estado$!: Observable<Estado[]>;
  cidade$!: Observable<Cidade[]>;

  carregandoCidades$ = new BehaviorSubject<boolean>(false)

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

  private carregarEstados(): void {
    console.log('Iniciando carregamento de estados');
    this.estado$ = this.ibgeService.getEstados().pipe(
      tap(estados => {
        console.log('Estados carregados:', estados);
        console.log('Total de estados:', estados.length);
      })
    );
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
          this.carregandoCidades$.next(false)
          return of([]);
        })
      )
    }
  }

  private resetarCidades() {
    this.dadosPessoaisForm.get('cidade')?.setValue('');
  }

  protected readonly async = async;
}

