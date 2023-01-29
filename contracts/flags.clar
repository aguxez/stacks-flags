;; title: flags
;; version:
;; summary: Flow control for contracts through feature flags
;; description:

;; traits
;;
(define-trait flags-trait
  (
    (set-flag (principal uint bool) (response bool uint))
    (is-owner (principal) (response bool uint))
    (is-flag-on (principal uint) (response bool uint))
  )
)

(use-trait ownership-trait .ownable.owner-trait)

;; constants
;;
(define-constant err-not-owner (err u1))

;; data maps
;;
(define-map contract-owner {contract: principal, owner: principal} bool)
(define-map flags {contract: principal, name: (buff 32)} bool)

;; public functions
;;
;; #[allow(unchecked_data)]
(define-public (set-flag (contract principal) (flag-name (buff 32)) (state bool))
  (begin
    (asserts! (is-owner contract) err-not-owner)
    (ok (map-set flags {contract: contract, name: flag-name} state))
  )
)

(define-public (set-contract-owner (contract <ownership-trait>))
  (let
    (
      (owner (try! (as-contract (contract-call? contract owner))))
    )
    (asserts! (is-eq owner tx-sender) err-not-owner)
    (ok (map-set contract-owner {contract: (contract-of contract), owner: tx-sender} true))
  )
)

;; read only functions
;;
(define-read-only (is-owner (contract principal))
  (default-to false (map-get? contract-owner {contract: contract, owner: tx-sender}))
)

(define-read-only (is-flag-on (contract principal) (flag-name (buff 32)))
  (default-to false (map-get? flags {contract: contract, name: flag-name}))
)
