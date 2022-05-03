/**
 * Sorts series from lowest price to highest
 *
 * @arg {{data: string, cena: number}} a
 * @arg {{data: string, cena: number}} b
 */
export default (a, b) => a.cena - b.cena;
