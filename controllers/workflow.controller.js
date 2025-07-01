import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import { sendReminders } from '../services/workflow.service.js';

export const sendRemindersWorkflow = serve(sendReminders);
