# Problems Accounting

## Launching the app

It is an app i wrote for my term work. This is my first experience with React, Electron, Webpack and npm at all and my first experience with JS, HTML, CSS writing 
something bigger than a calculator :sweat_smile:.

I am in no way proud of the code, but am proud of the result. This is the *beginning* of me as a *developer*. 
Just run "npm install" after you pull, then run "npm run build_dev" to build app.js file. Then you can "npm run start" to launch the app.

## Distributing

If you want to build an executable, you'll have to install ```vs build tools``` and ```electron-builder``` on your own and configure the build options in 
package.json according to your platform.

**!** electron-builder doesn't include empty folders when building the redistributable no matter what i do, so creating a "temp_view_files" folder in 
"resources/app/static" is required once you create an executable if you want to be able to open the attached files when viewing a problem **!** 

