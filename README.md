# Pokedex Full Stack Developer Challenge for DearDoc.

This is a Full Stack Application, with REST backend and a frontend consuming it. It was created using Javascript with Node.js for the backend and Vue.js for the frontend. For the datastorage I used Firebase Realtime Database. The Application uses firebase functions to make the calls to the pokemon API, so no direct calls to the public API from the client.

This is a pokedex that lists pokemons with some details, the pokemons can be searched and or added to favourite.

Features:
- The main view lists 4 Pokemons at once, showing their picture and name.
- The user can swich pages using the two buttons below the main screen.
- The user can search a pokemon by name and see it in the main screen, along with some information on the secondary screen.
- The user can add a Pokemon to favourites by pushing the add to favourite button, the user can also remove from favourite.
- The favourited pokemon will show the name on the green screen with a star, depicting that it is a favourite.

## How to run the aplication

- Download the code or clone it.
- Install node/npm, (nodejs.org)[https://nodejs.org/en].
- Create the VUE3 Project with npm create vue@latest, you will get options for the scaffolding, if you are unsure, select no on all of the options. (vue3)[https://vuejs.org/guide/quick-start.html]
- Now install the Vue Dependencies by changing to your project directory: cd , run npm install.
- To start the server you can run npm run dev
- Install Firebase CLI, (firebase.google.com)[https://firebase.google.com/docs/cli].
- Install the Firebase tools, npm install -g firebase-tools.
- Install the project dependencies, npm install.
- !IMPORTANT! once npm install has been executed on the main directory, change to the functions directory and execute npm install. So the functions dependecies are installed too.
- Add your firebase project information to the file at src/firebase/init.js
- Log into your firebase account with firebase login
- Set up the project with firebase init, you can follow the instructions from Firebase (firebase.google.com)[https://firebase.google.com/docs/cli?hl=es-419#initialize_a_firebase_project]
- On the hosting option, select one page application and type dist as your deploys directory.
- Run firebase deploy to deploy the functions and hosting.
