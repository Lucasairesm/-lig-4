import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './jogo-da-velha.component.html',
  styleUrls: ['./jogo-da-velha.component.scss'],
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, TranslateModule]
})
export class JogoDaVelhaComponent implements OnInit {
  public mensagemDialogo = '';
  public mostrarDialogo = false;

  constructor(
    public gameService: GameService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Configurar idioma
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translate.use(savedLang);

    // Carregar parâmetros dos jogadores e inicializar o jogo
    this.route.queryParams.subscribe((params) => {
      const player1 = params['player1'] || 'Player 1';
      const player2 = params['player2'] || (params['mode'] === 'pvp' ? 'Player 2' : 'CPU');
      const player1Color = params['player1Color'] || '#ff0000';
      const player2Color = params['player2Color'] || '#0000ff';

      // Inicializar jogadores
      this.gameService.setPlayers([
        { nome: player1, cor: player1Color, pontos: 0 },
        { nome: player2, cor: player2Color, pontos: 0 }
      ]);

      // Definir o modo de jogo como Tic-Tac-Toe
      this.gameService.setGameMode('tictactoe');
    });
  }

  // Função para manipular jogadas
  manipularCliqueCelula(indiceColuna: number, indiceLinha: number): void {
    if (this.gameService.board[indiceLinha][indiceColuna] === '') {
      const jogadorAtual = this.gameService.currentPlayer.value;

      if (jogadorAtual) {
        this.gameService.board[indiceLinha][indiceColuna] = jogadorAtual.cor;

        if (this.gameService.checkVictory(indiceLinha, indiceColuna)) {
          this.mensagemDialogo = `${jogadorAtual.nome} ${this.translate.instant('won')}!`;
          this.mostrarDialogo = true;
        } else if (this.gameService.checkTie()) {
          this.mensagemDialogo = this.translate.instant('draw');
          this.mostrarDialogo = true;
        } else {
          this.gameService.switchPlayer();
        }
      }
    }
  }

  // Reiniciar o jogo
  reiniciarJogo(): void {
    this.gameService.resetBoard();
    this.mostrarDialogo = false;
  }

  // Voltar para a tela inicial
  voltarParaHome(): void {
    this.mostrarDialogo = false;
    this.router.navigate(['/home']);
  }
}
