import { toast } from "sonner";
function showNotification(title, body) {
  toast.success(title, { description: body, duration: 5e3 });
}
const notificationTemplates = {
  welcome: (name) => ({
    title: "Welcome to MEDIKIOSK 👋",
    body: `Hi ${name}! Your account is ready. No queues. No waiting. Just care.`
  }),
  approved: (name, doctor) => ({
    title: "✅ Prescription Approved!",
    body: `Dr. ${doctor} approved your prescription. Please collect your medicines.`
  }),
  dispensed: (name) => ({
    title: "🎉 Medicines Dispensed!",
    body: `${name}, your medicines have been dispensed successfully. Get well soon! 💊`
  }),
  newPrescription: (patientName) => ({
    title: "📋 New Prescription Received",
    body: `Patient ${patientName} has submitted a prescription for your review.`
  })
};
export {
  notificationTemplates as n,
  showNotification as s
};
