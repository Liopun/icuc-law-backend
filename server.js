const app  = require("./app"),
      keys = require('config');

const PORT = keys.get('port') || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));