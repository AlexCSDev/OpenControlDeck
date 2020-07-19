import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ElementPosition } from '../../interfaces/controllerInterfaces';

@Component({
  selector: 'screensaver',
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.scss']
})
export class ScreensaverComponent implements OnInit, OnDestroy {
  @Input() enabled: boolean;
  screensaverOn: boolean;
  timer: any;
  clockTimer: any;
  clock = new Date();
  screensaverClockPos: ElementPosition;
  timerCleared:boolean;
  screensaverStyle: object = {}
  screensaverParams: object = {}
  
  constructor() { 
    this.clockTimer = setInterval(() => {
      this.clock = new Date();
    }, 1000);

  this.screensaverClockPos = { x:0, y:0 };

  this.screensaverStyle = {
    'position': 'fixed',
    'width': '100vw',
    'height': '105vh',
    'z-index': -1,
    'top': 0,
    'left': 0,
    'right': 0,
    'bottom': 0,
    'overflow': 'hidden'
  };

  this.screensaverParams = {
    particles: {
        number: {
            value: 50,
        },
        color: {
            value: 'random'
        },
        shape: {
            type: ['circle']
        },
      }
  };

  this.screensaverOn = false;
  this.timerCleared = false;
  }

  ngOnInit() {
    this.handleClick();
  }

  ngOnDestroy() { 
    clearInterval(this.timer);
    clearInterval(this.clockTimer);
   }

   
  private handleScreenSaverTimer() {
    if(!this.screensaverOn) {
      this.screensaverOn = true;
    }

    this.screensaverClockPos = { x: Math.floor(2 + (Math.random() * 64)), y: Math.floor(2 + (Math.random() * 68)) };
  }

  handleClick() {
    console.log("handle click");
    if(!this.enabled) {
      if(!this.timerCleared) {
        clearInterval(this.timer);
        this.timerCleared = true;
        this.screensaverOn = false;
      }
      return;
    }
    this.screensaverOn = false;
    clearInterval(this.timer);
    this.timerCleared = false;
    this.timer = setInterval(this.handleScreenSaverTimer.bind(this), 60*1000);
  }
}
