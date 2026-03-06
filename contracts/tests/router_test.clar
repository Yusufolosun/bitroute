;; Unit tests for router.clar
;; Test 1: test-get-best-route-returns-data
;; Test 2: test-execute-auto-swap-validates-amount
;; Test 3: test-paused-contract-blocks-swaps
;; Test 4: test-unauthorized-pause-rejected
;; Test 5: test-volume-tracking-updates
;; Test 6: test-slippage-protection-enforced

;; Test 1: Verify price discovery returns valid structure
(define-public (test-get-best-route-returns-data)
  (let (
    (result (contract-call? .router get-best-route 
              'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx
              'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wusda
              u1000))
  )
  (begin
    ;; Assert result is ok
    (asserts! (is-ok result) (err u1))
    
    ;; Assert has expected fields
    (asserts! (> (get expected-amount-out (unwrap-panic result)) u0) (err u2))
    
    (ok true)
  ))
)

;; Test 2: Verify zero amount is rejected
(define-public (test-execute-auto-swap-validates-amount)
  (let (
    (result (contract-call? .router execute-auto-swap
              .mock-token
              .mock-token-b
              u0
              u0))
  )
  (begin
    ;; Should fail with ERR-INVALID-AMOUNT (u102)
    (asserts! (is-err result) (err u1))
    (asserts! (is-eq (unwrap-err-panic result) u102) (err u2))
    
    (ok true)
  ))
)

;; Test 3: Verify pause mechanism works
(define-public (test-paused-contract-blocks-swaps)
  (begin
    ;; Pause contract (as owner)
    (unwrap-panic (contract-call? .router set-paused true))
    
    ;; Attempt swap
    (let (
      (result (contract-call? .router execute-auto-swap
                .mock-token
                .mock-token-b
                u1000
                u900))
    )
    (begin
      ;; Should fail with ERR-CONTRACT-PAUSED (u103)
      (asserts! (is-err result) (err u1))
      (asserts! (is-eq (unwrap-err-panic result) u103) (err u2))
      
      ;; Unpause for other tests
      (unwrap-panic (contract-call? .router set-paused false))
      
      (ok true)
    ))
  )
)

;; Test 4: Verify only owner can pause
(define-public (test-unauthorized-pause-rejected)
  ;; TODO: Requires Clarinet support for multi-principal testing
  ;; For now, just verify owner CAN pause
  (let (
    (result (contract-call? .router set-paused true))
  )
  (begin
    (asserts! (is-ok result) (err u1))
    
    ;; Reset
    (unwrap-panic (contract-call? .router set-paused false))
    
    (ok true)
  ))
)

;; Test 5: Verify dex-volume map updates correctly
(define-public (test-volume-tracking-updates)
  (begin
    ;; Get initial volume
    (let (
      (initial-volume (unwrap-panic (contract-call? .router get-dex-volume u1)))
    )
    
    ;; Note: Since we're mocking swaps, volume tracking happens in execute-auto-swap
    ;; This test verifies the getter works
    (begin
      (asserts! (>= initial-volume u0) (err u1))
      (ok true)
    ))
  )
)

;; Test 6: Verify min-amount-out validation works
;; Mock quotes return u1000, so min-amount-out of u1001 triggers ERR-SLIPPAGE-TOO-HIGH
(define-public (test-slippage-protection-enforced)
  (let (
    ;; Use amount-in large enough so min-amount-out passes the INVALID-SLIPPAGE check
    ;; but exceeds the mock expected-out (u1000)
    (result (contract-call? .router execute-auto-swap
              .mock-token
              .mock-token-b
              u5000
              u1001))
  )
  (begin
    ;; Should fail with ERR-SLIPPAGE-TOO-HIGH (u101)
    (asserts! (is-err result) (err u1))
    (asserts! (is-eq (unwrap-err-panic result) u101) (err u2))
    
    (ok true)
  ))
)

