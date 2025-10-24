const SiteController = {};
SiteController.home = (req, res) => {
    res.send('Hello World from Node.js!');
};

SiteController.test = (req, res) => {
    res.send('API is connect!');
};
export default SiteController;