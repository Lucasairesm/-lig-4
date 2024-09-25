import { Injectable } from '@angular/core';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class CPUService {

  constructor(private gameService: GameService) {}

  // Função para a CPU fazer um movimento no Connect4
  cpuMoveConnect4(): void {
    const availableColumns = this.getAvailableColumns();

    if (availableColumns.length > 0) {
      const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      const availableRow = this.gameService.getAvailableRow(randomCol);

      this.gameService.board[availableRow][randomCol] = this.gameService.currentPlayer.value!.cor;
      this.gameService.addMoveToHistory(availableRow, randomCol);

      // A CPU não lida com mensagens, só a lógica de jogo
      if (!this.gameService.checkVictory(availableRow, randomCol) && !this.gameService.checkTie()) {
        this.gameService.switchPlayer();  // Continua o jogo
      }
    }
  }

  // Movimentos para TicTacToe
  cpuMoveTicTacToe(): void {
    const availableCells = this.getAvailableCells();

    if (availableCells.length > 0) {
      const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
      this.gameService.board[randomCell.row][randomCell.col] = this.gameService.currentPlayer.value!.cor;
      this.gameService.addMoveToHistory(randomCell.row, randomCell.col);

      if (!this.gameService.checkVictory(randomCell.row, randomCell.col) && !this.gameService.checkTie()) {
        this.gameService.switchPlayer();
      }
    }
  }

  // Funções auxiliares de coluna e células disponíveis
  private getAvailableColumns(): number[] {
    const availableColumns: number[] = [];
    for (let col = 0; col < this.gameService.boardSize.columns; col++) {
      if (this.gameService.getAvailableRow(col) !== -1) {
        availableColumns.push(col);
      }
    }
    return availableColumns;
  }

  private getAvailableCells(): { row: number, col: number }[] {
    const availableCells: { row: number, col: number }[] = [];
    for (let row = 0; row < this.gameService.boardSize.rows; row++) {
      for (let col = 0; col < this.gameService.boardSize.columns; col++) {
        if (this.gameService.board[row][col] === '') {
          availableCells.push({ row, col });
        }
      }
    }
    return availableCells;
  }
}
