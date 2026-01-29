# langhcain

## Python
```sh
# 国内源
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

# 虚拟环境venv(py3直接用)
python -m venv ./xxenv
cd xxenv/Scripts
activate
deactivate

# dependencies
pip install -U "langgraph-cli[inmem]"
```

## Project
```sh
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

## 迁移环境
```sh
# 联网机器下载依赖
pip freeze > requirements.txt
pip download -r requirements.txt -d ./python_packages

# 离线机器安装
python -m venv ./xxenv
cd xxenv/Scripts
activate
pip install --no-index --find-links=./python_packages -r requirements.txt
```

## 技术栈
```sh
- 前端：gradio界面
- AI: 文字语音互转
- 模型：ollama小模型
- 流程编排：多agent/langgraph/Memory/HIL
- 数据获取：RAG(llamaIndex+知识库+neo4j知识图谱) / Mcp(tools+DB) / web自动化抓取
- 后端：fastapi
```