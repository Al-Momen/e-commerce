import http from 'http';

const PORT = process.env.PORT || 3001;

function surverConnect(){

    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World!');
    });
    
    server.listen(PORT, (err) => {
        if (err) {
            console.error(`Error starting server:`, err);
            process.exit(1);
        } else {
            console.log(`Server is running on port ${PORT}`);
        }
    });
}

export default surverConnect ;


