/**
 * contact.js - CREWiiFY Contact Form & Backend Email Submission Logic
 * 
 * Features:
 * 1. Form Data Collection & Client-Side Validation
 * 2. Honeypot Spam Protection
 * 3. Asynchronous Submission to /api/contact.php
 * 4. Comprehensive Success / Error UX Handling
 * 5. Independent WhatsApp Float Widget Integration
 */

import { CONTACT_CONFIG, getWhatsAppUrl } from './contact-config.js';

/**
 * Validates the contact form fields client-side
 * @param {Object} data - Collected form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateContactForm(data) {
  const errors = {};

  // 1. Full Name (Required, minimum 2 characters)
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  // 2. Agency / Company Name (Required, minimum 2 characters)
  if (!data.agencyName || data.agencyName.trim().length < 2) {
    errors.agencyName = 'Please enter your agency or company name.';
  }

  // 3. Work Email (Required, valid email format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid work email address.';
  }

  // 4. Project Type (Required, must select an option)
  if (!data.projectType || data.projectType.trim() === '') {
    errors.projectType = 'Please select a project type.';
  }

  // 5. Message (Required, minimum 10 characters)
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Please provide a brief description of your project (minimum 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Initializes the contact page form and event listeners
 */
export function initContactForm() {
  const form = document.getElementById('contactPageForm');
  if (!form) return;

  // Render configured direct contact details into UI elements
  const emailElem = document.getElementById('contactDirectEmail');
  const emailLink = document.getElementById('contactDirectEmailLink');
  const phoneElem = document.getElementById('contactDirectPhone');
  const responseElem = document.getElementById('contactDirectResponse');

  if (emailElem) {
    emailElem.textContent = CONTACT_CONFIG.EMAIL;
  }
  if (emailLink) {
    emailLink.href = `mailto:${CONTACT_CONFIG.EMAIL}`;
  }
  if (phoneElem) {
    phoneElem.textContent = CONTACT_CONFIG.PHONE_DISPLAY;
    phoneElem.href = getWhatsAppUrl(CONTACT_CONFIG.FLOATING_MESSAGE);
  }
  if (responseElem) {
    responseElem.textContent = CONTACT_CONFIG.RESPONSE_TIME;
  }

  // Handle URL Query Params (e.g. ?type=SEO or ?service=seo)
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type') || urlParams.get('service') || urlParams.get('subject');
  if (typeParam && form.projectType) {
    const cleanType = typeParam.trim().toLowerCase();
    const options = Array.from(form.projectType.options);
    const matchedOption = options.find(opt => {
      const optVal = opt.value.toLowerCase();
      return optVal === cleanType || 
        (cleanType.includes('seo') && optVal === 'seo') ||
        (cleanType.includes('ppc') && optVal === 'google ads / ppc') ||
        (cleanType.includes('web') && optVal === 'website development');
    });
    if (matchedOption) {
      form.projectType.value = matchedOption.value;
    }
  }

  // Clear validation error on field input / change
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      clearFieldError(field);
    });
    field.addEventListener('change', () => {
      clearFieldError(field);
    });
  });

  // Handle Form Submission
  let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Collect data
    const formData = {
      fullName: form.fullName?.value || '',
      agencyName: form.agencyName?.value || '',
      email: form.email?.value || '',
      phone: form.phone?.value || '',
      projectType: form.projectType?.value || '',
      message: form.message?.value || '',
      website_hp: form.website_hp?.value || '' // Honeypot
    };

    // Clear previous errors & status
    clearAllErrors(form);
    hideStatusMessage();

    // Client-side validation
    const { isValid, errors } = validateContactForm(formData);

    if (!isValid) {
      displayErrors(form, errors);
      const firstErrorField = form.querySelector('.is-invalid');
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    // Lock submission & update button state
    isSubmitting = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Book a Free Consultation <span aria-hidden="true">→</span>';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="contact-form__spinner" aria-hidden="true"></span>
        Sending...
      `;
    }

    try {
      const response = await fetch('api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result && result.success) {
        // Success
        showStatusMessage(
          result.message || "Thanks — we've received your enquiry. We'll get back to you shortly.",
          'success'
        );
        form.reset();
      } else {
        // Validation or Server Error
        if (result && result.errors) {
          displayErrors(form, result.errors);
        }
        const errorMsg = (result && result.message)
          ? result.message
          : "Something went wrong while sending your enquiry. Please try again or contact us on WhatsApp.";
        showStatusMessage(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Contact Form Submission Network Error:', error);
      showStatusMessage(
        "Something went wrong while sending your enquiry. Please try again or contact us on WhatsApp.",
        'error'
      );
    } finally {
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
}

/**
 * Display field-level validation errors
 */
function displayErrors(form, errors) {
  Object.keys(errors).forEach(fieldName => {
    const field = form[fieldName];
    if (!field) return;

    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');

    const errorContainer = document.getElementById(`${fieldName}Error`);
    if (errorContainer) {
      errorContainer.textContent = errors[fieldName];
      errorContainer.style.display = 'block';
    }
  });
}

/**
 * Clear error state for a single field
 */
function clearFieldError(field) {
  field.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');
  const errorContainer = document.getElementById(`${field.name || field.id}Error`);
  if (errorContainer) {
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
  }
}

/**
 * Clear all errors across the form
 */
function clearAllErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(field => {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
  });
  form.querySelectorAll('.contact-form__error-msg').forEach(msg => {
    msg.textContent = '';
    msg.style.display = 'none';
  });
}

/**
 * Display global status notice (success or error)
 */
function showStatusMessage(message, type = 'success') {
  const statusElem = document.getElementById('contactFormStatus');
  if (!statusElem) return;

  statusElem.className = `contact-form__status is-${type}`;
  
  const iconSvg = type === 'success'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  statusElem.innerHTML = `
    <span class="contact-form__status-icon" aria-hidden="true">${iconSvg}</span>
    <span class="contact-form__status-text">${message}</span>
  `;
  statusElem.style.display = 'flex';
}

/**
 * Hide global status notice
 */
function hideStatusMessage() {
  const statusElem = document.getElementById('contactFormStatus');
  if (statusElem) {
    statusElem.style.display = 'none';
    statusElem.innerHTML = '';
  }
}

// Auto-initialize if running directly
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
}
