# langhcain

## Usage
```sh
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