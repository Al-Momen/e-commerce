const siteController = {};
siteController.home = (req, res) => {
    res.send('Hello World from Node.js!');
};

siteController.test = (req, res) => {
    res.send('API is connect!');
};
export default siteController;