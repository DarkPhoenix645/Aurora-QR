module.exports = {
    apps: [{
        name: "Aurora-QR",
        script: "src/index.js",
        exec_interpreter: "node",
        max_restarts: 5,
        env: {
            HOST: "localhost",
            PORT: 8080,
            DATABASE_LOGIN: ""
        }
    }]
}