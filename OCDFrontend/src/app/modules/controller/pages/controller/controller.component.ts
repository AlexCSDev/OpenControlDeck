import { Component, OnInit, Inject, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType, GridsterItemComponentInterface} from 'angular-gridster2';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dashboard, DashboardItem, DashboardItemType, ElementPosition } from '../../interfaces/controllerInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { EditControllerComponent } from '../../components/edit-controller/edit-controller.component';
import { isDefined } from '@angular/compiler/src/util';
import { EditDashboardControllerComponent } from '../../components/edit-dashboard-controller/edit-dashboard-controller.component';
import { MatSelectChange } from '@angular/material/select';
import { ScreensaverComponent } from '../../components/screensaver/screensaver.component';

@Component({
  selector: 'controller-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit, OnDestroy {
  screensaverEnabled: boolean;
  @ViewChild(ScreensaverComponent, {static:false}) screensaver:ScreensaverComponent;

  clockTimer: any;
  clock = new Date();
  
  options: GridsterConfig;
  dashboard: Dashboard;
  dashboardsList: Array<Dashboard>;
  items: Array<GridsterItem>;
  dashboardItemType = DashboardItemType;
  editMode: boolean;

  itemChange(item, itemComponent) {
    if(this.editMode) {
      item.changed = true;
    }
  }

  itemResize(item, itemComponent) {
    if(this.editMode) {
      item.changed = true;
    }
    return false;
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }
  
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, 
  private route: ActivatedRoute, private router: Router, private location: Location, private _snackBar: MatSnackBar, private dialog: MatDialog) {
    this.editMode = false;
    this.dashboard = {id: -1, name: "Loading", items: []};
  
    this.options = {
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.itemResize,
      gridType: GridType.Fixed,
      fixedColWidth: 128,
      fixedRowHeight: 128,
      displayGrid: DisplayGrid.OnDragAndResize,
      draggable: {
        enabled: this.editMode,
      },
      resizable: {
        enabled: this.editMode
      },
      pushItems: this.editMode
    };

    this.screensaverEnabled = true;

    this.clockTimer = setInterval(() => {
      this.clock = new Date();
    }, 1000);
   }

  ngOnInit() {
    const dashboardId = parseInt(this.route.snapshot.paramMap.get('dashboard'));

    this.reloadDashboards();
    this.loadDashboard(dashboardId > 0 ? dashboardId : 1);
  }

  ngOnDestroy() { 
    clearInterval(this.clockTimer);
   }

  ngAfterViewInit() {
    // child is set
    this.screensaver.handleClick();
  }

  reloadDashboards() {
    this.http.get<Array<Dashboard>>(this.baseUrl + 'dashboards').subscribe(result => {
      this.dashboardsList = result;
    }, error => this.onError(error)); 
  }

  loadDashboard(dashboardId: number = 1): any {
    this.dashboard = {id: -1, name: "Loading", items: []};
    this.items = [];
    this.http.get<Dashboard>(this.baseUrl + 'dashboards/' + dashboardId).subscribe(result => {
      this.dashboard = result;
      this.items = [];
      this.dashboard.items.forEach(item => {
        this.items.push({cols: item.sizeX, rows: item.sizeY, x: item.posX, y: item.posY, dashboardItem: item, deleted: false, changed: false, new: false, moved: false});
      });
      this.dashboard.items = [];
      this.location.go('/controller/' + dashboardId);
    }, error => this.onError(error));
  }

  selectedDashboardChanged(object: MatSelectChange) {
    console.log("change");
    this.loadDashboard(object.value);
  }

  buttonClicked(item: GridsterItem) {
    try {
        let dashboardItem = item.dashboardItem as DashboardItem;
        if(dashboardItem.itemType != DashboardItemType.Button || this.editMode) {
          return;
        }

        switch(dashboardItem.commandName) {
          case "httpget":
            this.http.get<Dashboard>(dashboardItem.commandValue).subscribe(result => this.onSuccess("Successfully executed http get command for "+dashboardItem.text, result), error => this.onError(error));
            break;

          case "goto":
            this.loadDashboard(parseInt(dashboardItem.commandValue));
            break;

          default:
            this.http.post(this.baseUrl + 'commands/'+dashboardItem.commandName.toLowerCase(), JSON.parse(dashboardItem.commandValue)).subscribe(result => this.onSuccess("Successfully executed "+dashboardItem.commandName+" command for "+dashboardItem.text, result), error => this.onError(error));
            break;
        }  
    }
    catch(e) {
      this._snackBar.open("Error occured: "+e, "Close", {
        panelClass: ['snackbarError']
      });
    }
  }

  onSlideToggle(object: MatSlideToggleChange) {
    this.onEditChange(object.checked);
  }

  onEditChange(editValue: boolean) {
    this.editMode = editValue;
    this.options.draggable.enabled = this.editMode;
    this.options.resizable.enabled = this.editMode;
    this.options.displayGrid = editValue ? DisplayGrid.Always : DisplayGrid.OnDragAndResize;
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
    if(!this.editMode) {
      this.items.forEach(item => {
        if(item.deleted || item.moved) {
          if(!item.new && !item.moved) {
            this.http.delete(this.baseUrl + 'dashboardItems/' + item.dashboardItem.id).subscribe(result => {
              this.onSuccess("Successfully deleted item: "+item.dashboardItem.text, result);
            }, error => this.onError(error));
          } else {
            if(item.moved) {
              this.http.put(this.baseUrl + 'dashboardItems/' + item.dashboardItem.id, item.dashboardItem).subscribe(result => this.onSuccess("Successfully moved "+item.dashboardItem.text, result), error => this.onError(error));
            } else {
              this.onSuccess("Successfully deleted item: "+item.dashboardItem.text, "not in db");
            }
          }

          this.items = this.items.filter(arrItem => arrItem !== item);
          return;
        }
        if(item.changed || item.new) {
          item.dashboardItem.sizeX = item.cols;
          item.dashboardItem.sizeY = item.rows;
          item.dashboardItem.posX = item.x;
          item.dashboardItem.posY = item.y;
          if(item.changed && !item.new) {
            this.http.put(this.baseUrl + 'dashboardItems/' + item.dashboardItem.id, item.dashboardItem).subscribe(result => this.onSuccess("Successfully saved "+item.dashboardItem.text, result), error => this.onError(error));
          }
          if(item.new) {
            this.http.post(this.baseUrl + 'dashboardItems', item.dashboardItem).subscribe(result => {
              item.dashboardItem = result;
              this.onSuccess("Successfully created new item "+item.dashboardItem.text, result);
            }, error => this.onError(error));
          }
          item.changed = false;
          item.new = false;
        }
      });
    }
  }

  private findFreeSpace() {
    let x = 0;
    let y = 0;
    this.items.forEach(item => {
      x = item.x + 1;
      y = item.y;
    });

    return {x: x, y: y};
  }

  openEditDialog(item: GridsterItem) {
    let newItem = false;
    if(!isDefined(item)) {
      let freeSpace = this.findFreeSpace();
      let dashboardItem: DashboardItem;
      dashboardItem = {id: undefined, dashboardId: this.dashboard.id, itemType: DashboardItemType.Button, text: "", posX: freeSpace.x, posY: freeSpace.y, sizeX: 1, sizeY: 1, commandName: "httpget", commandValue: "", image: ""};
      item = {cols: 1, rows: 1, x: freeSpace.x, y: freeSpace.y, dashboardItem: dashboardItem, deleted: false, changed: false, new: true, moved: false};
      newItem = true;
    }
    let dialogRef = this.dialog.open(EditControllerComponent, {
      height: '800px',
      width: '600px',
      data: {item: item}
    });
    dialogRef.afterClosed().subscribe(item => {
      if(isDefined(item)) {
        item.cols = item.dashboardItem.sizeX;
        item.rows = item.dashboardItem.sizeY;
        item.x = item.dashboardItem.posX;
        item.y = item.dashboardItem.posY;
        if(!item.new) {
          item.changed = true;
        } else {
          this.items.push(item);
        }
      }
    });
  }

  deleteItem(item) {
    let confirmed = confirm("Are you sure you want to delete "+item.dashboardItem.text+"?");
    if(confirmed) { 
      item.deleted = true;
    }
  }

  moveItem(item) {
    let result = prompt("Enter dashboard id where this item should be moved to");
    let id = parseInt(result);
    if(id <= 0) {
      alert('Invalid dashboard id');
      return;
    }
    if(result !== null) { 
      item.moved = true;
      item.dashboardItem.dashboardId = id;
    }
  }

  copyItem(item) {
    let result = prompt("Enter dashboard id where this item should be copied to");
    let id = parseInt(result);
    if(id <= 0) {
      alert('Invalid dashboard id');
      return;
    }
    if(result !== null) { 
      let copy = Object.assign({}, item.dashboardItem);
      copy.id = undefined;
      copy.dashboardId = id; 
      this.http.post(this.baseUrl + 'dashboardItems', copy).subscribe(result => {
        this.onSuccess("Successfully copied "+item.dashboardItem.text, result);
      }, error => this.onError(error));
    }
  }

  newDashboard() {
    if(this.editMode) {
      alert("disable edit mode first");
      return;
    }
    let confirmed = confirm("Are you sure you want to create new dashboard?");
    if(confirmed) {
      this.http.post(this.baseUrl + 'dashboards', {name:'New dashboard'}).subscribe(result => {
        let newDashboard: Dashboard;
        newDashboard = result as Dashboard;
        this.reloadDashboards();
        this.loadDashboard(newDashboard.id);
        this.onSuccess("Successfully created new dashboard", result)
      }, error => this.onError(error));
    }
  }

  editDashboard() {
    let dialogRef = this.dialog.open(EditDashboardControllerComponent, {
      height: '800px',
      width: '600px',
      data: this.dashboard
    });
    dialogRef.afterClosed().subscribe(dashboard => {
      if(isDefined(dashboard)) {
        this.http.put(this.baseUrl + 'dashboards/' + this.dashboard.id, dashboard).subscribe(result => {
        this.reloadDashboards();
        this.onSuccess("Successfully edited dashboard", result)
        }, error => this.onError(error));
      }
    });
  }

  deleteDashboard() {
    let confirmed = confirm("Are you sure you want to delete this dashboard?");
    if(confirmed) {
      this.http.delete(this.baseUrl + 'dashboards/' + this.dashboard.id).subscribe(result => {
        this.reloadDashboards();
        this.onSuccess("Successfully deleted dashboard", result);
        this.loadDashboard(1);
      }, error => this.onError(error));
    }
  }

  reloadDashboard() {
    this.loadDashboard(this.dashboard.id);
  }

  onSuccess(message: string, result: any) {
    this._snackBar.open(message, "Close", {
      duration: 3000,
      panelClass: ['snackbarGreen']
    });
  }

  onError(error: HttpErrorResponse) {
    console.error(error);
    let msg = error.message;
    if(typeof(error.error) == "string") {
      msg = error.error
    }
    this._snackBar.open("Error occured: "+msg, "Close", {
      panelClass: ['snackbarError']
    });
  }

  onScreensaverToggle(object: MatSlideToggleChange) {
    this.screensaverEnabled = object.checked;
    //Hacky way to make sure that enough time has passed for angular to send component updates
    setInterval(function() {this.screensaver.handleClick()}.bind(this), 1*1000);
  }
}