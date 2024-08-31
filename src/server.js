import mongoose from 'mongoose';
import config from 'config';
import app from './app.js';

mongoose
    .connect(config.get('mongoose.uri'), config.get('mongoose.options'))
    .then(() => {
        app.listen(config.get('app.port'), () => {
            console.log(`Server started on port ${config.get('app.port')}`);
        });
    });

process.on('SIGINT', () => {
    console.log('Exiting server...');
    process.exit();
});
