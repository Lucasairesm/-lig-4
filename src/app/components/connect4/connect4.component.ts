import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CPUService } from '../../services/cpu.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-connect4',
  templateUrl: './connect4.component.html',
  styleUrls: ['./connect4.component.scss'],
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, TranslateModule]
})
export class Connect4Component implements OnInit {
  public mensagemDialogo = '';
  public mostrarDialogo = false;
  public isCpuTurn = false;

  constructor(
    public gameService: GameService,
    public cpuService: CPUService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translate.use(savedLang);

    this.route.queryParams.subscribe((params) => {
      const player1 = params['player1'] || 'Player 1';
      const player2 = params['player2'] || (params['mode'] === 'pvp' ? 'Player 2' : 'CPU');
      const player1Color = params['player1Color'] || '#ff0000';
      const player2Color = params['player2Color'] || '#0000ff';

      this.gameService.setPlayers([
        { nome: player1, cor: player1Color, pontos: 0 },
        { nome: player2, cor: player2Color, pontos: 0 }
      ]);
      this.gameService.setGameMode('connect4');
    });
  }

  // Função que lida com o movimento do jogador e da CPU
  manipularCliqueColuna(indiceColuna: number): void {
    if (this.isCpuTurn) return;  // Bloqueia jogada do humano enquanto CPU joga

    const linhaDisponivel = this.obterLinhaDisponivel(indiceColuna);

    if (linhaDisponivel !== -1) {
      const jogadorAtual = this.gameService.currentPlayer.value;

      if (jogadorAtual) {
        this.gameService.board[linhaDisponivel][indiceColuna] = jogadorAtual.cor;

        // Verificação de vitória ou empate
        if (this.gameService.checkVictory(linhaDisponivel, indiceColuna)) {
          this.mensagemDialogo = `${jogadorAtual.nome} ${this.translate.instant('won')}!`;
          this.mostrarDialogo = true;
        } else if (this.gameService.checkTie()) {
          this.mensagemDialogo = this.translate.instant('draw');
          this.mostrarDialogo = true;
        } else {
          this.gameService.switchPlayer();

          const cpuPlayer = this.gameService.currentPlayer.value;
          if (cpuPlayer && cpuPlayer.nome === 'CPU') {
            this.isCpuTurn = true;
            setTimeout(() => {
              this.cpuService.cpuMoveConnect4();

              // Verifica vitória ou empate do CPU
              const lastMove = this.gameService.moveHistory[this.gameService.moveHistory.length - 1];
              if (this.gameService.checkVictory(lastMove.row, lastMove.col)) {
                this.mensagemDialogo = `CPU ${this.translate.instant('won')}!`;
                this.mostrarDialogo = true;
              } else if (this.gameService.checkTie()) {
                this.mensagemDialogo = this.translate.instant('draw');
                this.mostrarDialogo = true;
              } else {
                this.gameService.switchPlayer();
                this.isCpuTurn = false;
              }
            }, 1000);  // Delay de 1 segundo para a CPU jogar
          }
        }
      }
    }
  }

  // Obter linha disponível na coluna clicada
  obterLinhaDisponivel(indiceColuna: number): number {
    for (let linha = this.gameService.boardSize.rows - 1; linha >= 0; linha--) {
      if (this.gameService.board[linha][indiceColuna] === '') {
        return linha;
      }
    }
    return -1;
  }

  reiniciarJogo(): void {
    this.gameService.resetBoard();
    this.mostrarDialogo = false;
  }

  voltarParaHome(): void {
    this.gameService.resetBoard();
    this.mostrarDialogo = false;
    this.router.navigate(['/home']);
  }
}
