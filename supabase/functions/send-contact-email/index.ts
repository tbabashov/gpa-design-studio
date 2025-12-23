import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email from:", email);

    // Send notification email to the site owner
    const notificationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EasyGPA Contact <onboarding@resend.dev>",
        to: ["tbabashov6@outlook.com"],
        subject: `New Contact Form: ${subject}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h2>Message:</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    const notificationData = await notificationRes.json();
    console.log("Notification email response:", notificationData);

    if (!notificationRes.ok) {
      throw new Error(notificationData.message || "Failed to send notification email");
    }

    // Send confirmation email to the user
    const confirmationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EasyGPA <onboarding@resend.dev>",
        to: [email],
        subject: "We received your message!",
        html: `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
          <p>Best regards,<br>The EasyGPA Team</p>
        `,
      }),
    });

    const confirmationData = await confirmationRes.json();
    console.log("Confirmation email response:", confirmationData);

    return new Response(
      JSON.stringify({ success: true, notification: notificationData, confirmation: confirmationData }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
