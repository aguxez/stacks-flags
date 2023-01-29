
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
(define-constant owner tx-sender)

