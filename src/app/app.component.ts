import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from "./components/game-board/game-board.component";
import { RouterModule } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    GameBoardComponent,
    RouterModule,
  ]
})
export class AppComponent {

}
