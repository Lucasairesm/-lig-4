import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [ButtonModule, TranslateModule, CommonModule, FormsModule, InputTextModule, ColorPickerModule],
})
export class HomeComponent implements OnInit {
  selectedGame: 'connect4' | 'tictactoe' = 'connect4'; // Jogo inicial
  selectedMode: 'pvp' | 'cpu' = 'pvp'; // Modo de jogo inicial
  player1Name: string = 'Isaac'; // Nome do Player 1
  player2Name: string = this.selectedMode === 'cpu' ? 'CPU' : 'Davi';
  player1Color: string = '#ff0000'; // Cor do Player 1
  player2Color: string = '#0000ff'; // Cor do Player 2

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private gameService : GameService
  ) {}

  // Trocar o idioma e armazenar no localStorage
  setLanguage(lang: string): void {
    this.translateService.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  // Recupera o idioma salvo do localStorage
  ngOnInit(): void {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateService.use(savedLanguage);
  }

  // Validação para habilitar o botão Start
  canStartGame(): boolean {
    if (this.selectedMode === 'pvp') {
      return this.player1Name.trim() !== '' && this.player2Name.trim() !== ''; // Verifica ambos os nomes
    } else {
      return this.player1Name.trim() !== ''; // Verifica apenas o nome do Player 1
    }
  }

  selectGame(game: 'connect4' | 'tictactoe'): void {
    this.selectedGame = game;
  }

  // Selecionar o modo de jogo (PvP ou CPU)
  selectMode(mode: 'pvp' | 'cpu'): void {
    this.selectedMode = mode;
    this.player2Name = mode === 'cpu' ? 'CPU' : ''; // Definir player 2 como CPU automaticamente
  }

  // Iniciar o jogo e passar os dados via queryParams
  startGame(): void {
    this.gameService.resetAll(); // Garantir que o estado do jogo esteja resetado antes de iniciar

    // Redirecionar para o jogo selecionado com cores e nomes dos jogadores
    this.router.navigate([`/${this.selectedGame}`], {
      queryParams: {
        mode: this.selectedMode,
        player1: this.player1Name,
        player2: this.player2Name,
        player1Color: this.player1Color,
        player2Color: this.selectedMode === 'pvp' ? this.player2Color : null, // Somente PvP tem player 2
      },
    });
  }
}
