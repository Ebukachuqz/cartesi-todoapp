<a id="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Ebukachuqz/cartesi-todoapp">
    <img src="docs/images/todo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Todo dApp</h3>

  <p align="center">
    The Todo decentralized application documentation.
  </p>
</div>

## About
<p>
    Todo dApp is a decentralized application (dApp) powered by <a href="https://docs.cartesi.io/cartesi-rollups/1.3/">Cartesi</a> Rollups technology.
</p>
<p> 
    It's a digital task management tool that leverages blockchain technology to ensure ownership assurance, secure and reliable task management, and a decentralized network.
</p>

## Getting Started

Below you'll find instructions on how to set up this dApp locally.

### Prerequisites

Here are some packages you need to have installed on your PC:

* [Node.js](https://nodejs.org/en), [npm](https://docs.npmjs.com/cli/v10/configuring-npm/install), [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

* [Docker](https://docs.docker.com/get-docker/)

* [Cartesi CLI](https://docs.cartesi.io/cartesi-rollups/1.3/development/migration/#install-cartesi-cli)
  ```sh
  npm install -g @cartesi/cli
  ```

### Installation

1. Clone this repo
   ```sh
   git clone https://github.com/Ebukachuqz/cartesi-todoapp.git
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Build and run the dApp via `cartesi-cli`
   ```sh
   cartesi build
   ```
   and
   ```sh
   cartesi run
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Here you can access the examples of dApp communication and resource consumption.

### Advanced Handlers
* #### createTodo
  ```js
    description — create a new todo item.
    param data — {action: string, data: object}
  ```
  data sample
  ```json
    { "action": "create", "data": { "content": "Build Cartesi DApp" } }
  ```
  hex sample
  ``` 
  0x7b2022616374696f6e223a2022637265617465222c202264617461223a207b2022636f6e74656e74223a20225461686468646c6b22207d207d
  ```
  interact
    - *via `cartesi cli`*, access your terminal in another window and input these instructions below:
  
    ```sh
    cartesi send generic \
    --dapp=0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e \
    --chain-id=31337 \
    --rpc-url=http://127.0.0.1:8545 \
    --mnemonic-passphrase="test test test test test test test test test test test junk" \
    --mnemonic-index=0 \
    --input='{ "action": "create", "data": { "content": "Build Cartesi DApp" } }'
    ```


* #### updateTodo
  ```js
    description — update an existing todo item.
    param data — { action: string, data: object}
  ```
  data sample
  ```json
    { "action": "update", "data": { "id": 1, "content": "Build Cartesi DApp - Update", "completed": true } }
  ```
  hex sample
  ``` 
  0x7b2022616374696f6e223a2022757064617465222c202264617461223a207b20226964223a20312c2022636f6e74656e74223a20224275696c6420436172746573692044417070202d20557064617465222c2022636f6d706c65746564223a2074727565207d207d
  ```
  interact
    - *via `cartesi cli`*, access your terminal in another window and input these instructions below:
  
    ```sh
    cartesi send generic \
    --dapp=0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e \
    --chain-id=31337 \
    --rpc-url=http://127.0.0.1:8545 \
    --mnemonic-passphrase="test test test test test test test test test test test junk" \
    --mnemonic-index=0 \
    --input='{ "action": "update", "data": { "id": 1, "content": "Build Cartesi DApp - Update", completed: true } }'
    ```

* #### deleteTodo
  ```js
    description — delete an existing todo item.
    param data — { action: string, data: object}
  ```
  data sample
  ```json
    { "action": "delete", "data": { "id":1 } }
  ```
  hex sample
  ``` 
  0x7b2022616374696f6e223a202264656c657465222c202264617461223a207b20226964223a31207d207d
  ```
  interact
    - *via `cartesi cli`*, access your terminal in another window and input these instructions below:
  
    ```sh
    cartesi send generic \
    --dapp=0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e \
    --chain-id=31337 \
    --rpc-url=http://127.0.0.1:8545 \
    --mnemonic-passphrase="test test test test test test test test test test test junk" \
    --mnemonic-index=0 \
    --input='{ "action": "delete", "data": { "id":1 } }'
    ```


### Inspect Handlers

* #### getAllTodos
  ```js
    description — get all todos.
  ```

    interact
    - access the Cartesi inspect endpoint on your browser
  ```sh 
  http://localhost:8080/inspect/all
  ```

  returned hex sample
  ```json
    {
        "status": "Accepted",
        "exception_payload": null,
        "reports": [
            {
            "payload": "0x7b2..."
            }
        ],
        "processed_input_count": 3
    }
  ```
  converted payload sample
  ```json 
    {
        "ok":true,
        "message":"Todos List",
        "data":
        [
            {
                "id":1,"owner":"0xf3...",
                "content":"Bjjjathing",
                "completed":true
            }
        ]
    }
  ```
  

* #### getTodoById
  ```js
    description — get a todo by given id.
    param data — todo id (number)
  ```

 
  interact
    - access the Cartesi inspect endpoint on your browser
  ```sh 
  http://localhost:8080/inspect/id/${id}
  ```
  
  returned hex sample
  ```json
    {
        "status": "Accepted",
        "exception_payload": null,
        "reports": [
            {
                "payload": "0x7b..."
            }
        ],
        "processed_input_count": 3
    }
  ```
  converted payload sample
  ```json 
    {
        "ok":true,
        "message":"Todo Found",
        "data":{
            "id":1,
            "owner":"0x...",
            "content":"Bjjjathing",
            "completed":true
        }
    }
 

## Contributing
We welcome contributions from the community! If you'd like to contribute to the Todo dApp, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them with descriptive commit messages.
- Push your changes to your forked repository.
- Submit a pull request to the main repository.
- Please ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License
The Todo dApp is released under the MIT License.

## Acknowledgments
The Todo dApp is built on top of the Cartesi platform and utilizes various open-source libraries and tools. We would like to express our gratitude to the developers and contributors of these projects.
