import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/models';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';  
import { Button } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  standalone: true,
  imports: [CommonModule, ToastModule, DialogModule, FormsModule,Button,ColorPickerModule,TranslateModule],
  providers: [MessageService]
})


export class GameBoardComponent implements OnInit {
  rows = Array.from({ length: 3 });
  columns = Array.from({ length: 3 });
  board: string[][] = [];
  currentPlayer!: Player | null;

  player1: Player = { name: 'Jogador 1', color: '#ff0000', score: 0 };
  player2: Player = { name: 'Jogador 2', color: '#0000ff', score: 0 };
  
  showDialog: boolean = false;
  showConfigDialog: boolean = true;
  dialogMessage: string = '';

  constructor(
    public gameService: GameService,
    public messageService: MessageService,
    // public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.board = this.gameService.getBoard();
    this.gameService.currentPlayer.subscribe(player => {
      this.currentPlayer = player;
    });
    // this.translate.setDefaultLang('pt');
  }

  changeLanguage(lang: string) {
    // this.translate.use(lang);  // Altera o idioma dinamicamente
  }

  handleColumnClick(colIndex: number): void {
    const availableRow = this.getAvailableRow(colIndex);
    if (availableRow !== -1) {
      if (this.currentPlayer) {
        this.board[availableRow][colIndex] = this.currentPlayer.color;
      }

      if (this.gameService.checkVictory(availableRow, colIndex)) {
        this.dialogMessage = `${this.currentPlayer!.name} venceu!`;
        this.showDialog = true;
      } else if (this.gameService.checkTie()) {
        this.dialogMessage = 'O jogo terminou em empate!';
        this.showDialog = true;
      } else {
        this.gameService.switchPlayer();
      }
    } else {
      this.showColumnFullMessage();
    }
  }

  getAvailableRow(colIndex: number): number {
    for (let row = this.board.length - 1; row >= 0; row--) {
      if (this.board[row][colIndex] === '') {
        return row;
      }
    }
    return -1;
  }

  getCellColor(rowIndex: number, colIndex: number): string {
    return this.board[rowIndex][colIndex] || '#FFF';
  }

  showColumnFullMessage(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Coluna cheia',
      detail: 'Essa coluna está cheia!',
      life: 3000
    });
  }

  resetGame(): void {
    this.gameService.resetBoard();  // Resetar o tabuleiro
    this.showDialog = false;  // Fechar o diálogo de vitória
  }  

  saveConfig(): void {
    this.gameService.setPlayers([this.player1, this.player2]);
    this.showConfigDialog = false; // Fecha o diálogo de configuração
  }
}
