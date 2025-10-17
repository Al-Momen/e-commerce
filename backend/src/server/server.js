
import app from '../app.js';
const PORT = process.env.PORT || 3001;

function serverConnect(){
    app.listen(PORT, (err) => {
        if (err) {
            console.error(`Error starting server:`, err);
            process.exit(1);
        } else {
            console.log(`Server is running on port ${PORT}`);
        }
    });
}

export default serverConnect;


