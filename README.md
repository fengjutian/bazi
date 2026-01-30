# 八字算命应用 (BaZi Fortune Telling App)

## 项目介绍

这是一个基于 Next.js 开发的八字算命应用，提供专业的八字命盘分析、大运流年预测、五行分布可视化等功能。

## 功能特性

### 核心功能
- ✅ 八字命盘计算（年柱、月柱、日柱、时柱）
- ✅ 十神分析与详细解读
- ✅ 大运（十年运势）计算与分析
- ✅ 流年（年度运势）计算与分析（支持计算至100岁）
- ✅ 综合运势分析（财运、事业、婚姻、健康等）

### 可视化图表
- 📊 五行分布雷达图 - 展示五行力量分布
- 📊 十神分布图 - 展示十神出现频率
- 📊 大运概览图 - 展示十年运势周期
- 📊 流年十神趋势图 - 展示不同年龄的十神变化

### 其他特性
- 📄 PDF 报告导出功能
- 📱 响应式设计，支持移动端
- 🔄 实时计算与更新
- 🎨 现代化 UI 设计

## 技术栈

- **前端框架**: Next.js 16.1.6
- **构建工具**: Turbopack
- **图表库**: Recharts
- **样式**: Tailwind CSS
- **语言**: TypeScript

## 安装与运行

### 前提条件

- Node.js 18.0 或更高版本
- npm, yarn, pnpm 或 bun 包管理器

### 安装步骤

1. 克隆项目

```bash
git clone https://github.com/yourusername/bazi.git
cd bazi
```

2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install

# 或使用 bun
bun install
```

3. 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev

# 或使用 bun
bun dev
```

4. 打开浏览器访问

```
http://localhost:3000
```

## 项目结构

```
bazi/
├── public/            # 静态资源
├── src/
│   ├── app/           # Next.js 应用路由
│   │   ├── result/     # 结果页面
│   │   └── page.tsx    # 首页
│   ├── components/     # React 组件
│   │   ├── BaziChart.tsx      # 八字图表组件
│   │   ├── BaziForm.tsx       # 八字输入表单
│   │   ├── DaYunChart.tsx     # 大运图表组件
│   │   └── ExportPdfButton.tsx # PDF 导出按钮
│   └── lib/            # 核心逻辑
│       ├── bazi.ts     # 八字计算核心逻辑
│       ├── daYun.ts    # 大运流年计算
│       ├── explain.ts  # 八字解读
│       ├── fortune.ts  # 运势生成
│       └── tenGod.ts   # 十神计算
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 使用说明

1. **输入出生信息**
   - 在首页输入出生年、月、日、时
   - 点击「开始排八字」按钮

2. **查看命盘分析**
   - 查看四柱八字（年柱、月柱、日柱、时柱）
   - 了解日主信息及解读
   - 查看十神明细及详细解释

3. **分析图表数据**
   - 五行分布雷达图：了解五行强弱
   - 十神分布图：了解十神分布
   - 大运概览：了解十年运势周期
   - 流年十神趋势：了解不同年龄的运势变化

4. **查看综合运势**
   - 财运、事业、婚姻、健康等方面的分析
   - 每年的详细运势预测

5. **导出报告**
   - 点击「下载 PDF」按钮导出完整报告

## 核心算法说明

### 八字计算
- 使用儒略日转换计算日柱
- 以立春为界计算年柱
- 以节气定月计算月柱
- 由日干推导时柱

### 十神计算
- 基于五行生克关系
- 考虑阴阳属性差异
- 生成十种神煞关系

### 大运流年计算
- 大运每十年一变
- 流年每年一变
- 支持计算至100岁的运势

## 注意事项

- 本工具仅用于命理结构分析，不构成任何人生决策建议
- 输入的出生时间应尽量准确，以获得更精准的分析结果
- 运势预测仅供参考，命运掌握在自己手中

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎联系开发者。

---

**免责声明**：本应用基于传统命理学说开发，仅供娱乐和参考使用，不应用于替代专业咨询。
