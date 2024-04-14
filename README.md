# Github 自动构建, 测试, 推测版本, 发布 多合一工具

> 当然是自用的!

工作流位于 .github/workflows/run.yaml 文件, 还需要 .github/workflows/get-changelog-content.js 以运行最后一步.

Github Action 会在启动时创建一个新的 Release, 然后分别在 Windows, Linux, 和 MacOS 平台上编译这个 Rust 工作区. 最后运行测试, 如果任何测试不通过都会终止. 

如果可以通过, 会分别将 Rust 打包上传发布为 Release 的附件. 

当三个附件都上传完毕后, 会根据我们提交时的信息, `CHANGELOG.md` 的内容, 以及`本次提交相比上次提交产生的 git diff` 更新我们的 Release 文本.

### 工作区的 Rust 项目

只是一个非常建议的测试用 Rust, 其中 library-test 编译为动态链接库, 而 hello-world 依赖 libloading crate 调用这个动态链接库. 动态链接库就是一个简单的 add 函数, 测试程序也只是先打印平台名称, 然后从相对路径加载动态链接库, 最后调用 add 计算简单的加法. 这只是作为一个样例, 因此结构非常简单.



