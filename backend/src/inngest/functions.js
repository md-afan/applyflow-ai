const { inngest } = require("./client");
const { supabaseAdmin } = require("../config/supabase");

const reminderJob = inngest.createFunction(
  {
    id: "daily-reminder-check",
    triggers: [
      {
        cron: "TZ=Asia/Kolkata 0 9 * * *",
      },
    ],
  },
  async ({ step }) => {
    const reminders = await step.run(
      "find-due-reminders",
      async () => {
        const now = new Date().toISOString();

        const { data, error } = await supabaseAdmin
          .from("reminders")
          .select("*")
          .eq("status", "pending")
          .lte("reminder_date", now);

        if (error) {
          throw new Error(error.message);
        }

        return data || [];
      }
    );

    return {
      processed: reminders.length,
      reminders,
    };
  }
);

module.exports = {
  functions: [reminderJob],
};