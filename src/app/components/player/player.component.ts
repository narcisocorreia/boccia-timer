import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GameService, Player } from '../../services/game.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @Input() player: Player | undefined;
  @Input() score: number | undefined = 0;
  @Input() color: 'red' | 'blue' = 'red';

  timerRunning: boolean = false;
  timerInterval: any;
  timer: number = 60;

  iconStates: boolean[] = Array(6).fill(false);

  constructor(private gameService: GameService) {}

  ngOnInit() {
    if (this.player) {
      this.timer = this.player.timer;
    }
  }

  get formattedTimer(): string {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleTimer() {
    if (this.timerRunning) {
      clearInterval(this.timerInterval);
    } else {
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.timerInterval);
          this.timerRunning = false;
        }
      }, 1000);
    }
    this.timerRunning = !this.timerRunning;
  }

  increment() {
    if (this.color === 'red') {
      this.gameService.updateRedPlayerScore(this.player!.score + 1);
    } else {
      this.gameService.updateBluePlayerScore(this.player!.score + 1);
    }
  }

  decrement() {
    if (this.player!.score > 0) {
      if (this.color === 'red') {
      this.gameService.updateRedPlayerScore(this.player!.score - 1);
      } else {
      this.gameService.updateBluePlayerScore(this.player!.score - 1);
      }
    }
  }

  // Toggle ball icon state
  toggleIcon(index: number) {
    this.iconStates[index] = !this.iconStates[index];
  }

  resetEnd(): void {
    this.iconStates = Array(6).fill(false);
    this.timer = this.player!.timer;
  }
}
