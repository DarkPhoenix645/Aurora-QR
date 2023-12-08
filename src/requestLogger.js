

const requestLogger = (req, res, next) => {
    var dt = Date();
    var ip = req.ip;
    var d = dt.slice(4, 15).replace(/ /g, "/");
    var t = dt.slice(16, 24);
    if (req.url.includes('public')) {
        next();
    }
    else {
        console.log(`${req.method} request from ${ip} for URL ${req.url} at ${t} on ${d}`);
        next();
    }
};

export default requestLogger