import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/models';

@Injectable({
  providedIn: 'root' // Singleton na aplicação standalone
})
export class GameService {
  public boardSize = { columns: 3, rows: 3 };  // Tamanho padrão do tabuleiro: 7 colunas e 6 linhas
  public board: string[][] = [];  // Estado do tabuleiro (array bidimensional)
  
  public players: Player[] = [];  // Lista de jogadores
  currentPlayer = new BehaviorSubject<Player | null>(null);  // Jogador atual
  
  constructor() {
    this.resetBoard();  // Inicializa o tabuleiro vazio ao criar o serviço
  }

  // Define os jogadores
  setPlayers(players: Player[]): void {
    this.players = players;
    this.currentPlayer.next(this.players[0]);  // O primeiro jogador será o jogador 1 após as configurações
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

  resetBoard(): void {
    this.board = [...Array.from({ length: this.boardSize.rows }, () => Array(this.boardSize.columns).fill(''))];
  }

  // Verifica se houve um empate (tabuleiro cheio sem vencedores)
  checkTie(): boolean {
    return this.board.every(row => row.every(cell => cell !== ''));
  }

  checkVictory(rowIndex: number, colIndex: number): boolean {
    const currentColor = this.currentPlayer.value?.color;
    if (!currentColor) return false;
  
    // Verifica horizontal, vertical, diagonal principal e diagonal secundária
    return this.checkHorizontal(rowIndex, currentColor) ||
           this.checkVertical(colIndex, currentColor) ||
           this.checkDiagonal(rowIndex, colIndex, currentColor);
  }
  

  public checkHorizontal(row: number, color: string): boolean {
    let count = 0;
    for (let col = 0; col < this.boardSize.columns; col++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === 3) return true;  // 4 consecutivos encontrados
    }
    return false;
  }
  
  public checkVertical(col: number, color: string): boolean {
    let count = 0;
    for (let row = 0; row < this.boardSize.rows; row++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === 3) return true;  // 4 consecutivos encontrados
    }
    return false;
  }
  

// Verificação diagonal
public checkDiagonal(row: number, col: number, color: string): boolean {
  return this.checkDiagonalPrincipal(row, col, color) || 
         this.checkDiagonalSecundaria(row, col, color);
}

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
    if (count === 3) return true;  // 4 consecutivos encontrados
    r++; c++;
  }
  return false;
}

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
    if (count === 3) return true;  // 4 consecutivos encontrados
    r++; c--;
  }
  return false;
}

}