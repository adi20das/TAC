# TAC

A React and express based historical calendar app

# Creating a Production Build

To run a production build locally, use two terminals to run the api and the calendar react app separately:
- API
  ```
  cd api
  npm install
  npm start
  ```
- Calendar  
  Install serve if prompted by the terminal output
  ```
  cd calendar
  npm install
  npm run build
  serve -s build
  ```

# Development

## Setup

Before starting, run the following in the root directory of the project:

```
npm install
```

Then, run the following to install all dependencies for both api and calendar:

```
npm run setup_dev
```

### Environment setup

For running the backend api, you need to copy the .env.example to the .env file:

- First, switch into the api directory:

  ```
  cd api
  ```

- Copy .env.example:

  ```
  cp .env.example .env
  ```

  The value for `PORT` can be used as is.
  The value for `MONGO_URI` needs to be added. Ask in the team chat for the URI. Please DONOT commit this to github

### Running

In the root folder of the project, use `npm run dev` to start both the frontend React app, and the backend api.
Any changes made to files within the /api/src/ folder will automatically restart the backend server

## Adding Dependencies

Any dependencies should be added to either the `api` or the `calendar` folder's package.json  
For example, adding a new dependency for the frontend(calendar):

```
cd calendar
npm install dependency_name
```
