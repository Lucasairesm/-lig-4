import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/models';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-config',
  templateUrl: './player-config.component.html',
  styleUrls: ['./player-config.component.scss'],
  standalone:true,
  imports:[ColorPickerModule,CommonModule,FormsModule,ButtonModule]
})
export class PlayerConfigComponent {
  player1: Player = { name: '', color: '#ff0000', score: 0 };
  player2: Player = { name: '', color: '#0000ff', score: 0 };

  constructor(private gameService: GameService, private router: Router) {}

  saveConfig(): void {
    // Salva as configurações dos jogadores no GameService
    this.gameService.setPlayers([this.player1, this.player2]);

    // Redireciona para o tabuleiro (substitua o caminho pelo correto da sua aplicação)
    this.router.navigate(['/game-board']);
  }
}
