/**
 * contact-config.js - Centralized Contact & WhatsApp Configuration
 * 
 * Single Source of Truth for contact information and WhatsApp integration across CREWiiFY.
 */

export const CONTACT_CONFIG = {
  // WhatsApp destination number (country code + number without symbols or spaces)
  // REPLACE THIS PLACEHOLDER WITH THE CLIENT'S CONFIRMED LIVE WHATSAPP NUMBER:
  WHATSAPP_NUMBER: '919765805364',

  // Formatted phone/WhatsApp number for visual display in UI
  PHONE_DISPLAY: '+91 97658 05364',

  // Confirmed Client Email Address
  EMAIL: 'Partners@crewiify.com',

  // Expected Response Time Window
  RESPONSE_TIME: 'Typically within 1 business day.',

  // Default message for global floating WhatsApp button
  FLOATING_MESSAGE: "Hi CREWiiFY, I'd like to know more about your services."
};

/**
 * Generate standard WhatsApp URL with encoded message
 * @param {string} message - Custom message to send
 * @returns {string} Fully encoded WhatsApp URL
 */
export function getWhatsAppUrl(message = CONTACT_CONFIG.FLOATING_MESSAGE) {
  const cleanNumber = (CONTACT_CONFIG.WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent((message || '').trim());
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

// Make globally available on window for non-module scripts if needed
if (typeof window !== 'undefined') {
  window.CREWIIFY_CONTACT_CONFIG = CONTACT_CONFIG;
  window.getWhatsAppUrl = getWhatsAppUrl;
}
