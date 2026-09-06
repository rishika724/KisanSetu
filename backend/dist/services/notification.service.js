"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchNotification = dispatchNotification;
const util_1 = require("util");
const DEFAULT_PREFERENCES = { sms: true, whatsapp: true };
const templates = {
    bookingConfirmation: {
        en: 'Kisan Setu: Hello %s, your slot at %s is confirmed for %s at %s. Token No: %s. QR Pass: %s',
        hi: 'किसान सेतु: नमस्ते %s, %s में आपका स्लॉट %s को %s बजे सुनिश्चित है। टोकन: %s। QR पास: %s',
        regional: 'Kisan Setu: Namaskara %s, your slot at %s is confirmed for %s at %s. Token No: %s. QR Pass: %s'
    },
    gateEntry: {
        en: 'Kisan Setu: Vehicle %s has entered %s Staging Yard. Current Queue Position: #%s.',
        hi: 'किसान सेतु: वाहन %s ने %s के स्टेजिंग यार्ड में प्रवेश किया है। वर्तमान कतार स्थिति: #%s।',
        regional: 'Kisan Setu: Vehicle %s has entered %s Staging Yard. Current Queue Position: #%s.'
    },
    paymentReceipt: {
        en: 'Kisan Setu: Quality Check Complete! Total Weight: %s Qtl. Disbursed Amount: ₹%s. Payment reference sent to your bank.',
        hi: 'किसान सेतु: गुणवत्ता जांच पूर्ण! कुल वजन: %s क्विंटल। वितरित राशि: ₹%s। भुगतान संदर्भ आपके बैंक को भेजा गया है।',
        regional: 'Kisan Setu: Quality Check Complete! Total Weight: %s Qtl. Disbursed Amount: ₹%s. Payment reference sent to your bank.'
    }
};
function renderMessage(request) {
    const language = request.language || 'en';
    const template = templates[request.template][language];
    const values = request.template === 'bookingConfirmation'
        ? [request.values.name, request.values.mandiName, request.values.date, request.values.time, request.values.token, request.values.passLink]
        : request.template === 'gateEntry'
            ? [request.values.vehicleNo, request.values.mandiName, request.values.position]
            : [request.values.weight, request.values.payout];
    return (0, util_1.format)(template, ...values);
}
async function sendSms(phone, message) {
    if (!process.env.FAST2SMS_API_KEY)
        return false;
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: { authorization: process.env.FAST2SMS_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: 'q', message, language: 'english', flash: 0, numbers: phone })
    });
    return response.ok;
}
async function sendWhatsApp(phone, message) {
    if (!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID)
        return false;
    const response = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: 'whatsapp', to: phone, type: 'text', text: { body: message } })
    });
    return response.ok;
}
async function dispatchNotification(request) {
    const preferences = { ...DEFAULT_PREFERENCES, ...request.preferences };
    const message = renderMessage(request);
    const sentAt = new Date().toISOString();
    const results = [];
    for (const [channel, enabled] of Object.entries(preferences)) {
        if (!enabled)
            continue;
        const configured = channel === 'sms' ? Boolean(process.env.FAST2SMS_API_KEY) : Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
        let delivered = false;
        if (configured) {
            try {
                delivered = channel === 'sms' ? await sendSms(request.phone, message) : await sendWhatsApp(request.phone, message);
            }
            catch (error) {
                console.error(`${channel} notification failed:`, error);
            }
        }
        results.push({ channel, delivered: configured && delivered, simulated: !configured || !delivered, message, sentAt });
    }
    return results;
}
