;; Gas Benchmarking Test Suite
;; This contract measures the gas consumption of key router functions

(define-public (benchmark-get-quote)
  (begin
    (print (contract-call? .router get-best-route
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-token
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.router
      u1000000))
    (ok true)
  )
)

(define-public (benchmark-pause-unpause)
  (begin
    (print (contract-call? .router set-paused true))
    (print (contract-call? .router set-paused false))
    (ok true)
  )
)

(define-public (benchmark-read-only-calls)
  (begin
    (print (contract-call? .router is-paused))
    (print (contract-call? .router get-dex-volume u1))
    (print (contract-call? .router get-dex-volume u2))
    (print (contract-call? .router get-user-stats tx-sender))
    (print (contract-call? .router get-protocol-fee))
    (ok true)
  )
)

;; Helper to measure loop gas
(define-public (benchmark-iteration-cost (count uint))
  (let ((items (list u1 u2 u3 u4 u5 u6 u7 u8 u9 u10)))
    (ok (map + items items))
  )
)
