# movie-recommendation

App created for a technical challenge and to challenge myself with new technologies.
The app is made with:

- React (create-react-app) frontend
- NestJs backend
- MongoDB database

Everything is dockerized into three images.
There is no source code for the mongo, it's using nest mongoose + docker image to access the database.

## How to build + run the app locally

1. Download both "movie-recommendation-fe" and "movie-recommendation" (this project) from my github repositories.
2. Make a .env file for both of the projects. You can find a `.env.example` file inside the root directory of both projects. Use your personal data For the frontend, make a firebase-secret.json file too in `src/auth/secret`
3. run `npm install` for both projects
4. run the `npm run docker` script from the backend root directory. There is a docker compose file that will do everything for you.
5. Done! you can now use the frontend at `localhost:3000` and the backend at `localhost:3030`. The Swagger Apis are available at `localhost:3030/api/docs`.

## How to build the app

In the project directory, you can run:

### `npm run docker`

Calls npm run docker:down and then npm run docker:up.
The docker:down script is explained below.
Then, creates images with the Dockerfiles of the backend and frontend projects (must be in the same root folder), and starts 3 new containers for the projects, 1 for the frontend, 1 for the backend, and a final one for the mongoDB database.

### `npm run docker:down`

Deletes current docker images, docker containers and dangling images.
Will leave volumes and volume data intact.

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3030](http://localhost:3030) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
