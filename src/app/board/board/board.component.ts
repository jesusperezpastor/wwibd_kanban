import { Component, OnInit, ViewChild, NgZone, AfterViewInit, ElementRef } from '@angular/core';
import { ListSchema, TaskSchema } from './../../core';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { ListService } from 'src/app/core/services/listService/list.service';
import { BoardService } from 'src/app/core/services/boardService/board.service';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexYAxis, ApexXAxis, ApexDataLabels, ApexGrid } from "ng-apexcharts";
import { Chart } from 'chart.js';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';
import { UserService } from 'src/app/core/services/userService/user.service';
import { AppComponent } from 'src/app/app.component';

interface DropdownObject {
  name: string;
  value: string;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  template: `
    <canvas id="MyChart"></canvas>
  `
})

export class BoardComponent implements OnInit, AfterViewInit {
  lists: ListSchema[] = [];
  task!: TaskSchema;
  list!: ListSchema;
  listId!: string;

  isOverlayDisplayed = false;
  isOverlayListDisplayed = false;

  id!: string;
  subs: any;

  //Config data
  name: '' | undefined;
  createdBy: '' | undefined;
  dateCreation: string | undefined;
  dropdownListCycleTimeStart!: DropdownObject[];
  selectedCycleTimeStart!: string;
  dropdownListCycleTimeEnd!: DropdownObject[];
  selectedCycleTimeEnd!: string;

  // Lista de usuarios
  usersProject: any[] = [];
  usersPlatforms: any[] = [];

  selectedUsers: any[] = [];
  createdBydUser: any;
  selectedUser = "";

  //Plotted
  public chart: any;

  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  public context!: any;

  setTaskToChart(list: ListSchema[]) {
    if (list.length > 0) {


      const tasks = list
        .flatMap(l => l.tasks)
        .filter(task => task.dateStart !== "Sin Comenzar")
        .sort((a, b) => new Date(a.dateEnd).getTime() - new Date(b.dateEnd).getTime());

      tasks.map(task => {
        let dateData;
        if (task.dateEnd === "Sin Comenzar") {
          dateData = new Date();
        } else {
          dateData = new Date(task.dateEnd);
        }

        let color = this.getRandomColor();

        const newDataset = {
          label: task.name,
          backgroundColor: color,
          borderColor: color,
          pointRadius: 6,
          data: [
            {
              x: dateData,
              y: parseInt(task.cycleTime)
            }
          ]
        };

        this.chart.data.datasets.push(newDataset);
        this.chart.update();
      });
    }
  }

  calculatePercentile(percentile: string) {
    if (percentile != "default") {
      const tasks = this.lists
        .flatMap(l => l.tasks)
        .filter(task => task.dateStart !== "Sin Comenzar")
        .sort((a, b) => new Date(a.dateEnd).getTime() - new Date(b.dateEnd).getTime());

      const cycleTimes = tasks.map(task => parseInt(task.cycleTime)).sort((a, b) => a - b);

      //const percentileIndex = Math.round((parseInt(percentile) / 100) * cycleTimes.length) ;
      const percentileIndex = Math.round(((cycleTimes.length + 1) * (parseInt(percentile))) / 100);
      let color = this.getRandomColor();
      console.log("percentileIndex → " + percentileIndex)
      let minX = Number.MAX_VALUE;
      let maxX = Number.MIN_VALUE;

      this.chart.data.datasets.forEach((dataset: { data: any[]; }) => {
        dataset.data.forEach((point: { x: number; }) => {
          if (point.x < minX) minX = point.x;
          if (point.x > maxX) maxX = point.x;
        });
      });
      console.log(minX)
      console.log(maxX)

      const newDataset = {
        type: 'line',
        label: "Percentil " + percentile,
        backgroundColor: color,
        borderColor: color,
        data: [
          {
            x: minX,
            y: percentileIndex
          },
          {
            x: maxX,
            y: percentileIndex
          },
        ]
      };

      this.chart.data.datasets.push(newDataset);
      this.chart.update();
    }
  }

  eliminarPercentiles() {
    let dataNew = this.chart.data.datasets.filter((dataset: { label: string | string[]; }) => !dataset.label.includes("Percentil"));
    console.log(dataNew);

    this.chart.data.datasets = dataNew
    this.chart.update();
  }

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  //END Plotted

  readonly overlayOptions: Partial<CdkConnectedOverlay> = {
    hasBackdrop: true,
    positions: [
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
    ],
  };

