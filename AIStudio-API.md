# Unofficial Google AI Studio API Documentation

**Disclaimer:** This documentation describes an unofficial, undocumented API used by the Google AI Studio web interface. It is not supported by Google and may change or break at any time without notice. Use of this API may be against Google's Terms of Service. Proceed at your own risk.

## Authentication

The API uses a combination of an API key, an authorization hash, and session cookies for authentication. These credentials are temporary and must be obtained from an active AI Studio session.

### How to Obtain Credentials

1.  Open your web browser and navigate to [https://aistudio.google.com/](https://aistudio.google.com/).
2.  Open the Developer Tools in your browser (usually by pressing `F12` or right-clicking and selecting "Inspect").
3.  Go to the "Network" tab in the Developer Tools.
4.  In AI Studio, perform an action, such as sending a message to the AI.
5.  Look for a request to `alkalimakersuite-pa.clients6.google.com` in the network log. The most common one will be `GenerateContent`.
6.  Click on the request to view its details. Go to the "Headers" section.
7.  Find and copy the following values from the "Request Headers" section:
    *   `Authorization`: This is your primary authorization token (e.g., `SAPISIDHASH ...`).
    *   `X-Goog-Api-Key`: This is your API key.
    *   `Cookie`: This contains your session cookies.

You will need to set these values as variables in your environment or replace them in the example scripts.

```bash
# Recommended: Set credentials as variables
export AUTH_TOKEN="SAPISIDHASH ..."
export API_KEY="AIzaSy..."
export COOKIE="AEC=...; NID=...; ..."
```

---

## API Endpoints

The base URL for all API calls is: `https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/`

### List Models

Retrieves a list of all available models and their capabilities.

*   **Endpoint:** `ListModels`
*   **Method:** `POST`
*   **Request Body:** An empty JSON array `[]`.

**Example `curl` Request:**

```bash
curl 'https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/ListModels' \
  -X POST \
  -H "Authorization: $AUTH_TOKEN" \
  -H "X-Goog-Api-Key: $API_KEY" \
  -H "Cookie: $COOKIE" \
  -H 'Content-Type: application/json+protobuf' \
  --data-raw '[]'
```

**Response:**
The response is a large, complex JSON array containing objects for each model. Each object details the model's name, version, token limits, supported methods, pricing, and more. You will need to parse this to find the model you wish to use.

### Count Tokens

Counts the number of tokens in a given string of text for a specific model.

*   **Endpoint:** `CountTokens`
*   **Method:** `POST`

**Request Body Structure:**

```json
[
  "models/<model_name>",
  [
    [
      [
        null,
        "<your_text_here>"
      ]
    ],
    "user"
  ]
]
```

**Example `curl` Request:**

```bash
curl 'https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/CountTokens' \
  -X POST \
  -H "Authorization: $AUTH_TOKEN" \
  -H "X-Goog-Api-Key: $API_KEY" \
  -H "Cookie: $COOKIE" \
  -H 'Content-Type: application/json+protobuf' \
  --data-raw '["models/gemini-2.5-pro",[[[[null,"was steve jobs actually a phsycopath?? or is that just a myth"]],"user"]]]'
```

**Response:**
The response is a base64 encoded string. When decoded, it reveals a nested array. The token count is typically the first integer value in the response. For `[17,[],[[[16],1]],null,null,[[1,17]]]`, the token count is `17`.

### Generate Access Token

Generates a temporary access token. It appears this may need to be run periodically to maintain an active session.

*   **Endpoint:** `GenerateAccessToken`
*   **Method:** `POST`
*   **Request Body:** `["users/me"]`

**Example `curl` Request:**

```bash
curl 'https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/GenerateAccessToken' \
  -X POST \
  -H "Authorization: $AUTH_TOKEN" \
  -H "X-Goog-Api-Key: $API_KEY" \
  -H "Cookie: $COOKIE" \
  -H 'Content-Type: application/json+protobuf' \
  --data-raw '["users/me"]'
```

**Response:**
The response is a JSON array containing a single base64 encoded string, which is the access token.

---

## GenerateContent API

This is the main endpoint for generating AI responses. It is highly versatile and supports numerous features. All `GenerateContent` calls are streaming.

*   **Endpoint:** `GenerateContent`
*   **Method:** `POST`

### Response Streaming

All responses from the `GenerateContent` endpoint are streamed. This means the server sends the response in multiple small chunks. You will receive a stream of data that needs to be parsed. Each chunk is a JSON-like array. The final, complete response is an aggregation of the text found within these chunks.

A typical chunk containing text looks like this:
`[[[[[[null,"This is a part of the response."]]],"model"]]]]`

You must concatenate the text from all such chunks to form the full message.

### Basic Text Generation

This is the simplest request, providing a single prompt to a model.

**Request Body Structure:**

```json
[
  "models/<model_name>",
  [
    [
      [
        null,
        "<your_prompt_here>"
      ]
    ],
    "user"
  ]
]
```

**Example `curl` Request:**

```bash
curl 'https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/GenerateContent' \
  -X POST \
  -H "Authorization: $AUTH_TOKEN" \
  -H "X-Goog-Api-Key: $API_KEY" \
  -H "Cookie: $COOKIE" \
  -H 'Content-Type: application/json+protobuf' \
  --data-raw '["models/gemini-2.5-pro",[[[[null,"was steve jobs actually a phsycopath?? or is that just a myth"]],"user"]]]'
```

### Advanced Features

The request body can be expanded to include chat history, system prompts, and tools.

#### Chat History

To provide conversational context, include past user prompts and model responses in the payload.

**Request Body Structure:**

```json
[
  "models/<model_name>",
  [
    [
      [
        null,
        "<first_user_prompt>"
      ]
    ],
    "user"
  ],
  [
    [
      [
        null,
        "<first_model_response>"
      ]
    ],
    "model"
  ],
  [
    [
      [
        null,
        "<second_user_prompt>"
      ]
    ],
    "user"
  ]
]
```

#### System Prompt

You can provide a system prompt to guide the model's persona, tone, and behavior. This is done by adding a "user" and "model" turn at the beginning of the history, where the user provides the instructions and the model gives a simple acknowledgment.

**Example `curl` with System Prompt:**
The `--data-raw` payload would look like this:
```json
["models/gemini-2.5-pro",[[[[null,"hello this is a system prompt example"]],"user"],[[[null,""]],"model"],[[[null,"now i gave you a system prompt"]],"user"]]]
```

#### Tools (Grounding, URL Context, Code Execution)

The API can be instructed to use tools like Google Search, browse a URL, or execute code. This is controlled by a complex set of parameters in the request payload.

*   **Google Search (Grounding):** The model can search Google to answer questions about recent events or provide up-to-date information. This is enabled by a specific array structure in the payload, as seen in the example.
*   **URL Context:** You can provide a URL for the model to browse and use as context for its response.
*   **Code Execution:** The model can generate and execute Python code in a sandboxed environment to solve problems. The response stream will include the code and the output of its execution.
*   **Thinking Mode:** For complex requests, you can enable a "thinking budget" which will cause the model to output its reasoning process as part of the stream before delivering the final answer. This is useful for debugging and understanding the model's logic. To disable it, the parameters in the payload should be adjusted accordingly.

Analyzing the exact payload structure for each tool requires careful inspection of the network requests made by AI Studio when these features are used. The examples you provided demonstrate the complexity of these payloads.

(this was made by looking at inspect element and givin a bunch of requests to gemini-2.5-pro and their responses to have it genorate this, none of this has actually be tested but i dont see why it wouldnt work, if you would like you can submit a pull request [here](https://github.com/M1noa/how))
