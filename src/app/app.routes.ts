import { Routes } from '@angular/router';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { PlayerConfigComponent } from './components/player-config/player-config.component';

export const routes: Routes = [
  { path: '', component: PlayerConfigComponent },  // Tela inicial de configuração dos jogadores
  { path: 'game-board', component: GameBoardComponent }  // Tabuleiro de jogo
];
