module.exports = {
    apps: [
        {
            name: 'app',
            script: './src/server.js',
            env: {
                NODE_ENV: 'production',
                NODE_CONFIG_DIR: './src/config',
            },
        },
    ],
};
