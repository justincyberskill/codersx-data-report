import Agenda from 'agenda';
import { mongoUri } from '../mongoose';

// ------ Create agenda ------
export default new Agenda({
  db: { address: mongoUri, collection: 'dataReportAgendaJobs' },
});
