;; Voter Registration Contract

;; Define data structures
(define-map registered-voters principal bool)
(define-data-var registration-open bool true)
(define-data-var contract-owner principal tx-sender)

;; Error codes
(define-constant err-already-registered (err u100))
(define-constant err-not-registered (err u101))
(define-constant err-registration-closed (err u102))
(define-constant err-unauthorized (err u103))

;; Functions
(define-public (register-voter)
  (begin
    (asserts! (var-get registration-open) err-registration-closed)
    (asserts! (is-none (map-get? registered-voters tx-sender)) err-already-registered)
    (ok (map-set registered-voters tx-sender true))
  )
)

(define-public (unregister-voter)
  (begin
    (asserts! (is-some (map-get? registered-voters tx-sender)) err-not-registered)
    (ok (map-delete registered-voters tx-sender))
  )
)

(define-public (close-registration)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-unauthorized)
    (ok (var-set registration-open false))
  )
)

(define-public (open-registration)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-unauthorized)
    (ok (var-set registration-open true))
  )
)

(define-read-only (is-registered (voter principal))
  (default-to false (map-get? registered-voters voter))
)

(define-read-only (is-registration-open)
  (var-get registration-open)
)

