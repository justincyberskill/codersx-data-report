import mongoose from './utils/mongoose'; // Setup MongoDB Database
import agenda from './utils/agenda';
import dailyMentorKpiJobs from './cronjobs/daily-mentor-kpi';
import dailyStudentKpiJobs from './cronjobs/daily-student-kpi';

function onDatabaseConnected() {
  agenda.on('ready', () => {
    dailyMentorKpiJobs();
    dailyStudentKpiJobs();
    agenda.start();
  });
}

mongoose.connect(onDatabaseConnected);
