(define-fungible-token mock-token)
(define-trait ft-trait
  ((transfer (uint principal principal (optional (buff 34))) (response bool uint))
   (get-balance (principal) (response uint uint))
   (get-decimals () (response uint uint))))

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) (err u100))
    (ft-transfer? mock-token amount sender recipient)
  )
)

(define-read-only (get-balance (owner principal))
  (ok (ft-get-balance mock-token owner)))

(define-read-only (get-decimals)
  (ok u6))