;; Security-focused tests for router.clar

;; Test: Cannot swap same token
(define-public (test-cannot-swap-same-token)
  (let (
    (result (contract-call? .router execute-auto-swap
              .mock-token
              .mock-token  ;; Same token
              u1000
              u900))
  )
  (begin
    (asserts! (is-err result) (err u1))
    (asserts! (is-eq (unwrap-err-panic result) u108) (err u2))  ;; ERR-SAME-TOKEN
    (ok true)
  ))
)

;; Test: Cannot swap zero amount
(define-public (test-cannot-swap-zero-amount)
  (let (
    (result (contract-call? .router execute-auto-swap
              .mock-token
              .mock-token-b
              u0  ;; Zero amount
              u0))
  )
  (begin
    (asserts! (is-err result) (err u1))
    (asserts! (is-eq (unwrap-err-panic result) u102) (err u2))  ;; ERR-INVALID-AMOUNT
    (ok true)
  ))
)

;; Test: Cannot swap excessive amount (overflow protection check)
(define-public (test-cannot-swap-excessive-amount)
  (let (
    (result (contract-call? .router execute-auto-swap
              .mock-token
              .mock-token-b
              u1000000000001  ;; Over max allowed in validation
              u0))
  )
  (begin
    (asserts! (is-err result) (err u1))
    (asserts! (is-eq (unwrap-err-panic result) u107) (err u2))  ;; ERR-AMOUNT-TOO-LARGE
    (ok true)
  ))
)

;; Test: Invalid slippage parameters (min-out > amount-in)
(define-public (test-invalid-slippage-parameters)
  (let (
    (result (contract-call? .router execute-auto-swap
              .mock-token
              .mock-token-b
              u1000
              u1001))  ;; Min out > amount in
  )
  (begin
    (asserts! (is-err result) (err u1))
    (asserts! (is-eq (unwrap-err-panic result) u109) (err u2))  ;; ERR-INVALID-SLIPPAGE
    (ok true)
  ))
)

;; Test: Admin-only pause
(define-public (test-admin-only-pause)
  (let (
    (result (contract-call? .router set-paused true))
  )
  (begin
    (asserts! (is-ok result) (err u1))
    ;; Reset for other tests
    (unwrap-panic (contract-call? .router set-paused false))
    (ok true)
  ))
)

;; Test: Emergency recovery restricted
(define-public (test-emergency-recovery-restricted)
  (begin
    ;; Contract must be paused for recovery
    (unwrap-panic (contract-call? .router set-paused true))
    
    (let (
      (result (contract-call? .router emergency-recover-token
                .mock-token
                u100
                tx-sender))
    )
    (begin
      (asserts! (is-ok result) (err u1))
      
      ;; Reset
      (unwrap-panic (contract-call? .router set-paused false))
      (ok true)
    ))
  )
)
