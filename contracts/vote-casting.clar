;; Vote Casting Contract

;; Define data structures
(define-map votes
  { ballot-id: uint, voter: principal }
  { option-index: uint }
)

;; Error codes
(define-constant err-unauthorized (err u100))
(define-constant err-ballot-not-found (err u101))
(define-constant err-invalid-option (err u102))
(define-constant err-already-voted (err u103))

;; Functions
(define-public (cast-vote (ballot-id uint) (option-index uint))
  (let
    ((ballot (unwrap! (contract-call? .ballot-creation get-ballot ballot-id) err-ballot-not-found))
     (options (unwrap! (contract-call? .ballot-creation get-ballot-options ballot-id) err-ballot-not-found)))
    (asserts! (contract-call? .voter-registration is-registered tx-sender) err-unauthorized)
    (asserts! (< option-index (len options)) err-invalid-option)
    (asserts! (is-none (map-get? votes { ballot-id: ballot-id, voter: tx-sender })) err-already-voted)
    (ok (map-set votes { ballot-id: ballot-id, voter: tx-sender } { option-index: option-index }))
  )
)

(define-read-only (get-vote (ballot-id uint) (voter principal))
  (map-get? votes { ballot-id: ballot-id, voter: voter })
)

