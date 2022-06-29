import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, Observable, of } from 'rxjs';
import { TimelineItem } from './interfaces/timeline-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'aircraft-scheduler';

  public currentDateMoment = moment().utc();
  public currentDate = this.currentDateMoment.format('Do MMMM YYYY');
  public aircraftList: any;
  public selectedFlights: any;
  public flightsOfTheDay: any;
  public log: any;
  public items: TimelineItem[] = [];
  public turnaroundTimeSeconds = 1200;

  constructor(private http: HttpClient,){
  }

  public ngOnInit(): void {
    this.selectedFlights = [];
    this.getAircrafts().subscribe((res: any) => {
      console.log(res);
      this.aircraftList = res.data;    
    });

    this.getFlights().subscribe((res: any) => {
      console.log(res);
      this.flightsOfTheDay = res.data;    
    });

    this.items.push({
      label: 'Test 1',
      icon: 'fa fa-address-book-o',
      active: true,
      title: 'Example 1',
      color: '16a085',
      command() {
        console.log('Action 1');
      }
    });
  }

  public nextDay() {
    this.currentDateMoment.add(1, 'd');
    this.currentDate = this.currentDateMoment.format('Do MMMM YYYY');
  }

  public previousDay() {
    this.currentDateMoment.subtract(1, 'd');
    this.currentDate = this.currentDateMoment.format('Do MMMM YYYY');
  }

  public calculateUsage(aircraft: any){
    if (aircraft){
      return '58%'
    }
    return '58%'
  }

  public selectFlight(flight: any) {
    if (this.selectedFlights.filter((flt: any) => flt.id === flight.id).length !== 1) {
      this.selectedFlights.push(flight);
    }
  }

  public removeFlight(flight: any) {
    this.selectedFlights = this.selectedFlights.filter((element:any) => element.id !== flight.id);
  }

  getAircrafts(): Observable<any[]> {
    return this.http.get<any[]>('https://infinite-dawn-93085.herokuapp.com/aircrafts')
      .pipe(
        catchError(this.handleError<any[]>('getAircrafts', []))
      );
  }

  getFlights(): Observable<any[]> {
    return this.http.get<any[]>('https://infinite-dawn-93085.herokuapp.com/flights')
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

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
