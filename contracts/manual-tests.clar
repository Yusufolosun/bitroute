;; Manual Test Script for router.clar
;; Run this in clarinet console to test all functions

;; Test 1: Check initial paused state (should be false)
(print "Test 1: is-paused (should return false)")
(contract-call? .router is-paused)

;; Test 2: Get best route
(print "Test 2: get-best-route (should return ALEX as best DEX)")
(contract-call? .router get-best-route 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-a
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-b
  u1000)

;; Test 3: Get initial DEX volume (should be 0)
(print "Test 3: get-dex-volume for ALEX (should return 0)")
(contract-call? .router get-dex-volume u1)

;; Test 4: Get initial user stats (should be 0)
(print "Test 4: get-user-stats (should return 0 swaps and volume)")
(contract-call? .router get-user-stats tx-sender)

;; Test 5: Pause contract (only owner can do this)
(print "Test 5: set-paused to true (should succeed for owner)")
(contract-call? .router set-paused true)

;; Test 6: Verify paused state
(print "Test 6: is-paused (should now return true)")
(contract-call? .router is-paused)

;; Test 7: Unpause contract
(print "Test 7: set-paused to false (unpause)")
(contract-call? .router set-paused false)

;; Test 8: Verify unpaused
(print "Test 8: is-paused (should return false again)")
(contract-call? .router is-paused)

(print "All tests completed!")
