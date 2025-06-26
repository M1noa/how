# Unofficial Google AI Studio API Documentation

**Disclaimer:** This documentation describes an unofficial, undocumented API used by the Google AI Studio web interface. It is not supported by Google and may change or break at any time without notice. Use of this API may be against Google's Terms of Service. Proceed at your own risk.

## Authentication & Session Management

The API uses a combination of a primary authorization hash, an API key, and session cookies. These are temporary and must be obtained from an active AI Studio session. To maintain a session, you may also need to periodically generate a new access token.

### 1. How to Obtain Initial Credentials

1.  Open your web browser and navigate to [https://aistudio.google.com/](https://aistudio.google.com/).
2.  Open the Developer Tools (usually `F12` or right-click -> "Inspect").
3.  Go to the **Network** tab.
4.  In AI Studio, perform an action, such as sending a message.
5.  Look for a request to `alkalimakersuite-pa.clients6.google.com` in the network log. The most common one will be `GenerateContent`.
6.  Click the request and go to the **Headers** tab.
7.  Find and copy the following values from the **Request Headers** section:
    *   `Authorization`: This is your primary authorization token (e.g., `SAPISIDHASH ...`).
    *   `X-Goog-Api-Key`: This is your API key.
    *   `Cookie`: This contains your session cookies.

It is highly recommended to store these as environment variables.

```bash
# Recommended: Set credentials as variables
export AUTH_TOKEN="SAPISIDHASH ..."
export API_KEY="AIzaSy..."
export COOKIE="AEC=...; NID=...; ..."
```

### 2. Maintaining the Session

The initial credentials may expire. The `GenerateAccessToken` endpoint appears to be used to refresh the session or obtain a new short-lived token. While its exact usage in subsequent calls is not fully clear from observation, it's likely a necessary step for long-running scripts.

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
The response is a JSON array containing a single base64 encoded string.

*   **Raw Response:** `["ya29.a0A..."]`
*   **Decoded:** The string inside is your new access token. It is unclear if this token should replace the `Authorization` header or be used elsewhere. For now, all other observed requests continue to use the original `SAPISIDHASH` token.

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
The response is a single, large base64 encoded string. When decoded, it reveals a JSON array where each element is an array containing detailed information about a model (name, version, token limits, supported methods, pricing, etc.).

**Example Decoded Response Snippet:**
```json
[
  [
    [
      "models/gemini-2.5-pro",
      null,
      "2.5",
      "Gemini 2.5 Pro",
      "Stable release (June 17th, 2025) of Gemini 2.5 Pro",
      1048576,
      65536,
      [
        "generateContent",
        "countTokens",
        "createCachedContent",
        "batchGenerateContent"
      ],
      // ... many more properties
    ]
  ],
  // ... other models
]
```

### Count Tokens

Counts the number of tokens in a given text prompt for a specific model.

*   **Endpoint:** `CountTokens`
*   **Method:** `POST`
*   **Request Body:** `["models/<model_name>", [[[[null, "<your_text_here>"]], "user"]]]`

**Example `curl` Request:**

```bash
curl 'https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/CountTokens' \
  -X POST \
  -H "Authorization: $AUTH_TOKEN" \
  -H "X-Goog-Api-Key: $API_KEY" \
  -H "Cookie: $COOKIE" \
  -H 'Content-Type: application/json+protobuf' \
  --data-raw '["models/gemini-2.5-pro",[[[[null,"was steve jobs actually a psychopath?? or is that just a myth"]],"user"]]]'
```

**Response:**
The response is a base64 encoded string. When decoded, it reveals a nested array. The token count is the first integer value. For a decoded response of `[17,[],[[[16],1]],null,null,[[1,17]]]`, the token count is `17`.

---

## GenerateContent API

This is the primary endpoint for all generative tasks, including text, chat, and multimodal interactions.

*   **Endpoint:** `GenerateContent`
*   **Method:** `POST`

### Response Streaming

All responses from `GenerateContent` are streamed in chunks.
*   **Thinking Process:** The initial chunks often contain the model's internal reasoning, prefixed with markdown like `**Analyzing User Input**`. This is part of the "thinking budget" and is useful for debugging.
*   **Content:** Subsequent chunks contain parts of the final answer.
*   **Aggregation:** You must parse the stream and concatenate the text from the content chunks to form the complete response. A typical content chunk looks like: `[[[[[[null,"This is a part of the response."]]],"model"]]]]`

### Master Payload Structure

The `GenerateContent` request body is a complex JSON array with 5 main parts.

```json
[
  "<model_name>",
  [ /* History & Prompt Array */ ],
  [ /* Tool Configuration Array */ ],
  [ /* Generation & Safety Config Array */ ],
  "<session_data_string>"
]
```

#### 1. History & Prompt Array

This array contains the full conversation history.

**Single Prompt:**
```json
[
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

**Multi-turn Chat:**
```json
[
  [
    [
      [null, "<first_user_prompt>"]
    ], "user"
  ],
  [
    [
      [null, "<first_model_response>"]
    ], "model"
  ],
  [
    [
      [null, "<second_user_prompt>"]
    ], "user"
  ]
]
```

**System Prompt:** A system prompt is set by making it the first turn in the history, with an empty model response.
```json
[
  [
    [
      [null, "You are a helpful pirate assistant named Bob."]
    ], "user"
  ],
  [
    [
      [null, ""]
    ], "model"
  ],
  [
    [
      [null, "Ahoy! What be the weather today?"]
    ], "user"
  ]
]
```

**Image Input (Multimodal):** To include an image, you must first get an upload ID (process not documented here) and include it in the user turn alongside the text prompt.

```json
[
  [
    [
      // The first element is the image data
      [null, null, null, null, null, ["<image_upload_id>"]],
      // The second element is the text prompt
      [null, "describe what you see in this image"]
    ],
    "user"
  ]
]
```

#### 2. Tool Configuration Array

This array specifies which tools the model can use (e.g., Google Search, Code Interpreter). The numbers correspond to specific tools enabled in the AI Studio UI.

**Example (enabling tools 7, 8, 9, 10):**
```json
[
  [null, null, 7, 5],
  [null, null, 8, 5],
  [null, null, 9, 5],
  [null, null, 10, 5]
]
```

#### 3. Generation & Safety Config Array

This array controls the generation parameters. Based on observation, the structure is:
`[null, null, null, <max_output_tokens>, <temperature>, <top_p>, <top_k>, "text/plain", ...other_nulls..., [<candidate_count>, -1]]`

*   **`max_output_tokens`**: (e.g., `65536`) Maximum tokens in the response.
*   **`temperature`**: (e.g., `0.3`) Controls randomness. Lower is more deterministic.
*   **`top_p`**: (e.g., `0.95`) Nucleus sampling probability.
*   **`top_k`**: (e.g., `64`) Samples from the K most likely tokens.
*   **`candidate_count`**: (e.g., `1`) How many response choices to generate.

**Example:**
```json
[null, null, null, 65536, 0.3, 0.95, 64, "text/plain", null, null, null, null, null, null, null, null, [1, -1]]
```

#### 4. Session Data String

This is a long, opaque, base64-like string that appears to be a unique identifier for the request or session. It must be included.

**Example:** `"!wcKlwprNAAZYy...G1jW20"`

### Full `GenerateContent` Example

This `curl` combines all the elements for a multimodal request.

```bash
# Note: The data payload is extremely long and sensitive to formatting.
# It is simplified here for readability.
DATA_PAYLOAD='["models/gemini-2.5-pro",[...history_and_image_array...],[...tool_config...],[...generation_config...],"<session_data_string>"]'

curl 'https://alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/GenerateContent' \
  -X POST \
  -H "Authorization: $AUTH_TOKEN" \
  -H "X-Goog-Api-Key: $API_KEY" \
  -H "Cookie: $COOKIE" \
  -H 'Content-Type: application/json+protobuf' \
  --data-raw "$DATA_PAYLOAD"
```

---
*This documentation was generated by analyzing network requests from the AI Studio web interface. It has not been exhaustively tested and is provided as-is. Contributions and corrections are welcome via pull request [here](https://github.com/M1noa/how).*
