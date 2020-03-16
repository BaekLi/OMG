# OMG

#### 项目名称：OMG

#### 项目开发语言：d3.js

#### 项目介绍：通过三个JSON文件，绘制散点图，并进行相关的数据分析

#### JSON格式【example】：

- info文件

  ```json
  {"Sample000001": {"category": "Type1", "detail": "TBA"}, "Sample000002": {"category": "Type1", "detail": "TBA"}, "Sample000003": {"category": "Type1", "detail": "TBA"}, "Sample000004": {"category": "Type1", "detail": "TBA"}, "Sample000005": {"category": "Type1", "detail": "TBA"}}
  ```

- g1文件

  ```json
  {"Sample000001": 2.5360273971241973, "Sample000002": 2.4561698890956305, "Sample000003": 1.8896865931855804, "Sample000004": 1.8591954063715899, "Sample000005": 1.9402423231503152}
  ```

- g2文件

  ```json
  {"Sample000001": 9.055254158570836, "Sample000002": 7.203912689242869, "Sample000003": 6.943096252000117, "Sample000004": 6.349482336960998, "Sample000005": 6.781733381310735}
  ```

> 请严格按照以上格式上传JSON文件

#### 项目详情：

1. 首页

   ![8Gog9e.png](https://s1.ax1x.com/2020/03/16/8Gog9e.png)

   `请按照INFO、G1、G2顺序进行上传文件`

2. 上传文件后

   ![8GTh24.png](https://s1.ax1x.com/2020/03/16/8GTh24.png)

3. 绘制散点图

   ![8GTba6.png](https://s1.ax1x.com/2020/03/16/8GTba6.png)

4. 点击legend隐藏相应散点

   ![8G7SsA.png](https://s1.ax1x.com/2020/03/16/8G7SsA.png)

5. 数据分析

   ![8G7KZq.png](https://s1.ax1x.com/2020/03/16/8G7KZq.png)

   `目前对种类Category、数量Count、相关系数Correlation cofficient进行了数据分析，P-Value还待完善`
