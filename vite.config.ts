import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'crypto';
import {defineConfig} from 'vite';

function cardApiPlugin() {
  return {
    name: 'card-api-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/v1/cards/issue', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = body ? JSON.parse(body) : {};
              const taxId = String(data.taxId || data.tax_id || '').trim();
              const cardType = data.cardType || data.card_type || 'VIRTUAL_DEBIT';
              const requestedLimit = Number(data.requestedCreditLimit ?? data.requested_credit_limit ?? 0);

              // KYC check: starts with '000'
              if (taxId.startsWith('000')) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  detail: 'Compliance check failed: Tax ID flagged in AML watchlists',
                  status: 'REJECTED_BY_COMPLIANCE',
                  application_id: 'GAP-REJECTED',
                  iban: 'UNASSIGNED',
                  card_number_masked: 'XXXX XXXX XXXX XXXX',
                  assigned_limit: 0.0,
                  compliance_approved: false,
                }));
                return;
              }

              // Assigned limit
              const assignedLimit = cardType === 'CORPORATE_CREDIT' ? Math.min(requestedLimit, 15000.0) : 0.0;
              const appId = 'GAP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
              const taxHash = crypto.createHash('sha256').update(taxId || 'TAX').digest('hex');
              const iban = 'GB89GLOB' + taxHash.substring(0, 14).toUpperCase();
              const appHash = crypto.createHash('sha256').update(appId).digest('hex');
              const cardMask = '4000 12XX XXXX ' + appHash.substring(0, 4);

              res.statusCode = 201;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                application_id: appId,
                iban,
                card_number_masked: cardMask,
                expiry_date: '09/31',
                status: 'ISSUED_AND_ACTIVE',
                assigned_limit: assignedLimit,
                compliance_approved: true,
              }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: 'Internal error' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cardApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
