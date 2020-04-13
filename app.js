import mongoose from './utils/mongoose'; // Setup MongoDB Database
// import agenda from './utils/agenda';
// import dailyMentorKpiJobs from './cronjobs/daily-mentor-kpi';
// import dailyStudentKpiJobs from './cronjobs/daily-student-kpi';

function onDatabaseConnected() {
  // agenda.start();
  // dailyMentorKpiJobs();
  // dailyStudentKpiJobs();
}

mongoose.connect(onDatabaseConnected);
