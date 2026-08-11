import { YUVA_SANGAM_EVENT } from '../constants/eventDetails';

export function getGoogleCalendarUrl(): string {
  const title = encodeURIComponent("युवा संगम : सोंडा (अंबाला)");
  const details = encodeURIComponent(
    `युवा संगम : सोंडा (अंबाला)\n\n` +
    `📅 Date: 23 August 2026\n` +
    `⏰ Time: 08:00 AM to 11:30 AM IST\n` +
    `📍 Venue: ${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}\n\n` +
    `🔔 EVENT REMINDERS:\n` +
    `• 1 Day Before (22 Aug 2026 at 08:00 AM)\n` +
    `• 1 Hour Before (23 Aug 2026 at 07:00 AM)\n` +
    `• 30 Minutes Before (23 Aug 2026 at 07:30 AM)`
  );
  const location = encodeURIComponent(
    `${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}, ${YUVA_SANGAM_EVENT.city}, ${YUVA_SANGAM_EVENT.state}`
  );

  // August 23, 2026: 08:00 AM IST to 11:30 AM IST
  // 08:00 AM IST = 02:30:00 UTC
  // 11:30 AM IST = 06:00:00 UTC
  const dates = "20260823T023000Z/20260823T060000Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function getOutlookCalendarUrl(): string {
  const title = encodeURIComponent("युवा संगम : सोंडा (अंबाला)");
  const details = encodeURIComponent(
    `युवा संगम : सोंडा (अंबाला)\nDate: 23 August 2026\nTime: 08:00 AM to 11:30 AM IST\nVenue: ${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}.\nReminders: 1 day before, 1 hour before, 30 minutes before.`
  );
  const location = encodeURIComponent(
    `${YUVA_SANGAM_EVENT.venue}, ${YUVA_SANGAM_EVENT.address}, ${YUVA_SANGAM_EVENT.city}, ${YUVA_SANGAM_EVENT.state}`
  );

  const startdt = "2026-08-23T08:00:00+05:30";
  const enddt = "2026-08-23T11:30:00+05:30";

  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startdt}&enddt=${enddt}&body=${details}&location=${location}`;
}

export function downloadIcsFile(): void {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Yuva Sangam Sonda Ambala 2026//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:युवा संगम : सोंडा (अंबाला)
DESCRIPTION:युवा संगम : सोंडा (अंबाला)\\nDate: 23 August 2026\\nTime: 08:00 AM to 11:30 AM IST\\nVenue: ${YUVA_SANGAM_EVENT.venue}\\, ${YUVA_SANGAM_EVENT.address}\\n\\nReminders:\\n- 1 day before\\n- 1 hour before\\n- 30 minutes before
LOCATION:${YUVA_SANGAM_EVENT.venue}\\, ${YUVA_SANGAM_EVENT.address}\\, ${YUVA_SANGAM_EVENT.city}\\, ${YUVA_SANGAM_EVENT.state}
DTSTART:20260823T023000Z
DTEND:20260823T060000Z
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder: युवा संगम : सोंडा (अंबाला) is tomorrow at 8:00 AM!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder: युवा संगम : सोंडा (अंबाला) starts in 1 hour at 8:00 AM!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Reminder: युवा संगम : सोंडा (अंबाला) starts in 30 minutes!
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Yuva_Sangam_Sonda_Ambala_2026.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

