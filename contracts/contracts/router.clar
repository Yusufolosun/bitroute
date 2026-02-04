;; BitRoute - Bitcoin Route Optimizer
;; A smart contract for optimizing Bitcoin transaction routing

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-route (err u101))
(define-constant err-route-not-found (err u102))

;; Data vars
(define-data-var route-counter uint u0)

;; Data maps
(define-map routes 
  { route-id: uint }
  {
    source: (string-ascii 64),
    destination: (string-ascii 64),
    fee: uint,
    timestamp: uint,
    active: bool
  }
)

(define-map user-routes
  { user: principal }
  { route-ids: (list 100 uint) }
)

;; Read-only functions
(define-read-only (get-route (route-id uint))
  (map-get? routes { route-id: route-id })
)

(define-read-only (get-user-routes (user principal))
  (default-to 
    { route-ids: (list) }
    (map-get? user-routes { user: user })
  )
)

(define-read-only (get-route-counter)
  (var-get route-counter)
)

;; Public functions
(define-public (create-route (source (string-ascii 64)) (destination (string-ascii 64)) (fee uint))
  (let
    (
      (new-route-id (+ (var-get route-counter) u1))
    )
    (map-set routes
      { route-id: new-route-id }
      {
        source: source,
        destination: destination,
        fee: fee,
        timestamp: block-height,
        active: true
      }
    )
    (var-set route-counter new-route-id)
    (ok new-route-id)
  )
)

(define-public (update-route (route-id uint) (fee uint) (active bool))
  (let
    (
      (route (unwrap! (get-route route-id) err-route-not-found))
    )
    (map-set routes
      { route-id: route-id }
      (merge route { fee: fee, active: active })
    )
    (ok true)
  )
)

(define-public (deactivate-route (route-id uint))
  (let
    (
      (route (unwrap! (get-route route-id) err-route-not-found))
    )
    (map-set routes
      { route-id: route-id }
      (merge route { active: false })
    )
    (ok true)
  )
)
