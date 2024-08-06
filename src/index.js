import { ROLLUP_SERVER } from './utils/config';
import { hexToString } from 'viem';
import { RollupStateHandler } from './utils/rollupStateHandler';
import { TodoController } from './controller/todoController';

console.log("HTTP ROLLUP_SERVER url is ", ROLLUP_SERVER);


async function handle_advance(data) {
  console.log('Received advance raw data: ', JSON.stringify(data));
  const rawPayload = hexToString(data.payload);
  const payload = JSON.parse(rawPayload);

  const metadata = data["metadata"];
  const sender = metadata["msg_sender"];

  console.log("metadata is ", metadata);
  
  switch (payload.action) {
    case "create":
      return await TodoController.createTodoAction(sender, payload.data)
  
    case "delete":
      return await TodoController.deleteTodoAction(sender, payload.data);
  
    case "update":
      return await TodoController.updateTodoAction(sender, payload.data);
    default:
      return await RollupStateHandler.handleReport({
        error: "Invalid Action",
      });
  }
}

async function handle_inspect(data) {
  console.log("Received inspect request data ", JSON.stringify(data));

  const urlParams = hexToString(data.payload);
  const urlParamsSplited = urlParams.split("/");
  const route = urlParamsSplited[0];

  if (route === "all") {
    return await TodoController.getAllTodos()
  } else if (route === "id") {
    const id = parseInt(urlParamsSplited.at(-1));
    return await TodoController.getTodoById(id);
  } else {
    return await RollupStateHandler.handleReport({
      error: "Invalid Route",
    });
  }
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(ROLLUP_SERVER + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
