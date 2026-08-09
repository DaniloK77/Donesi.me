const stripDiacritics = (value) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "");

module.exports = {
  stripDiacritics,
};
