
;; title: ownable
;; version: 1.0.0
;; summary:
;; description:

;; traits
;;
(define-trait owner-trait
	(
    (owner () (response principal uint))
  )
)

;; constants
;;
(define-constant contract-owner tx-sender)

(define-read-only (owner) (ok contract-owner))

