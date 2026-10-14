const mode = process.argv[2];
let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const input = JSON.parse(raw);
let variables;
switch (mode) {
	case "emit":
		if (input.message !== "发布前验收" || input.project !== "Agent 覆盖值")
			throw new Error("初始变量没有传给命令");
		variables = { command状态: "通过", 命令计数: 1 };
		break;
	case "lint":
	case "test":
		if (input !== "发布前验收") throw new Error("分支输入不正确");
		variables = { [`${mode}状态`]: "通过" };
		break;
	case "merge":
		if (
			input.lint !== "通过" ||
			input.test !== "通过" ||
			input.command状态 !== "通过"
		)
			throw new Error("汇合输入不正确");
		variables = { 汇总结果: "测试和静态检查均已通过" };
		break;
	default:
		throw new Error(`未知检查模式: ${mode}`);
}
process.stdout.write(JSON.stringify({ variables }));
process.stderr.write(JSON.stringify({ mode, input }));
