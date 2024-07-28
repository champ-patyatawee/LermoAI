FROM nvidia/cuda:11.8.0-base-ubuntu22.04

ARG OPENAI_API_BASE
ARG OPENAI_API_KEY

ENV PYTHON_VERSION=3.10
ENV OPENAI_API_BASE=$OPENAI_API_BASE
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN apt-get -qq update \
    && apt-get -qq install --no-install-recommends \
    build-essential \
    ffmpeg \
    unzip \
    curl \
    git \
    python${PYTHON_VERSION} \
    python${PYTHON_VERSION}-venv \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s -f /usr/bin/python${PYTHON_VERSION} /usr/bin/python3 && \
    ln -s -f /usr/bin/python${PYTHON_VERSION} /usr/bin/python && \
    ln -s -f /usr/bin/pip3 /usr/bin/pip

WORKDIR /app
COPY . .

RUN mkdir /.local && chmod 777 /.local
RUN mkdir /.cache && chmod 777 /.cache
RUN pip install -r requirements.txt
RUN pip install git+https://github.com/myshell-ai/MeloTTS.git
RUN python -m unidic download

EXPOSE 8000

ENTRYPOINT python main.py