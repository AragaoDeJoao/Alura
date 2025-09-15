import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Exercicios} from './exercicios/exercicios';
import {Aula} from './aula/aula';

@Component({
  selector: 'app-root',
  imports: [
    Exercicios,
    Aula
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
