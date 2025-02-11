;; Ballot Creation Contract

;; Define data structures
(define-map ballots
  { ballot-id: uint }
  { title: (string-utf8 64), options: (list 10 (string-utf8 64)), creator: principal }
)
(define-data-var last-ballot-id uint u0)

;; Error codes
(define-constant err-unauthorized (err u100))
(define-constant err-ballot-not-found (err u101))
(define-constant err-too-many-options (err u102))

;; Functions
(define-public (create-ballot (title (string-utf8 64)) (options (list 10 (string-utf8 64))))
  (let
    ((new-ballot-id (+ (var-get last-ballot-id) u1)))
    (asserts! (<= (len options) u10) err-too-many-options)
    (map-set ballots
      { ballot-id: new-ballot-id }
      { title: title, options: options, creator: tx-sender }
    )
    (var-set last-ballot-id new-ballot-id)
    (ok new-ballot-id)
  )
)

(define-public (close-ballot (ballot-id uint))
  (let
    ((ballot (unwrap! (map-get? ballots { ballot-id: ballot-id }) err-ballot-not-found)))
    (asserts! (is-eq tx-sender (get creator ballot)) err-unauthorized)
    (ok (map-delete ballots { ballot-id: ballot-id }))
  )
)

(define-read-only (get-ballot (ballot-id uint))
  (map-get? ballots { ballot-id: ballot-id })
)

(define-read-only (get-ballot-options (ballot-id uint))
  (match (map-get? ballots { ballot-id: ballot-id })
    ballot (ok (get options ballot))
    (err err-ballot-not-found)
  )
)

