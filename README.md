# SchedulerApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## How to run the project

1. `cd SchedulerApp`
2. Run the Mock DB as mentioned below. There are some pre-populated dummy data in `src/api/db.json` which can be edited if needed.
3. Run development server as mentioned below
4. You can add 'event' items using the top left '+' button. You can click on events on the scheduler timeline to see the details and remove it.

## Mock DB

Run `json-server --watch src/api/db.json` to run a local JSON database server. Performing add/delete functions will add to the json file.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.