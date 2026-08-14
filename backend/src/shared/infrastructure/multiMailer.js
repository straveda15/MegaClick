/**
 * @deprecated All functionality has been consolidated into shared/infrastructure/mailer.js.
 * This module is a thin re-export shim kept for import compatibility.
 * Update any remaining imports to use mailer.js directly.
 */
export {
  getTransporterForAccount,
  sendFromAccount,
  getContactRecipients as getRoundRobinRecipients,
} from "./mailer.js";
