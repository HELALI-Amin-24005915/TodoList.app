/**
 * @fileoverview Shared domain constants for task lifecycle states.
 * This module centralizes canonical status values so creation, editing,
 * filtering, and analytics all operate on the same vocabulary.
 */
/**
 * Canonical task status values.
 * @readonly
 * @enum {string}
 */
export const ETATS = {
    NOUVEAU: 'Nouveau',
    EN_COURS: 'En cours',
    REUSSI: 'Réussi',
    EN_ATTENTE: 'En attente',
    ABANDONNE: 'Abandonné',
}

/**
 * Statuses considered terminal/finished in business rules.
 * @constant {string[]}
 */
export const ETAT_TERMINE = [
    ETATS.REUSSI,
    ETATS.ABANDONNE,
];