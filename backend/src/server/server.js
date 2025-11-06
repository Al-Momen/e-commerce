import app from '../app.js';
import {serverPort} from "../helper/secret.js";
// "dev": "nodemon --env-file=backend/.env index.js"
// "dev": "node --env-file=backend/.env --watch index.js"

function serverConnect() {
    app.listen(serverPort, (err) => {
        if (err) {
            console.error(`Error starting server:`, err);
            process.exit(1);
        } else {
            console.log(`Server is running on port ${serverPort}`);
        }
    });
}

export default serverConnect;


