import serverConnect from "./backend/src/server/server.js";
import connectDatabase from "./backend/src/config/db.js";

(async () => {
    // ------------ Database connect here ----------------
    await connectDatabase();
    // ------------ Database end connect here ----------------

    // ------------ server connect here ----------------
    serverConnect();
    // ------------ server end connect here ----------------
})();
