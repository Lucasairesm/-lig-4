import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public boardSize = { columns: 7, rows: 6 };  // Tamanho padrão: 7x6
  public board: string[][] = [];  // Estado do tabuleiro
  public players: Player[] = [];  // Lista de jogadores
  public currentPlayer = new BehaviorSubject<Player | null>(null);  // Jogador atual
  public objective = 4;  // Conectar 4 para vencer
  public moveHistory: { row: number, col: number, player: Player }[] = [];  // Histórico de jogadas

  constructor() {
    this.resetBoard();  // Inicializa o tabuleiro vazio ao criar o serviço
  }

  // Define o modo de jogo (Connect 4 ou Jogo da Velha)
  setGameMode(mode: 'connect4' | 'tictactoe'): void {
    if (mode === 'tictactoe') {
      this.boardSize = { columns: 3, rows: 3 };
      this.objective = 3;
    } else {
      this.boardSize = { columns: 7, rows: 6 };
      this.objective = 4;
    }
    this.resetBoard();
  }

  // Define os jogadores e garante que as cores sejam diferentes
  setPlayers(players: Player[]): void {
    if (players[0].cor === players[1].cor) {
      console.error('Os jogadores não podem ter a mesma cor!');
      return;
    }
    this.players = players;
    this.currentPlayer.next(this.players[0]);  // Define o jogador 1 como inicial
  }

  // Retorna o estado atual do tabuleiro
  getBoard(): string[][] {
    return this.board;
  }

  // Alterna entre os jogadores
  switchPlayer(): void {
    const currentPlayerIndex = this.players.findIndex(p => p === this.currentPlayer.value);
    const nextPlayer = this.players[(currentPlayerIndex + 1) % this.players.length];
    this.currentPlayer.next(nextPlayer);
  }

  // Reinicia o tabuleiro
  resetBoard(): void {
    this.board = Array.from({ length: this.boardSize.rows }, () => Array(this.boardSize.columns).fill(''));
    this.moveHistory = [];  // Limpa o histórico de jogadas
  }

  getAvailableRow(col: number): number {
    for (let row = this.boardSize.rows - 1; row >= 0; row--) {
      if (this.board[row][col] === '') {
        return row;
      }
    }
    return -1; // Coluna cheia
  }

  // Verifica se houve um empate (tabuleiro cheio sem vencedores)
  checkTie(): boolean {
    return this.board.every(row => row.every(cell => cell !== ''));
  }

  // Verifica se houve vitória com base no último movimento (linha e coluna)
  checkVictory(rowIndex: number, colIndex: number): boolean {
    const currentColor = this.currentPlayer.value?.cor;
    if (!currentColor) return false;

    // Verifica horizontal, vertical, diagonal principal e diagonal secundária
    return this.checkHorizontal(rowIndex, currentColor) ||
           this.checkVertical(colIndex, currentColor) ||
           this.checkDiagonal(rowIndex, colIndex, currentColor);
  }

  // Verifica a vitória horizontal
  public checkHorizontal(row: number, color: string): boolean {
    let count = 0;
    for (let col = 0; col < this.boardSize.columns; col++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === this.objective) return true;
    }
    return false;
  }

  // Verifica a vitória vertical
  public checkVertical(col: number, color: string): boolean {
    let count = 0;
    for (let row = 0; row < this.boardSize.rows; row++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === this.objective) return true;
    }
    return false;
  }

  // Verifica a vitória diagonal (tanto a principal quanto a secundária)
  public checkDiagonal(row: number, col: number, color: string): boolean {
    return this.checkDiagonalPrincipal(row, col, color) ||
           this.checkDiagonalSecundaria(row, col, color);
  }

  // Diagonal ↘
  public checkDiagonalPrincipal(row: number, col: number, color: string): boolean {
    let count = 0;
    let r = row, c = col;

    // Move para o início da diagonal (↘)
    while (r > 0 && c > 0) {
      r--; c--;
    }

    // Verifica a diagonal
    while (r < this.boardSize.rows && c < this.boardSize.columns) {
      count = this.board[r][c] === color ? count + 1 : 0;
      if (count === this.objective) return true;
      r++; c++;
    }
    return false;
  }

  // Diagonal ↙
  public checkDiagonalSecundaria(row: number, col: number, color: string): boolean {
    let count = 0;
    let r = row, c = col;

    // Move para o início da diagonal (↙)
    while (r > 0 && c < this.boardSize.columns - 1) {
      r--; c++;
    }

    // Verifica a diagonal
    while (r < this.boardSize.rows && c >= 0) {
      count = this.board[r][c] === color ? count + 1 : 0;
      if (count === this.objective) return true;
      r++; c--;
    }
    return false;
  }

  // Adiciona uma jogada ao histórico
  addMoveToHistory(row: number, col: number): void {
    const currentPlayer = this.currentPlayer.value;
    if (currentPlayer) {
      this.moveHistory.push({ row, col, player: currentPlayer });
    }
  }

  // Função para resetar todos os estados
  resetAll(): void {
    this.players = [];  // Reseta os jogadores
    this.currentPlayer.next(null);  // Reseta o jogador atual
    this.board = [];  // Reseta o tabuleiro
    this.moveHistory = [];  // Reseta o histórico de movimentos
    this.objective = 4;  // Restaura o objetivo padrão para Connect 4
    this.boardSize = { columns: 7, rows: 6 };  // Restaura o tamanho padrão do tabuleiro para Connect 4
  }
}
