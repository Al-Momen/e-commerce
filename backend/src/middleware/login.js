
const isLoggedIn = (req, res, next) => {
    const login = true;
    if (login) {
        req.body = { id: 101 };
        console.log(req);

        next();
    } else {
       return res.status(401).json({message:"unauthorize User"});
    }
}
const isLoggedIn2 = (req, res, next) => {
    console.log('Login2 Middleware');
    next();
}

export { isLoggedIn, isLoggedIn2 };