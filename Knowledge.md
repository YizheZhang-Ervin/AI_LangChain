# Knowledge

## 1. LangChain
### 1.1 Model
```py
# model
model = ChatOpenAI(api_key,model)
model = ChatOllama(base_url,model)

# call
model.invoke(msg)
model.ainoke(msg)
model.batch(msg)
model.stream(msg)
```

### 1.2 Message
```py
msg = [SystemMessage(),HumanMessage()]
```

### 1.3 Prompt
```py
tmpl = PromptTemplate()
tmpl = PromptTemplate.from_template()
tmpl.partial()
tmpl.format()
tmpl.invoke()
cTmpl = ChatPromptTemplate()
# dict/xxMsg/str
cTmpl = ChatPromptTemplate.from_messages([sm,hm,sTmpl.hTmpl])
cTmpl.format()
cTmpl.invoke()
# msg是对话消息列表，prompt是字符串/消息列表
cTmpl.format_messages()
cTmpl.format_prompt()
sTmpl = SystemMessagePromptTemplate.from_template()
hTmpl = HumanMessagePromptTemplate.from_template()
sm = SystemMessage()
hm = HumanMessage()

# 3.1 few shot
examples=[{}]
example_prompt = PromptTemplate.from_template()
embedding = OllamaEmbeddings()
example_selector = SemanticSimilarityExampleSelector.from_examples(examples,embedding,FAISS)
similar_prompt = FewShotPromptTemplate(example_selector,example_prompt)
similar_prompt.format()
final_prompt = FewShotPromptTemplate(example,example_prompt) + ChatPromptTemplate.from_messages()
final_prompt.format()

# 3.2 message placeholder
prompt = ChatPromptTemplate.from_messages([MessagesPlaceholder("memory")])
prompt = ChatPromptTemplate.from_messages([
    ("placeholder", "{memory}")])
prompt.invoke({"memory": []})

# 3.3 hub
prompt = hub.pull("hwchase17/openai-tools-agent")
```

### 1.4 Parser
```py
CommaSeparatedListOutputParser()
对象PydanticOutputParser()
自定义继承PydanticOutputParser()
JsonOutputParser()
StrOutputParser()
XMLOutputParser()
```

### 1.5 ICEL
```py
RunnableBranch()
数据穿透RunnablePassthrough.assign()
RunnableLambda()
RunnableParallel()
传递参数itemgetter()
打印链parallel_chain.get_graph().print_ascii()
```

### 1.6 Memory
```py
history = InMemoryChatMessageHistory()
history = RedisChatMessageHistory(session_id,url)
prompt = ChatPromptTemplate.from_messages([MessagesPlaceholder(variable_name="history")]）
chain = RunnableWithMessageHistory(prompt|llm,history)
config = RunnableConfig(configurable={"session_id": "xx"})
chain.invoke({}, config)
```

### 1.7 Tool
```py
方法上装饰器@tool(args_schema=xxx)
llm.bind_tools([xx方法])

# custom tool
func = StructuredTool.from_function()
func.invoke()

# builtin tool
tool = PythonREPL()
tool.run()
```

### 1.8 Agent
```py
# browser tool
sync_browser = create_sync_playwright_browser()
toolkit = PlayWrightBrowserToolkit.from_browser(sync_browser=sync_browser)
tools = toolkit.get_tools()
prompt = hub.pull("hwchase17/openai-tools-agent")

# network search tool
api_wrapper = GoogleSerperAPIWrapper()
search_tool = GoogleSerperRun()
tools = [search_tool]

# tool agent
llm = ChatOllama()
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent, tools)
agent_executor.invoke(command)
```

### 1.9 Mcp
```py
# server
mcp=FastMCP()
@mcp.tool()
mcp.run(transport="sse")

# client
mcp_client = MultiServerMCPClient(servers_cfg)
tools = await mcp_client.get_tools()
prompt = hub.pull("hwchase17/openai-tools-agent")
agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent, tools)
agent_executor.invoke(command)
```

