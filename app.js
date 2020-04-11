import mongoose from './utils/mongoose'; // Setup MongoDB Database
import dailyAgenda from './cronjobs/daily';

function onConnected() {
  dailyAgenda();
}

mongoose.connect(onConnected);
