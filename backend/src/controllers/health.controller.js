const getHealth = (_request, response) => {
  response.json({ status: "ok" });
};

module.exports = {
  getHealth,
};

