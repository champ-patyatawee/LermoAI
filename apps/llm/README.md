# LermoAI Support for LLaMA.cpp HTTP Server

LermoAI supports the LLaMA.cpp HTTP Server, allowing you to deploy your own models seamlessly. This server makes it easy to host and manage machine learning models using the LLaMA.cpp framework.

For more detailed information, refer to the [official documentation](https://github.com/ggerganov/llama.cpp/blob/master/examples/server/README.md).

# Example Dockerfile

Here is an example Dockerfile for setting up the LLaMA.cpp HTTP Server. This example uses the CPU, but you can modify the Dockerfile to use a GPU if needed.

### Dockerfile Examples

- `Dockerfile.llama`
- `Dockerfile.mistral`

## Running the Dockerfile

You can run the Dockerfile on your local machine. However, for a more scalable and accessible solution, we recommend using HuggingFace Space to host your server with Docker.
[HuggingFace Space documentation](https://huggingface.co/docs/hub/en/spaces-sdks-docker).
