(define-fungible-token mock-token-b)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) (err u100))
    (ft-transfer? mock-token-b amount sender recipient)
  )
)

(define-read-only (get-balance (owner principal))
  (ok (ft-get-balance mock-token-b owner)))

(define-read-only (get-decimals)
  (ok u6))