;; BitRoute Router Tests

(define-constant deployer tx-sender)
(define-constant wallet-1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant wallet-2 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)

;; Test: Create a new route
(define-public (test-create-route)
  (let
    (
      (result (contract-call? .router create-route "source-address-1" "dest-address-1" u1000))
    )
    (asserts! (is-ok result) (err u1))
    (asserts! (is-eq (unwrap-panic result) u1) (err u2))
    (ok true)
  )
)

;; Test: Get route by ID
(define-public (test-get-route)
  (let
    (
      (route-id (unwrap-panic (contract-call? .router create-route "source-2" "dest-2" u2000)))
      (route (unwrap-panic (contract-call? .router get-route route-id)))
    )
    (asserts! (is-eq (get fee route) u2000) (err u3))
    (asserts! (is-eq (get active route) true) (err u4))
    (ok true)
  )
)

;; Test: Update route
(define-public (test-update-route)
  (let
    (
      (route-id (unwrap-panic (contract-call? .router create-route "source-3" "dest-3" u3000)))
      (update-result (contract-call? .router update-route route-id u3500 true))
      (updated-route (unwrap-panic (contract-call? .router get-route route-id)))
    )
    (asserts! (is-ok update-result) (err u5))
    (asserts! (is-eq (get fee updated-route) u3500) (err u6))
    (ok true)
  )
)

;; Test: Deactivate route
(define-public (test-deactivate-route)
  (let
    (
      (route-id (unwrap-panic (contract-call? .router create-route "source-4" "dest-4" u4000)))
      (deactivate-result (contract-call? .router deactivate-route route-id))
      (deactivated-route (unwrap-panic (contract-call? .router get-route route-id)))
    )
    (asserts! (is-ok deactivate-result) (err u7))
    (asserts! (is-eq (get active deactivated-route) false) (err u8))
    (ok true)
  )
)

;; Test: Get route counter
(define-public (test-route-counter)
  (begin
    (unwrap-panic (contract-call? .router create-route "source-5" "dest-5" u5000))
    (unwrap-panic (contract-call? .router create-route "source-6" "dest-6" u6000))
    (let
      (
        (counter (contract-call? .router get-route-counter))
      )
      (asserts! (>= counter u2) (err u9))
      (ok true)
    )
  )
)
