# BitRoute Pre-Launch Checklist

This checklist covers all tasks that MUST be completed and verified before BitRoute is deployed to the Stacks mainnet.

## 🛡️ Security & Auditing
- [ ] **Contract Hardening**: Verify all parameter validations are active and tested.
- [ ] **Admin Transition**: Ensure the two-step admin transfer mechanism is verified.
- [ ] **Static Analysis**: Run `clarinet check` and ensure zero errors or warnings.
- [ ] **Audit Review**: Address all findings from the internal security review.
- [ ] **Emergency Pausing**: Test the emergency pause function with multiple scenarios.
- [ ] **Reentrancy Check**: Verify that all public functions are secured against reentrancy.

## ⚖️ Legal & Compliance
- [ ] **Terms of Service**: Ensure the latest TOS is linked and visible in the footer.
- [ ] **Privacy Policy**: Verify the privacy policy is accessible and accurate.
- [ ] **Risk Disclosures**: Confirm that users must acknowledge risk disclosures before swapping.
- [ ] **Jurisdiction Blocking**: Verify that any required geo-blocking is active.

## 🚀 Production Infrastructure
- [ ] **Sentry Monitoring**: Confirm that errors are correctly captured on the production DSN.
- [ ] **Analytics**: Verify that swap and quote events are being recorded in GA4.
- [ ] **Uptime Checks**: Ensure the `uptime-check.sh` is scheduled and alerts are active.
- [ ] **Performance Tracking**: Review Web Vitals in production to ensure optimal loading.
- [ ] **Logging**: Confirm that structured logs are searchable in the production environment.
- [ ] **Env Validation**: Double-check all production environment variables (API URLs, Contract IDs).

## 🧪 Testing Verification
- [ ] **Gas Benchmarks**: Confirm that gas costs for `auto-route-swap` are within limits.
- [ ] **Edge Cases**: Verify that zero-amount and same-token swaps fail gracefully.
- [ ] **Multi-Wallet**: Test UI and contract with Xverse, Leather, and Hiro wallets.
- [ ] **E2E Tests**: Run full suite on a staging environment.
- [ ] **Load Testing**: Verify that read-only functions can handle concurrent user load.

## 🛠️ Deployment Steps
1. **Contract Deployment**: Deploy `router.clar` to mainnet using a hardware wallet.
2. **Post-Deployment Verification**: Verify the contract source on Stacks Explorer.
3. **Frontend Build**: Run `npm run build` and verify bundle size optimizations.
4. **Vercel/Hosting**: Deploy to production environment with restricted access during warmup.
5. **Initial Warmup**: Perform test swaps with small amounts to verify mainnet routing.

## ✅ Final Approval
- [ ] Security Sign-off
- [ ] Legal Sign-off
- [ ] Lead Developer Sign-off