  constructor(private boardService: BoardService,
    private userService: UserService,
    public dialog: MatDialog,
    public listService: ListService,
    private route: ActivatedRoute,
    private app: AppComponent) {

    this.app.showHeader = true;
    this.task = this.createEmptyTask();
    this.list = this.createEmptyList();
    this.id = '';

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.listService.setBoardId(this.id);
    this.listService.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');

    this.chart = new Chart(this.context, {
      type: 'scatter',
      data: {
        datasets: []
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'time',
            offset: true,
            time: {
              parser: 'YYYY-MM-DD',
              unit: 'day',
              displayFormats: {
                day: 'MMM d'
              },
            },
            adapters: {
              date: new MyDateAdapter()
            },
            title: {
              display: true,
              text: 'Fecha'
            },
            ticks: {
              autoSkip: true,
            }
          },
          y: {
            title: {
              display: true,
              text: 'Tiempo de Ciclo'
            },
            ticks: {
              stepSize: 1,  // establece el tamaño del paso
            },
            offset: true,
          }
        },
      }
    });

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.boardService.getBoardById(this.id).subscribe(data => {
      this.name = data.name;
      this.selectedCycleTimeStart = data.cycleTimeStartIdList;
      this.listService.setSelectedCycleTimeStart(this.selectedCycleTimeStart);
      this.selectedCycleTimeEnd = data.cycleTimeEndIdList;
      this.listService.setselectedCycleTimeEnd(this.selectedCycleTimeEnd)
      this.createdBy = data.createdBy;
      this.usersProject = data.users;
      //console.log(this.usersPlatforms)
      let dateCreation = new Date(data.dateCreation);
      this.dateCreation = dateCreation.getDate() + "/" + (dateCreation.getMonth() + 1) + "/" + dateCreation.getFullYear() + " " + dateCreation.getHours() + ":" + dateCreation.getMinutes();
    },
      err => {
        console.log(err);
      })

    this.userService.getAllUsers().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.usersPlatforms[i] = data[i].email;
      }
      console.log(this.usersPlatforms)
    },
      err => {
        console.log(err);
      })

    this.subs = this.listService.getBoardList$
      .subscribe(
        (response: any) => {
          this.lists = response;
          this.dropdownListCycleTimeStart = this.lists.map(list => {
            return { name: list.name, value: list.id }
          });

          this.setTaskToChart(response);

          this.dropdownListCycleTimeEnd = this.lists.map(list => {
            return { name: list.name, value: list.id }
          });
        },
        (error: string) => (console.log('Ups! we have an error: ', error))
      );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getBoardById(): void {
    this.boardService.getBoardById(this.id).subscribe(
      data => {
        this.lists = data.list;
      },
      err => {
        console.log(err);
      }
    );
  }

  async saveBoard(): Promise<void> {
    try {
      await this.boardService.updateBoard(this.id, this.selectedCycleTimeStart, this.selectedCycleTimeEnd, this.lists, this.usersProject);
      location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  displayOverlay(event?: any): void {
    this.isOverlayDisplayed = true;

    if (!!event) {
      this.task = {
        id: event.id,
        name: event.name,
        assignedTo: event.assignedTo,
        type: event.type,
        tag: event.tag,
        description: event.description,
        dateDeserve: event.dateDeserve,
        priority: event.priority,
        dateStart: event.dateStart,
        dateEnd: event.dateEnd,
        dateCreation: event.dateCreation,
        cycleTime: event.cycleTime,
      };

      if (event.listId) {
        this.listId = event.listId;
      }
    } else {
      this.task = this.createEmptyTask();
    }
  }

  displayOverlayAddList(event?: any): void {
    this.isOverlayListDisplayed = true;

    if (!!event) {
      this.list = {
        id: event.id,
        name: event.name,
        tasks: event.tasks
      };
    } else {
      this.list = this.createEmptyList();
    }
  }

  hideOverlay(): void {
    this.isOverlayDisplayed = false;
  }

  hideOverlayList(): void {
    this.isOverlayListDisplayed = false;
  }

  createEmptyTask(): TaskSchema {
    return {
      id: '',
      name: '',
      assignedTo: '',
      type: '',
      tag: '',
      description: '',
      dateDeserve: '',
      priority: '',
      dateStart: '',
      dateEnd: '',
      dateCreation: '',
      cycleTime: '',
    };
  }

  createEmptyList(): ListSchema {
    return {
      id: '',
      name: '',
      tasks: [],
    };
  }

  addUser(user: any) {
    const userExists = this.usersProject.find(u => u === user);

    if (!userExists) {
      this.usersProject.push(user);
    }

    this.selectedUser = "";
  }

  removeUser(user: any): void {
    const index = this.usersProject.indexOf(user);
    if (index !== -1) {
      this.usersProject.splice(index, 1);
    }
  }

}
class MyDateAdapter {
  parse(value: any, formatString: string) {
    return parse(value, formatString, new Date());
  }

  format(date: Date, formatString: string) {
    return format(date, formatString);
  }
}

