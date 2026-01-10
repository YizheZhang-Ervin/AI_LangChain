# langhcain

## Usage
```sh
# 国内源
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

# 虚拟环境venv(py3直接用)
python -m venv ./xxenv
cd xxenv/Scripts
activate
deactivate

# install
pip install -U "langgraph-cli[inmem]"

# create
langgraph new path/to/your/app --template new-langgraph-project-python
cd path/to/your/app
pip install -e .

# .env file 
# LANGSMITH_API_KEY=lsv2...

# start
langgraph dev
# safari browser: langgraph dev --tunnel

# debug (launch.json)
pip install debugpy
langgraph dev --debug-port 5678

# LangGraph Studio Web UI
# https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
```

## TODO
```sh
1. langchain
- 博客：整理 + 单独rag和mcp (OK)
- 官方：new

2. langgraph
- 博客：整理
- 官方：整理

3. DeepAgents
- 官方：new (OK)

4. 完整例子
- gradio + ollama + langgraph + 多agent + mcp + rag + memory + HIL

```