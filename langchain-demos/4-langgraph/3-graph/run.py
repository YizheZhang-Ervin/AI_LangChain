# 定义一个初始状态字典，包含键值对"x": 5
initial_state={"x": 5}
# 调用graph对象的invoke方法，传入初始状态，执行图计算流程
result= graph.invoke(initial_state)
print(f"最后的结果是:{result}")