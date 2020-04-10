import mongoose from './utils/mongoose'; // Setup MongoDB Database
import { dailyCtl } from './controllers';

function startServer() {
  dailyCtl(new Date(2020, 2, 28));
}

mongoose.connect(startServer);
