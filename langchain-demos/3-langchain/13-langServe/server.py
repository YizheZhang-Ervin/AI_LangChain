from fastapi import FastAPI
from langserve import add_routes

# 即createChain.py文件
from chain import translation_chain

app = FastAPI(
    title="翻译助手",
    version="v1.0",
    description="基于LangChain框架构建的翻译服务"
)

# 直接传 Chain 对象，不要 invoke
add_routes(app, translation_chain, path="/trans")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# 访问：http://127.0.0.1:8000/docs
# web：http://127.0.0.1:8000/translation/playground/