import express from 'express';

import mongoose from './utils/mongoose'; // Setup MongoDB Database
import { dailyCtl } from './controllers';

const app = express();

function startServer() {
  const onServerStarted = () => {
    dailyCtl(new Date(2020, 2, 28));
    console.log(`🚀 Server is running at port ${port}`);
  };

  const port = 3000;
  app.listen(port, onServerStarted);
}

mongoose.connect(startServer);
