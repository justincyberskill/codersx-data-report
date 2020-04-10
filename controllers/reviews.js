import { dailyCronjob } from '../services/cronjobs';

export function dailyCtl(date) {
  dailyCronjob(date);
}
