/**
 * Enum for Task Statuses
 * @readonly
 * @enum {string}
 */
export const ETATS = {
    NOUVEAUX: 'Nouveaux',
    EN_COURS: 'En cours',
    REUSSI: 'Réussi',
    EN_ATTENTE: 'En attente',
    ABANDONNE: 'Abandonné',
}

/**
 * Array of statuses considered as "Finished"
 * @constant {string[]}
 */
export const ETAT_TERMINE = [
    ETATS.REUSSI,
    ETATS.ABANDONNE,
];