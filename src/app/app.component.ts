import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'aircraft-scheduler';

  public currentDate = moment().utc().format('Do MMMM YYYY');
  public aircraftList: any;
  public selectedFlights: any;
  public flightsOfTheDay: any;
  public log: any;

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
    console.log(this.selectedFlights);
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
