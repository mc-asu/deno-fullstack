import { Application } from "https://deno.land/x/oak/mod.ts";
import { CORS } from "https://deno.land/x/oak_cors@v0.1.1/mod.ts";
import { connect } from "./helpers/db_client.ts";

import todosRoutes from './routes/todos.ts';

connect()
 
const app = new Application();
app.use(CORS());
 
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });

