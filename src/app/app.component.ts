import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { catchError, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /** Moment object */
  public currentDateMoment = moment().utc();
  /** Current date string to be displayed */
  public currentDate = this.currentDateMoment.format('Do MMMM YYYY');
  /** List of aircrafts */
  public aircraftList: any;
  /** List of Selected Flights */
  public selectedFlights: any;
  /** List of all available flights */
  public flightsOfTheDay: any;
  /** Data for displaying timeline */
  public timelineData: any;
  /** Displays total usage percentage of aircraft */
  public totalUsage = '0%';
  /** Used for setting length of paginator based on data count from initial flights request */
  public length: any;

  /** View child object of mat paginator component */
  @ViewChild(MatPaginator) public paginator: MatPaginator;

  constructor(private http: HttpClient, private _notificationBar: MatSnackBar){}

  /**
   * Angular Lifecycle hook, initializing variables and grabbing endpoint data
   */
  public ngOnInit(): void {
    this.selectedFlights = [];
    this.timelineData = [];
    this.getAircrafts().subscribe((res: any) => {
      this.aircraftList = res.data;    
    });

    this.getFlights(0).subscribe((res: any) => {
      console.log(res);
      this.flightsOfTheDay = res.data;   
      this.length = res.pagination.total; 
    });

  }

  /**
   * Get next or previous 25 flights based paginator index value
   * @param event paginator event emitter
   */
  public getUpdatedFlights(event:any): void {
    this.getFlights(event.pageIndex * 25).subscribe((res: any) => {
      this.flightsOfTheDay = res.data;
    })
  }

  /**
   * Changes date check to next day
   */
  public nextDay(): void  {
    this.currentDateMoment.add(1, 'd');
    this.currentDate = this.currentDateMoment.format('Do MMMM YYYY');
  }

  /**
   * Changes top date to previous day
   */
  public previousDay(): void {
    this.currentDateMoment.subtract(1, 'd');
    this.currentDate = this.currentDateMoment.format('Do MMMM YYYY');
  }

  /**
   * Calculates aircraft flight time over 24 hour period 
   * @param aircraft aircraft to calculate utilization for 
   * @returns calulated percentage as a string
   */
  public calculateUsage(aircraft: any): void {
    console.log(aircraft.schedule);
    if (aircraft.schedule) {
      let totalFlightTime = 0;
      aircraft.schedule.forEach((flight:any) => {
        totalFlightTime += Math.abs(flight.arrivaltime - flight.departuretime);
      })

      let usage = totalFlightTime / (24 * 60 * 60);
      this.totalUsage = `${usage.toFixed(1)}%`;
    } else {
      this.totalUsage = '0%'

    }
  }

  /**
   * Updates timeline display to show active / turnaround time / idle time
   * @param schedule flight schedule
   */
  public updateTimelineData(schedule:any): void{
    let flightData = schedule;
    flightData.forEach((element: any, index: number) => {
      if (index !== flightData.length -1){
        if (flightData[index+1].departuretime > (element.arrivaltime + 1200)){
          let foundIndex = this.timelineData.findIndex((data:any) => data.id === element.id);
          this.timelineData.splice(foundIndex+2, 0, {isIdle: true}); // add idle object to schedule (index + 2 to account for flight & turnaround)
        }
      } else if (index === flightData.length -1 ){
        if (element.arrivaltime < 86400) {
          let foundIndex = this.timelineData.findIndex((data:any) => data.id === element.id);
          this.timelineData.splice(foundIndex+2, 0, {isIdle: true});
        }
      }
    });

  }

  /**
   * Updates rotation schedule for the aircraft with selected flight list
   * if any rules are broken, the user is notified via snackbar pop message with the error and schedule is not updated
   */
  public updateRotationSchedule(){
    if (this.selectedFlights[0].origin !== this.aircraftList[0].base){ // checks if first flight starts where aircraft is based
      this._notificationBar.open(`First flight selection does not begin at aircraft base: ${this.aircraftList[0].base}`, 'Close', {duration: 5000});
      return;
    } else {
      this.selectedFlights.forEach((flight:any, index: number) => {
        if (index === 0){ //just check for turnaround time 
          if (this.selectedFlights[index+1].departuretime - flight.arrivaltime < 1200) { // check if at least 20mins between flights (turnaround time)
            this._notificationBar.open(`flight ${this.selectedFlights[index+1].id} does not depart at 20 mins after previous flight ${flight.id}, please update selection`, 'Close', {duration: 5000});
            return;
          }
        } else if (index !== 0 && index !== this.selectedFlights.length -1) { // to check after first & dont need to check last flight
          if (flight.destination !== this.selectedFlights[index+1].origin) { //check that current flight lands at next flight origin
            this._notificationBar.open(`flight ${this.selectedFlights[index-1].id} does not land at next flight ${flight.id} origin, please update selection`, 'Close', {duration: 5000});
            return;
          }
          if (this.selectedFlights[index+1].departureTime - flight.arrivalTime < 1200) { // check if at least 20mins between flights (turnaround time)
            this._notificationBar.open(`flight ${this.selectedFlights[index+1].id} does not depart at 20 mins after previous flight ${flight.id}, please update selection`, 'Close', {duration: 5000});
            return;
          }
        }
      });

      this.aircraftList[0].schedule = this.selectedFlights; // set schedule to aircraft (assuming this is how to tie the schedule to aircraft)
      this.calculateUsage(this.aircraftList[0]); // recalculate usage with updated schedule
      this.updateTimelineData(this.selectedFlights);
      this._notificationBar.open(`Succesfully updated flight schedule for ${this.aircraftList[0].ident}`, 'Close', {duration: 5000});

    }
  }

  /**
   * Pushes clicked flight from rotation to selected flight list 
   * @param flight selected flight
   */
  public selectFlight(flight: any): void  {
    if (this.selectedFlights.filter((flt: any) => flt.id === flight.id).length !== 1) {
      this.selectedFlights.push(flight);
      this.timelineData.push(flight);
      this.timelineData.push({turnaround: true});
    }
  }

  /**
   * Removes flight from selected flight list
   * @param flight flight to remove
   */
  public removeFlight(flight: any): void {
    this.selectedFlights = this.selectedFlights.filter((element:any) => element.id !== flight.id);
    this.timelineData.forEach((element: any, index: any) => {
      if (element.id === flight.id){
        this.timelineData.splice(index, 2);
      }
    });
  }

  /**
   * Clears selected flights / timeline data 
   */
  public clearSelectedFlights(): void {
    this.selectedFlights = [];
    this.timelineData = [];
  }

  /**
   * Get request for grabbing aircraft data from endpoint
   * @returns aircraft json data 
   */
  getAircrafts(): Observable<any[]> {
    return this.http.get<any[]>('https://infinite-dawn-93085.herokuapp.com/aircrafts')
      .pipe(
        catchError(this.handleError<any[]>('getAircrafts', []))
      );
  }

  /**
   * Get request for grabbing flight from endpoint
   * @returns flight json data 
   */
  getFlights(offset: number): Observable<any[]> {
    const pagination = {offset: offset};
    return this.http.get<any[]>('https://infinite-dawn-93085.herokuapp.com/flights', {params: pagination})
      .pipe(
        catchError(this.handleError<any[]>('getFlights', []))
      );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error); // log to console instead
    return of(result as T);
  };
}
}
