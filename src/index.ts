import params from "./configs/params";
import * as http from "http";
import api from "./api";

const server: http.Server = http.createServer(api);

server.listen(params.apiPort);

server.on("listening", () => {
  console.dir(`Server listening on port ${(server.address() as any).port}`);
});
