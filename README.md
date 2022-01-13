# local-settings-util

Generates a local.settings.json file based on an existing function app
prerequirments:
 - node (tested on v16.13.1)
 - azure cli


To run
in your terminal of choice under the project directory run: 
    
    npm install
    az login
        
then after logged in run:
  
    .\get-functionapp-properties.bat myFunctionApp myresourcegroup

you should find at the end of the process in the output directory the local.settings.json

## P.S
This project was built to run on  windows but would probably run with little effort on other OS