### 1.10 Rag
```py
# 流程
- 文档收集(browser)
- 文档处理(解析)
- 文档数据向量化(redisClient + dashscope.MultiModalEmbedding or RedisVectorStore + OllamaEmbeddings)
- 文档数据相似性搜索(手写RediSearch的KNN查询语句 or RedisVectorStore)
- 构建提示词
- 大语言模型生成结果(openAI调模型 or langchain调模型)

# 文档加载器
# 继承重写load里doc=Document()
loader = BaseLoader()
loader = TextLoader()
loader = UnstructuredMarkdownLoader()
loader = UnstructuredLoader()
documents = loader.load()

# 文本分割器
MarkdownHeaderTextSplitter()
## 自定义分割器，继承TextSplitter重写split_text
TextSplitter()
## 递归文本分割器
text_splitter = RecursiveCharacterTextSplitter()
## 分割为文档片段
splitter_documents = text_splitter.split_documents(documents)
## 分割为文本块
splitter_texts = text_splitter.split_text(content)
## 转换为文档对象
splitter_documents = text_splitter.create_documents(splitter_texts)

# 流程
## 浏览器自动化收集信息
sync_playwright()
## 处理网页
BeautifulSoup()
## 提示词(查询提取文档片段)
embedding = OllamaEmbeddings()
config = RedisConfig()
vector_store = RedisVectorStore(embedding,config)
retriever = vector_store.as_retriever(search_kwargs={"k": 2})
documents = retriever.invoke(question)

# ex. pdf阅读器 、分词器
## 读pdf
PdfReader()
## 分词器
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
## 转码
tokenizer.encode(text)
tokenizer.decode(chunk_tokens)
```

### 1.11 VectorStore
```py
# 自定义检索器(重写_get_relevant_documents方法)
documents = [Document()]
retriever = BaseRetriever(documents)
result = retriever.invoke()

# 向量存储库
embedding = OllamaEmbeddings()
llm = ChatOllama()
config = RedisConfig()
vector_store = RedisVectorStore(embedding, config)

# 多查询检索器
retriever = vector_store.as_retriever()
retriever_from_llm = MultiQueryRetriever.from_llm(retriever, llm, prompt)
documents = retriever_from_llm.invoke("")

# 向量相似度得分
results = vector_store.similarity_search_with_score(query, k=3)

# 存储向量
metadata = [{"segment_id": "1"}]
ids = vector_store.add_texts(texts, metadata)

# 使用embedding模型将文本转换为向量表示
embeddings = embedding.embed_documents(texts)

# ex. 调用多模态embedding模型接口进行向量编码
resp = dashscope.MultiModalEmbedding.call(
    model="multimodal-embedding-v1",
    input=input
)

# ex. 余弦相似度
dot_product = np.dot(vec1, vec2)
norm_vec1 = np.linalg.norm(vec1)
norm_vec2 = np.linalg.norm(vec2)
return dot_product / (norm_vec1 * norm_vec2)

# redisStack
redis_client = redis.Redis()
## 信息
redis_client.ft(INDEX_NAME).info()
## 插入index
redis_client.ft(INDEX_NAME).create_index()
## 写入hset
redis_client.hset(key, mapping={})
## 搜索
q = Query(knn_query).sort_by("__embedding_score").paging(0, topk)
search_result = redis_client.ft(INDEX_NAME).search(
    q, query_params={"vec_param": query_vector}
)

# weaviate
client = weaviate.connect_to_local()
client.is_ready()
## 创collection
client.collections.create("Database")
## 创object
database = client.collections.get("Database")
uuid = database.data.insert()
## 插入object
uuid = database.data.insert()
## 批量插入object
collection = client.collections.get("Database")
with collection.batch.fixed_size(batch_size) as batch
batch.add_object()
collection.batch.failed_objects
## 查询
database = client.collections.get("Database")
data_object = database.query.fetch_object_by_id(
    "xxx",
    include_vector=True
)
## 查所有
collection = client.collections.get("Database")
for item in collection.iterator(include_vector=True)
## 更新
database = client.collections.get("Database")
database.data.update()
## 替换
database = client.collections.get("Database")
database.data.replace()
## 删除
database = client.collections.get("Database")
database.data.delete_by_id()
database.data.delete_many(where)
client.collections.delete("Database")
```

### 1.12 LangSmith
```py
# callback,重写BaseCallbackHandler(模型开始结束/组件开始结束)
config = RunnableConfig(callbacks=[BaseCallbackHandler()])
chain = prompt | model
chain.invoke({"": ""}, config)
```

### 1.13 LangServe
```py
# server
prompt = ChatPromptTemplate.from_messages([])
llm = ChatOllama()
parser = StrOutputParser()
translation_chain = prompt | llm | parser
app = FastAPI()
add_routes(app, translation_chain, path="/xx")
uvicorn.run()

# client
client = RemoteRunnable()
client.invoke({})
```

## 2. LangGraph
### 2.1 agent tool
```py

```

### 2.2 ecology 
```py

```

### 2.3 graph
```py

```

### 2.4 HIL
```py

```

### 2.5 memory
```py

```

### 2.6 mcp
```py

```

### 2.7 multiagent
```py

```

## 3. DeepAgents(暂无)

## 4. LangChain4j(暂无)

## 5. 其他(暂无)
- MCP
- RAG
- Gradio
- Ollama