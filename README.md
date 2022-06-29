# AircraftScheduler

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



## Assumptions

Assuming only one aircraft is available and will always just be the one 
Assuming if an aircraft had a schedule that it would be in its object data as 'aircraft.schedule' and if not, then it has no schedule
Assuming turnaround time is just 20 minutes
Assuming all users who navigate to this app know what it should be able to do 
(not accounting for non airline oriented people, non COO etc)


## Things to improve / Things I didn't focus on / To be Revisited

- Make aircraft list selectable (adding more aircrafts to the list, on selection, timeline updates on its loaded schedule etc)
- Update styling to be less boxy / better looking
- Update timeline to actively show total idle time in an aircrafts schedule when selecting flights & update overall styling 
- Incorporate date at the top with scheduling (wasn't sure how it would tie in with current given requirements / information so it wasnt a focus)
- Minifying css / html (using better structuring for info cards etc)
- Making a separate service file structure (use express) to be able to easily add new endpoints, and handling any in one centralized spot (GETs POSTs etc) in future & to clean up component file a bit
- Keeping track of schedules of multiple aircrafts
- Add more user info for navigating / using the app (maybe like a help icon or button with a popup)


