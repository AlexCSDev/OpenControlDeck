import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'battery-indicator',
  templateUrl: './battery-indicator.component.html',
  styleUrls: ['./battery-indicator.component.scss']
})
export class BatteryIndicatorComponent implements OnInit {
  battery: any;
  noBattery: boolean;
  percentage: number;
  isCharging: boolean;
  private addedListeners: boolean;
  @Input('showText') showText: boolean;

  constructor() { }

  ngOnInit() {
    let navigatorObject: any = window.navigator;
    this.isCharging = false;
    this.percentage = 0;
    this.noBattery = false;
    this.addedListeners = false;
    if (navigatorObject.battery) {
      this.updateBattery(navigatorObject.battery);
    } else if (navigatorObject.getBattery) {
      navigatorObject.getBattery().then(function(battery) {
        this.updateBattery(battery);
      }.bind(this));
    } else {
      this.noBattery = true;
    }
  }

  updateBattery(battery: any) {
    this.battery = battery || this.battery;

    if(!this.addedListeners) {
      this.battery.addEventListener('chargingchange', function() {
        this.updateBattery();
      });

      this.battery.addEventListener('levelchange', function() {
        this.updateBattery();
      });
      this.addedListeners = true;
    }

    this.percentage = parseFloat((this.battery.level * 100).toFixed(2));
    this.isCharging = this.battery.charging;
  }

}
