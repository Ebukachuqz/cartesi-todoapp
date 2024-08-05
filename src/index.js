const { ethers } = require("ethers");
const axios = require("axios");
const TodoManager = require("./todoManager");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function hex2str(hex) {
  return ethers.toUtf8String(hex);
}

function str2hex(payload) {
  return ethers.hexlify(ethers.toUtf8Bytes(payload));
}

const todoManager = new TodoManager();

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const metadata = data["metadata"];
  const sender = metadata["msg_sender"];
  const payload = data["payload"];

  // Convert hex payload to string
  const payloadStr = ethers.utils.toUtf8String(payload);

  // Parse JSON string
  let payloadJson;
  try {
    payloadJson = JSON.parse(payloadStr);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    const reportReq = await axios.post(rollup_server + "/report", {
      payload: ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes("Error parsing JSON: " + error.message)
      ),
    });
    return "reject";
  }

  let responseMessage;

  if (payload.action === "create") {
    const todo = todoManager.createTodo(sender, payload.content);
    responseMessage = `Todo created: ${JSON.stringify(todo)}`;
  } else if (payload.action === "delete") {
    const success = todoManager.deleteTodo(sender, payload.id);
    responseMessage = success
      ? `Todo ${payload.id} deleted`
      : `Todo ${payload.id} not found or not authorized`;
  } else if (payload.action === "update") {
    const todo = todoManager.updateTodo(
      sender,
      payload.id,
      payload.content,
      payload.completed
    );
    responseMessage = todo
      ? `Todo updated: ${JSON.stringify(todo)}`
      : `Todo ${payload.id} not found or not authorized`;
  } else {
    responseMessage = "Invalid action";
  }

  await axios.post(
    rollup_server + "/notice",
    {
      payload: str2hex(responseMessage),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));

  const payload = data["payload"];
  const route = hex2str(payload);

  let responseObject;

  if (route === "all") {
    responseObject = JSON.stringify(todoManager.getTodos(sender));
  } else if (route.startsWith("id")) {
    const id = parseInt(route.split("/").at(-1));
    const todo = todoManager.getTodoById(id);
    responseObject = todo
      ? JSON.stringify(todo)
      : "Todo not found or not authorized";
  } else {
    responseObject = "Invalid route";
  }

  await axios.post(
    rollup_server + "/report",
    {
      payload: str2hex(responseObject),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

(async () => {
  while (true) {
    const finish_req = await axios.post(
      rollup_server + "/finish",
      { status: "accept" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status === 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = finish_req.data;
      const handler = handlers[rollup_req["request_type"]];
      await handler(rollup_req["data"]);
    }
  }
})();
