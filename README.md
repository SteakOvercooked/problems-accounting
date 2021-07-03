(!) electron-builder doesn't include empty folders when building the redistributable no matter what i do, so creating a "temp_view_files" folder in 
"resources/app/static" is required once you "npm run pacakge-win" the project if you want to be able to open the attached files when viewing a problem (!) 

This is my first experience with React, Electron, Webpack and npm at all and my first experience with JS, HTML, CSS writing something bigger 
than a calculator. Just run "npm install" after you pull, then run "npm run build_dev" to build app.js file. Then you can "npm run start" to launch the app.