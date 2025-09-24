// scripts/seed-apis.ts
import { db } from "@/lib/db";

async function main() {
  // Add/adjust as you like — keep baseUrl something that returns quickly.
  const items = [
    { name: "OpenAI API",    provider: "openai",   category: "AI",     baseUrl: "https://api.openai.com/v1/models", regions: ["us-east-1","eu-west-1"] },
    { name: "Stripe API",    provider: "stripe",   category: "payments", baseUrl: "https://api.stripe.com/v1/charges", regions: ["us-east-1","eu-west-1"] },
    { name: "GitHub API",    provider: "github",   category: "devtools", baseUrl: "https://api.github.com/", regions: ["us-east-1","eu-west-1"] },
    { name: "Twilio API",    provider: "twilio",   category: "sms",    baseUrl: "https://api.twilio.com/2010-04-01/Accounts.json", regions: ["us-east-1","eu-west-1"] },
    { name: "SendGrid API",  provider: "sendgrid", category: "email",  baseUrl: "https://api.sendgrid.com/v3/user/credits", regions: ["us-east-1","eu-west-1"] },
    { name: "Notion API",    provider: "notion",   category: "docs",   baseUrl: "https://api.notion.com/v1/users/me", regions: ["us-east-1","eu-west-1"] },
    { name: "Slack API",     provider: "slack",    category: "chat",   baseUrl: "https://slack.com/api/api.test", regions: ["us-east-1","eu-west-1"] },
    { name: "Discord API",   provider: "discord",  category: "chat",   baseUrl: "https://discord.com/api/v10/gateway", regions: ["us-east-1","eu-west-1"] },
    { name: "Cloudflare API",provider: "cloudflare",category:"infra",  baseUrl: "https://api.cloudflare.com/client/v4/radar/annotations", regions: ["us-east-1","eu-west-1"] },
    { name: "Supabase API",  provider: "supabase", category: "db",     baseUrl: "https://api.supabase.com/", regions: ["us-east-1","eu-west-1"] },
  ];

  for (const a of items) {
    await db.api.upsert({
      where: { name: a.name },
      update: { provider: a.provider, category: a.category, baseUrl: a.baseUrl, regions: a.regions },
      create: a,
    });
  }

  console.log("Seeded APIs:", items.length);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
 