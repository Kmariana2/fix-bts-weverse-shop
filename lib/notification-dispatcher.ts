/**
 * Notification Dispatcher (2026 Omnichannel Hub)
 * Handles routing support alerts to multiple channels with deep-linking
 */

export interface NotificationPayload {
  sessionId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  cartValue: number;
  currentPage: string;
  timestamp: Date;
}

export interface NotificationChannel {
  type: "email" | "telegram" | "discord" | "push";
  enabled: boolean;
  config?: Record<string, string>;
}

export interface DispatcherConfig {
  ownerEmail?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  discordWebhookUrl?: string;
  enablePushNotifications?: boolean;
}

/**
 * Generate a deep-link URL to a specific chat session
 */
export function generateDeepLink(sessionId: string, baseUrl: string = ""): string {
  const url = baseUrl || typeof window !== "undefined" ? window.location.origin : "";
  return `${url}/admin/support?sessionId=${sessionId}&autoOpen=true`;
}

/**
 * Format notification message for different channels
 */
export function formatNotificationMessage(payload: NotificationPayload, channel: "email" | "telegram" | "discord" | "push"): string {
  const deepLink = generateDeepLink(payload.sessionId);

  switch (channel) {
    case "email":
      return `
        <h2>🆕 New Support Request</h2>
        <p><strong>${payload.userName}</strong> needs help!</p>
        <p><strong>Message:</strong> ${payload.message}</p>
        <p><strong>Cart Value:</strong> $${payload.cartValue.toFixed(2)}</p>
        <p><strong>Current Page:</strong> ${payload.currentPage}</p>
        <p><strong>Contact:</strong> ${payload.userEmail} | ${payload.userPhone}</p>
        <p><a href="${deepLink}" style="background: #000; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">Reply Now →</a></p>
      `;

    case "telegram":
      return `
🆕 <b>New Support Request!</b>

👤 <b>${payload.userName}</b>
💬 "${payload.message}"
💰 Cart: $${payload.cartValue.toFixed(2)}
📍 Page: ${payload.currentPage}

<a href="${deepLink}">🔗 Reply Now</a>
      `;

    case "discord":
      return `
**🆕 New Support Request!**

**Customer:** ${payload.userName}
**Message:** "${payload.message}"
**Cart Value:** $${payload.cartValue.toFixed(2)}
**Current Page:** ${payload.currentPage}
**Contact:** ${payload.userEmail} | ${payload.userPhone}

[Reply Now →](${deepLink})
      `;

    case "push":
      return `New request from ${payload.userName}: "${payload.message}"`;

    default:
      return payload.message;
  }
}

/**
 * Send notification via Email (using Web3Forms)
 */
export async function sendEmailNotification(
  payload: NotificationPayload,
  ownerEmail: string
): Promise<boolean> {
  try {
    const deepLink = generateDeepLink(payload.sessionId);
    const body = new FormData();
    body.append("access_key", "f371aa3f-e817-4dec-abd0-d0b2f56b8246");
    body.append("subject", `🆕 Support Request from ${payload.userName}`);
    body.append("name", "BTS Support System");
    body.append("email", ownerEmail);
    body.append("message", `
New support request from ${payload.userName}

Message: "${payload.message}"
Cart Value: $${payload.cartValue.toFixed(2)}
Current Page: ${payload.currentPage}
Contact: ${payload.userEmail} | ${payload.userPhone}

Reply here: ${deepLink}
    `);

    const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
    return res.ok;
  } catch (error) {
    console.error("Email notification failed:", error);
    return false;
  }
}

/**
 * Send notification via Telegram Bot
 */
export async function sendTelegramNotification(
  payload: NotificationPayload,
  botToken: string,
  chatId: string
): Promise<boolean> {
  try {
    const deepLink = generateDeepLink(payload.sessionId);
    const message = formatNotificationMessage(payload, "telegram");

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    return res.ok;
  } catch (error) {
    console.error("Telegram notification failed:", error);
    return false;
  }
}

/**
 * Send notification via Discord Webhook
 */
export async function sendDiscordNotification(
  payload: NotificationPayload,
  webhookUrl: string
): Promise<boolean> {
  try {
    const deepLink = generateDeepLink(payload.sessionId);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🆕 New Support Request from **${payload.userName}**`,
        embeds: [
          {
            title: "Support Request Details",
            description: `"${payload.message}"`,
            color: 0x000000,
            fields: [
              { name: "Customer", value: payload.userName, inline: true },
              { name: "Cart Value", value: `$${payload.cartValue.toFixed(2)}`, inline: true },
              { name: "Current Page", value: payload.currentPage, inline: false },
              { name: "Contact", value: `${payload.userEmail}\n${payload.userPhone}`, inline: false },
            ],
            footer: { text: "Click the button below to reply" },
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Reply Now",
                style: 1,
                url: deepLink,
              },
            ],
          },
        ],
      }),
    });

    return res.ok;
  } catch (error) {
    console.error("Discord notification failed:", error);
    return false;
  }
}

/**
 * Send Web Push Notification (for PWA)
 */
export async function sendPushNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      return false;
    }

    if (Notification.permission !== "granted") {
      return false;
    }

    const deepLink = generateDeepLink(payload.sessionId);
    const registration = await navigator.serviceWorker.ready;

    if (registration.showNotification) {
      await registration.showNotification(`New Request from ${payload.userName}`, {
        body: `"${payload.message}" - Cart: $${payload.cartValue.toFixed(2)}`,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%23000000' width='192' height='192'/><text x='50%' y='50%' font-size='120' font-weight='bold' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'>💬</text></svg>",
        badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect fill='%23000000' width='96' height='96'/><text x='48' y='48' font-size='60' text-anchor='middle' dominant-baseline='middle'>💬</text></svg>",
        tag: `support-${payload.sessionId}`,
        requireInteraction: true,
        data: {
          url: deepLink,
          sessionId: payload.sessionId,
        },
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error("Push notification failed:", error);
    return false;
  }
}

/**
 * Main dispatcher function - routes to all enabled channels
 */
export async function dispatchNotification(
  payload: NotificationPayload,
  config: DispatcherConfig
): Promise<{
  email: boolean;
  telegram: boolean;
  discord: boolean;
  push: boolean;
}> {
  const results = {
    email: false,
    telegram: false,
    discord: false,
    push: false,
  };

  // Send to Email
  if (config.ownerEmail) {
    results.email = await sendEmailNotification(payload, config.ownerEmail);
  }

  // Send to Telegram
  if (config.telegramBotToken && config.telegramChatId) {
    results.telegram = await sendTelegramNotification(
      payload,
      config.telegramBotToken,
      config.telegramChatId
    );
  }

  // Send to Discord
  if (config.discordWebhookUrl) {
    results.discord = await sendDiscordNotification(payload, config.discordWebhookUrl);
  }

  // Send Web Push
  if (config.enablePushNotifications) {
    results.push = await sendPushNotification(payload);
  }

  return results;
}
