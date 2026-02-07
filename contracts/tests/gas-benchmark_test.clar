;; Gas Benchmarking Test Suite
;; This contract measures the gas consumption of key router functions

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-public (benchmark-get-quote (token-in <ft-trait>) (token-out <ft-trait>) (amount uint))
  (begin
    (print (contract-call? .router get-best-route token-in token-out amount))
    (ok true)
  )
)

(define-public (benchmark-swap (token-in <ft-trait>) (token-out <ft-trait>) (amount-in uint) (min-amount-out uint))
  (begin
    (print (contract-call? .router swap-alex token-in token-out amount-in min-amount-out))
    (ok true)
  )
)

(define-public (benchmark-multi-swap (token-in <ft-trait>) (token-out <ft-trait>) (amount-in uint) (min-amount-out uint))
  (begin
    (print (contract-call? .router auto-route-swap token-in token-out amount-in min-amount-out))
    (ok true)
  )
)

;; Helper to measure loop gas
(define-public (benchmark-iteration-cost (count uint))
  (let ((items (list u1 u2 u3 u4 u5 u6 u7 u8 u9 u10)))
    (ok (map + items items))
  )
)
