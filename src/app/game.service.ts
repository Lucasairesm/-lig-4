import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public boardSize = { columns: 3, rows: 3 };  // 7 colunas, 6 linhas
  public board: string[][] = [];  // Tabuleiro 2D, cada célula é '' ou cor do jogador
  
  public players: Player[] = [];
  currentPlayer = new BehaviorSubject<Player | null>(null);

  constructor() {
    this.resetBoard();
  }

  // Define os jogadores
  setPlayers(players: Player[]): void {
    this.players = players;
    this.currentPlayer.next(this.players[0]);  // Define o primeiro jogador
    this.resetBoard();
  }

  // Retorna o tabuleiro atual
  getBoard(): string[][] {
    return this.board;
  }

  // Alterna para o próximo jogador
  switchPlayer(): void {
    const currentPlayerIndex = this.players.findIndex(p => p === this.currentPlayer.value);
    const nextPlayer = this.players[(currentPlayerIndex + 1) % this.players.length];
    this.currentPlayer.next(nextPlayer);
  }

  // Reseta o tabuleiro
  resetBoard(): void {
    this.board = Array.from({ length: this.boardSize.rows }, () => Array(this.boardSize.columns).fill(''));
  }

  // Verifica se houve vitória após a última jogada
  checkVictory(rowIndex: number, colIndex: number): boolean {
    const currentColor = this.currentPlayer.value?.color;
    if (!currentColor) return false;

    // Verificar linha, coluna e diagonais para 4 peças consecutivas
    return this.checkHorizontal(rowIndex, currentColor) ||
           this.checkVertical(colIndex, currentColor) ||
           this.checkDiagonal(rowIndex, colIndex, currentColor);
  }

  // Verifica empate (tabuleiro cheio sem vencedores)
  checkTie(): boolean {
    return this.board.every(row => row.every(cell => cell !== ''));
  }

  // Verificação Horizontal
  public checkHorizontal(row: number, color: string): boolean {
    let count = 0;
    for (let col = 0; col < this.boardSize.columns; col++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === 3) return true; // Encontrou 4 consecutivos
    }
    return false;
  }

  public checkVertical(col: number, color: string): boolean {
    let count = 0;
    for (let row = 0; row < this.boardSize.rows; row++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === 3) return true; // Encontrou 4 consecutivos
    }
    return false;
  }
  

  // Verificação Diagonal (principais e secundárias)
  public checkDiagonal(row: number, col: number, color: string): boolean {
    return this.checkDiagonalPrincipal(row, col, color) || this.checkDiagonalSecundaria(row, col, color);
  }

  public checkDiagonalPrincipal(row: number, col: number, color: string): boolean {
    let count = 0;
    let r = row, c = col;
    
    // Move para o topo da diagonal (esquerda superior ↘)
    while (r > 0 && c > 0) { 
      r--; 
      c--; 
    }
    
    // Percorre a diagonal (↘)
    while (r < this.boardSize.rows && c < this.boardSize.columns) {
      count = this.board[r][c] === color ? count + 1 : 0;
      if (count === 3) return true; // Encontrou 4 consecutivos
      r++; 
      c++;
    }
    return false;
  }
  
  public checkDiagonalSecundaria(row: number, col: number, color: string): boolean {
    let count = 0;
    let r = row, c = col;
  
    // Move para o topo da diagonal (direita superior ↙)
    while (r > 0 && c < this.boardSize.columns - 1) { 
      r--; 
      c++; 
    }
    
    // Percorre a diagonal (↙)
    while (r < this.boardSize.rows && c >= 0) {
      count = this.board[r][c] === color ? count + 1 : 0;
      if (count === 3) return true; // Encontrou 4 consecutivos
      r++; 
      c--;
    }
    return false;
  }
  
}
