# 关于 Github Action 的一份不完全指南

## 镇楼

![github-action](overview-actions-simple.webp)

~~其实是因为发新贴时不能预览~~

~~如果链接指向这里说明这一部分还没完成~~


## 目录

- 
- [介绍](#github-action-能干什么)
- [创建 Action](#github-action-怎么用)
- [基本用法](#yaml-文件怎么写)
  - [YAML 文件格式](#yaml-文件结构格式)
  - [触发器](#触发器)
  - [工作流](#工作流)
  - [最基本的示例](#一个基本的简单的例子)
- 进阶 - 文件和参数的传递
  - 设置和使用环境变量
  - 在步骤间传递参数
  - 在工作间传递参数
  - 在工作间传递文件
- 进阶 - 运行其它格式的脚本
  - [Javascript 脚本](#镇楼)
  - [Python 脚本](#镇楼)
- 进阶 - 外部 Action 的使用
  - [上传文件到 workflow](#一个基本的简单的例子): actions/upload-artifact@v4 [(hyperlink)](https://github.com/actions/upload-artifact)
  - [使用仓库的文件和代码](#镇楼): actions/checkout@v4[(hyperlink)](https://github.com/actions/checkout)
  - [创建和发布 release](#镇楼)
- 高级 - 实例分析
  - [rust 项目的构建测试 和 Release 的发布更新](#镇楼)
- 高级 - 写自己的库, 用的人多了, 就可以删库跑路了(笑)
  - [将示例集成为库, 一键调用](#镇楼)
---

## Github Action 能干什么
 
*ChatGPT 是这样说的.*

GitHub Actions 是一个功能强大的自动化工具，可以帮助开发人员自动化软件开发工作流程中的各种任务。它可以执行各种操作，包括但不限于：

1. **持续集成**: 在每次代码提交或 Pull Request 提交时自动运行测试，确保代码质量。
2. **持续部署 (CD)**: 将代码部署到测试环境或生产环境，以自动化发布过程。
3. **自动化代码质量检查**: 运行静态代码分析工具、代码风格检查工具和安全漏洞扫描工具，以确保代码质量和安全性。
4. **自动化文档生成**: 从代码中生成文档，并将其发布到指定位置，如 GitHub Pages。
5. **通知和警报**: 通过邮件、Slack 或其他渠道发送通知和警报，以便及时响应事件。
6. **版本控制和自动发布**: 根据版本标签或其他条件自动发布软件包、库或应用程序。

自定义任务和工作流程：根据项目需求，执行各种自定义任务和工作流程，以满足特定的开发和部署需求。
总的来说，GitHub Actions 可以帮助简化开发流程，提高开发团队的效率，减少手动操作，降低出错的可能性，并加速软件的交付速度。

*依我看*, Github Action 就是 Github 提供的一个**云服务器,** 可以访问你的库, 下载依赖或其它程序, 运行脚本或程序, 最后还可以利用 GitHub REST API 进行各种库的操作.

也就是说, 你可以白嫖 GitHub 的计算资源, 在云端进行一些计算.

由于 GitHub Action 的教程不多, 也没什么人会用, 很多人只会点出一个推荐配置, 然后 "能跑就行, 我也不知道我配了个啥" (反正我一开始就是这样的). 然后当我真正想用的时候, 却发现它的坑很多, 网上的教程也很少, 很多东西只能自己总结, 摸索.
前人(~~我自己~~)踩了那么多坑, 好不容易踏出一条羊肠小路, 总不能看着它就荒废了, 那就为后人做点贡献, 能指一下方向也是好的.

因此, 这篇帖子的后面的部分给出了一个 Github Action 的**从 0 到 1** 的教程, 至于能否二生三, 三生万物, 那就得看各位的造诣了.

## Github Action 怎么用

你将 YAML文件(.yml, .yaml) 扔到 `.github/workflows` 文件夹下, Github 会自动检测到并且添加到 Actions 部分, 左下方 `all workflows` 下方的对应的就是你的各个YAML文件的工作流, 右侧是这些工作流每次运行的结果. **只有主分支创建的yaml文件会被收入工作流, 其它分支可以修改此工作流但是不能创建新的**
![github-action](image.png)

如果你没有 workflow 文件, GitHub 会根据你的项目, 自动推荐一些可能的工作流(如下图所示), 或者你也可以手动设置([set up a workflow yourself](#github-action-怎么用))
![github-action-suggested](image-1.png)

## YAML 文件怎么写

yaml 文件的关键有两个部分触发器和工作流

触发器 [triggers](#触发器) 定义了何时 GitHub 将运行 Action。
工作流 [jobs](#工作流) 定义了运行后执行什么工作.

#### YAML 文件结构格式

参见 [菜鸟教程](https://www.runoob.com/w3cnote/yaml-intro.html)

YAML 的语法和其他高级语言类似，并且可以简单表达清单、散列表，标量等数据形态。它使用空白符号缩进和大量依赖外观的特色，特别适合用来表达或编辑数据结构、各种配置文件、文件大纲.

YAML 对大小写敏感, 使用缩进表示层级关系, 缩进的空格数不重要，只要相同层级的元素左对齐即可, `#` 后表示注释

YAML 支持以下几种**数据类型**：

- 对象：键值对的集合，又称为映射（mapping）/ 哈希（hashes） / 字典（dictionary）
- 数组：一组按次序排列的值，又称为序列（sequence） / 列表（list）
- 纯量（scalars）：单个的、不可再分的值

##### 对象

对象键值对使用冒号结构表示 `key: value`，冒号后面要加一个空格。
也可以使用 `key: {key1: value1, key2: value2, ...}`。
还可以使用缩进表示层级关系；
```YAML
key: 
  child-key: value
  child-key2: value2
```

##### 数组

数组使用方括号逗号结构表示 `[value1, value2, [sub val 1, sub val 2], ...]`.
还可以用 - 开头的行表示构成一个数组, 使用缩进表示层级关系；
```YAML
- value1
- value2
- 
  - sub val 1
  - sub val 2
```

##### 纯量

纯量是最基本的，不可再分的值，包括：
字符串, 布尔值, 整数, 浮点数, Null, 时间, 日期


#### 触发器

Trigger 可以有不同的方式, 具体包括:

1. **Push 触发器：** 当某人将代码推送到仓库时触发。可以根据分支和路径进行过滤。

```yaml
on:
  push:
    branches:
      - main
      - master
      - some-other-branches
    paths:
      - 'src/**'
      - 'paths/to/your/changed/files'
```

branches 过滤器告诉GitHub当你的哪一个分支提交时触发此工作流, branches 后紧跟着的就是分支的名称列表.

paths 路径过滤功能允许你指定只有在特定路径下的文件发生变化时才触发 GitHub Action。这对于大型仓库中只对特定目录或文件感兴趣的工作流程非常有用。
路径过滤是通过使用 paths 关键字实现的。你可以指定一个文件或一组文件的路径，也可以使用通配符模式匹配多个文件或目录。

这两个过滤器的条件的合取作为push触发器的条件.

*疑问: 我希望在main分支的任何文件发生变化, 或是branchA分支的src/文件夹下文件发生改变时才触发, 该怎么设置触发器?*

2. **Pull Request 触发器：** 当有 Pull Request 被打开、更新或合并时触发。

```yaml
on:
  pull_request:
    types: [opened, synchronize, closed]
```

pull_request 触发器用于在 Pull Request 相关事件发生时触发 GitHub Actions。这些事件包括：

- Pull Request 被打开（opened）
- Pull Request 被更新（synchronize）
- Pull Request 被关闭（closed）

3. **定时触发器：** 按照设定的时间表触发 Action。可以是 cron 表达式。

```yaml
on:
  schedule:
    - cron: '0 0 * * *' # 每天 0 点触发
    - hourly            # 每小时触发一次
```

schedule 表示这是一个定时触发器, 后面跟着时间表项列表. 每个时间表项定义了触发 Action 的时间规则。它可以是 cron 表达式，也可以是简单的字符串。

**Cron 表达式**： Cron 表达式是一种灵活的时间表达方式，允许你按照分钟、小时、天、月、星期等单位来指定触发时间。例如，0 0 * * * 表示每天的零点触发，0 0 * * MON 表示每周一的零点触发。
**简单的字符串**： 除了 cron 表达式外，GitHub Actions 还支持一些预定义的字符串，比如 `every 5 minutes`, `every 30 minutes`, `every hour`, `hourly`, `daily`, `weekly` 等。


4. **仓库调度触发器：** 当 GitHub 启动了仓库的工作流程时触发。

```yaml
on:
  repository_dispatch:
    types: [my_event_type, other-event-types]
```

types 筛选了触发的类型列表, 如果略去则任意名称

要触发这个工作流程，你需要通过 GitHub API 发送一个 POST 请求。请求的内容应包含与 types 字段匹配的事件类型。例如，在命令行中可以使用 curl 发送类型为 my_event_type 的请求：

```Shell
curl \
  -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.everest-preview+json" \
  https://api.github.com/repos/$owner/$repo/dispatches \
  -d "{\"event_type\": \"$my_event_type\"}"
```

5. **外部触发器**: 手动触发 Action.

```yaml
on:
  workflow_dispatch:
    inputs:
      name-of-var:
        description: 'Description of this var'
        required: true
        default: 'default string'
      name-of-var-2:
        description: 'Description of this var2'
        required: false
```

workflow_dispatch 说明这是一个外部触发器, inputs 部分包含了需要输入的参数,description 给出了在网页上显示的变量名称(描述), required 规定了此参数是否是必须的, 而 default 给出了填充此参数的默认字符.

这些设置的字符串都被保存在 `github.event.inputs` 对象中. 通过 `${{ github.event.inputs.name-of-var }}` 在 jobs 中引用.

当设置了 workflow_dispatch , 我们可以在action对应页面的右上方找到 run workflow 的选项, 手动触发此工作流.
![run-manually](image-2.png)

#### 工作流
工作流对应着 jobs 字段, 也是必选的.

jobs 里可以有多个工作, 所有工作可以**并行**进行, 通过指定工作的**依赖关系**, 可以控制这些工作先后顺序, 进而形成工作流.

jobs 下的每一项都对应一个独立的工作, 每一项的 key 值就是这个 job 的 job_id , 而 value 对应着每个工作的具体设置.

每个工作需要设置运行环境, 至少包括 `runs-on` 和 `steps`
runs-on 对应着运行时使用的操作系统, 可以为 `ubuntu-latest`, `macos-latest`, `windows-latest` 等.
steps 为一个数组, 每一项对应一个步骤, 按顺序依次执行. 如果在中间出现错误, 则终止后面的全部工作.
步骤的名称使用 name 字段控制, 而步骤的具体内容可以为控制台脚本, 也可以使用外部Action.
控制台命令通过 run 字段输入, 而外部 Action 通过 uses 字段决定使用的库, 通过 with 字段输入参数.

#### 一个基本的简单的例子

*.github/workflows/example.yaml*
```YAML
name: Example Workflow # 工作流名称

on: # 定义触发条件
  push: # 当push到main分支时触发
    branches:
      - main
  workflow_dispatch: # 或 手动触发
    inputs: # 定义输入参数列表
      name-of-var: # 第一个待输入参数
        description: 'Description of this var'
        required: true
        default: 'default string'
      name-of-var-2: # 第二个待输入参数
        description: 'Description of this var2'
        required: false # 可选参数, 可以不输入

jobs: # 定义工作流
  echo-hello: # 工作流名称
    runs-on: ubuntu-latest # 运行环境
    steps: # 步骤
      - name: Echo hello # 步骤 1 的步骤名称
        # 使用 run 关键字执行 shell 命令
        run: echo "Hello, ${{ github.event.inputs.name-of-var }}"
      - name: Echo hello 2 # 步骤 2 的步骤名称
        # run 关键字后加 | 表示多行命令
        run: |
          HELLO2="Hello, ${{ github.event.inputs.name-of-var-2 }}"
          echo $HELLO2
          echo $HELLO2 > hello2.txt
      - name: upload-artifact # 步骤 3 的步骤名称
        # 使用 uses 关键字引用 actions/upload-artifact@v2 动作
        # 这个动作会将 hello2.txt 上传到 GitHub Actions 的 Artifacts
        uses: actions/upload-artifact@v2
        with: # 输入参数列表
          name: hello2
          path: hello2.txt

```

你可以在 Action 下看到多出了一个名为 Example Workflow 的工作流, 点进去你发现有一个运行成功的(或者正在运行中) 的工作, 点进去.

![runned-workflow](image-3.png)

然后就来到了这个summary界面, 它有一个流程图, 由于我们只有一个工作, 因此流程图只有一个块, 名称就是我们设置的 echo-hello. 页面最下方还有一个 Artifacts 模块, 里面有我们在最后一步上传的 hello2.txt 文件, 它被打包压缩为了 hello2.zip, 点击可以下载.

![summary](image-4.png)

文件如下(由于我是手动触发的, 因此填充的文本不是空的, 如果是pull触发的, name-of-var-2 字段则为空, 打印出来只有 `Hello, `)

![artifact](image-5.png)

我们可以点击流程图中的 echo-hello, 或者左侧 Jobs 下的echo-hello, 来看一看这个流程具体干了哪些事情.

- Set up job 根据我们的设置, 配置系统环境, 环境变量(比如 GitHub Token) 等,
- 然后就是我们的第一个步骤, 它打印出来了第一个变量. 注意到我们执行的命令已在执行前经将 action 的变量替换为了字符串, 变成 echo "Hello, default string"
- 第二个步骤是脚本块, 它三行按顺序逐次执行, 然后创建了一个 hello2.txt (在项目的根目录下). 虚拟机里的文件是从项目中下载下来的, 不会影响项目本身的文件, 因此你在项目中也找不到hello.txt. 
- 第三步我们使用外部库 `actions/upload-artifact@v2` 将这个文件 hello2.txt 上传到**此workflow的附件区**, 可供下载.
- 最后就是结束和清理了.

![echo-hello](image-6.png)

## 环境参数


## 运行 JavaScript 脚本