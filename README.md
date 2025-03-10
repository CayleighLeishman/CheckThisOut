
## Start the Express Server

With the packages installed you're ready to run the initial test.
1. If the VSC terminal is still open use it. If it is closed, open it again using the same command as before.

2. Type the following command, then press Enter:

    pnpm run dev


___
3. If the command works, you should see the message "app listening on localhost:5500" in the console.

4. Open the package.json file.

5. Note the "Scripts" area? There is a line with the name of "dev", which tells the nodemon package to run the server.js file.
6. This is the command you just ran.

7. Open the server.js file.

8. Near the bottom you'll see two variables "Port" and "Host". The values for the variables are stored in the .env file.

9. These variables are used when the server starts on your local machine.

## Move the demo file
When you installed Git and cloned the remote repository in week 1, you should have created a simple web page.
1. Find and move that simple web page to the public folder. Be sure to note its name.


## Test in a browser

1. Go to http://localhost:5500 in a browser tab. Nothing should be visible as the server has not been setup to repond to that route.
2. Add "/filename.html" to the end of the URL (replacing filename with the name of the file you moved to the public folder).
3. You should see that page in the browser.