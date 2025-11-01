// Exhibition Planning Data - Plan A (Basic Version)
// 基础款实施方案 - 约 10,700 元人民币

const ExhibitionPlan = {
  // 项目基本信息
  project: {
    title: "VULCA 艺术装置基础款实施方案",
    subtitle: "基于\"潮汐的负形\"主题展览",
    budget_total: 10700,
    currency: "人民币",
    date: "2025年1月"
  },

  // 预算详情
  budget: {
    items: [
      {
        id: "artwork",
        name_zh: "作品制作",
        name_en: "Artwork Production",
        budget: 3500,
        percentage: 32.7,
        color: "#C9B8A3",
        details: [
          { item: "A1 艺术微喷 × 4 幅（含基础装裱）", price: 600, qty: 4, subtotal: 2400 },
          { item: "A3 打样/校色样张 × 4 张", price: 50, qty: 4, subtotal: 200 },
          { item: "基础木框装裱材料", price: 200, qty: 1, subtotal: 800 },
          { item: "作品标签制作（亚克力 UV 打印）", price: 25, qty: 4, subtotal: 100 }
        ]
      },
      {
        id: "rolecard",
        name_zh: "角色卡系统",
        name_en: "Role Card System",
        budget: 2000,
        percentage: 18.7,
        color: "#D4A373",
        details: [
          { item: "A4 角色卡设计印刷（覆膜）× 8 张", price: 30, qty: 8, subtotal: 240 },
          { item: "二维码指示牌（PVC 板）× 4 个", price: 80, qty: 4, subtotal: 320 },
          { item: "简易展示架（亚克力 L 型）", price: 180, qty: 8, subtotal: 1440 }
        ]
      },
      {
        id: "digital",
        name_zh: "数字化展示",
        name_en: "Digital Display",
        budget: 3200,
        percentage: 29.9,
        color: "#8B9BA3",
        details: [
          { item: "基础网站搭建（GitHub Pages 托管）", price: 0, qty: 1, subtotal: 0 },
          { item: "域名注册（.art 域名 1 年）", price: 500, qty: 1, subtotal: 500 },
          { item: "AI API 额度（GPT-3.5 Turbo/通义千问）", price: 1800, qty: 1, subtotal: 1800 },
          { item: "静态页面开发（含响应式设计）", price: 900, qty: 1, subtotal: 900 }
        ]
      },
      {
        id: "logistics",
        name_zh: "物流与安装",
        name_en: "Logistics & Installation",
        budget: 1500,
        percentage: 14.0,
        color: "#A89881",
        details: [
          { item: "作品包装材料（气泡膜、纸箱）", price: 200, qty: 1, subtotal: 200 },
          { item: "同城快递（往返）", price: 150, qty: 2, subtotal: 300 },
          { item: "安装五金（挂钩、钢丝、水平仪）", price: 150, qty: 1, subtotal: 150 },
          { item: "现场安装人工（半天）", price: 500, qty: 1, subtotal: 500 },
          { item: "展期维护（工具包）", price: 150, qty: 1, subtotal: 150 }
        ]
      },
      {
        id: "promotion",
        name_zh: "记录与推广",
        name_en: "Documentation & Promotion",
        budget: 500,
        percentage: 4.7,
        color: "#9B8B7E",
        details: [
          { item: "基础摄影记录（手机/相机）", price: 0, qty: 1, subtotal: 0 },
          { item: "社交媒体推广素材制作", price: 300, qty: 1, subtotal: 300 },
          { item: "简易画册印刷（50 本）", price: 200, qty: 1, subtotal: 200 }
        ]
      }
    ],
    subtotal: 10200,
    contingency: 500,
    contingency_percent: 5,
    total: 10700
  },

  // 时间线
  timeline: [
    {
      week: 1,
      phase_zh: "准备阶段",
      phase_en: "Preparation",
      tasks: [
        "作品选择与数字化处理",
        "角色卡文案撰写",
        "供应商询价对比"
      ]
    },
    {
      week: 2,
      phase_zh: "制作阶段",
      phase_en: "Production",
      tasks: [
        "作品打样与色彩校正",
        "角色卡设计定稿",
        "网站框架搭建"
      ]
    },
    {
      week: 3,
      phase_zh: "生产阶段",
      phase_en: "Manufacturing",
      tasks: [
        "批量印刷制作",
        "网站内容填充",
        "API 接口调试"
      ]
    },
    {
      week: 4,
      phase_zh: "部署阶段",
      phase_en: "Deployment",
      tasks: [
        "现场安装调试",
        "互动系统测试",
        "开幕准备"
      ]
    }
  ],

  // 升级路径
  upgrades: [
    {
      stage: 1,
      name_zh: "第一阶段升级",
      name_en: "Stage 1 Upgrade",
      cost: 5000,
      features: [
        "增加 iPad 租赁，提供触控交互",
        "升级至 GPT-4 API，提升评论质量",
        "扩展至 8 幅作品，完善展览内容",
        "开发小程序，增强用户粘性"
      ]
    },
    {
      stage: 2,
      name_zh: "第二阶段升级",
      name_en: "Stage 2 Upgrade",
      cost: 10000,
      features: [
        "动态网页内容展示 - 实时评论流展示墙",
        "动态网页内容展示 - WebGL 3D 作品展示",
        "动态网页内容展示 - 交互式数据可视化",
        "扩展作品评论库 - 从 4 幅增加至 12 幅作品",
        "扩展作品评论库 - 建立评论对比分析系统",
        "语音交互系统 - Web Speech API 语音输入",
        "语音交互系统 - TTS 语音评论播报"
      ]
    },
    {
      stage: 3,
      name_zh: "终极版本",
      name_en: "Ultimate Version",
      cost: "参考中级方案",
      features: [
        "完整 Mac 生态硬件部署",
        "本地 AI 推理能力",
        "多用户实时交互",
        "专业级展览效果"
      ]
    }
  ],

  // 风险控制
  risks: [
    {
      risk_zh: "印刷色差",
      risk_en: "Print Color Deviation",
      impact_zh: "作品呈现效果不佳",
      impact_en: "Poor artwork presentation",
      mitigation_zh: "要求打样确认，预留调色时间",
      mitigation_en: "Request proofs, allow color correction time"
    },
    {
      risk_zh: "API 超额",
      risk_en: "API Overage",
      impact_zh: "无法生成新评论",
      impact_en: "Unable to generate new comments",
      mitigation_zh: "设置每日限额，准备缓存评论",
      mitigation_en: "Set daily limits, prepare cached comments"
    },
    {
      risk_zh: "网站崩溃",
      risk_en: "Website Crash",
      impact_zh: "互动体验中断",
      impact_en: "Interactive experience interrupted",
      mitigation_zh: "准备离线版本，静态页面备份",
      mitigation_en: "Prepare offline version, static page backups"
    },
    {
      risk_zh: "现场网络",
      risk_en: "On-site Network",
      impact_zh: "在线功能失效",
      impact_en: "Online features unavailable",
      mitigation_zh: "准备 4G 热点，离线展示方案",
      mitigation_en: "Prepare 4G hotspot, offline display plan"
    }
  ],

  // 展览目标
  objectives: [
    "清晰展现'作品 × 角色卡'方法论",
    "提供流畅的 AI 驱动互动体验",
    "GPT-3.5 级别的专业评论生成",
    "支持 30 天展期的稳定运行",
    "预留清晰的升级路径"
  ],

  // 空间布局
  layout: {
    total_area_sqm: 10,
    layout_description: "四幅作品采用对称布局，角色卡置于右侧中央，互动区域设于入口附近",
    visitor_flow: "从左上至右下的'之'字形路径"
  },

  // 核心特性
  highlights: [
    {
      title_zh: "潮汐性",
      title_en: "Tidal Nature",
      description_zh: "通过角色卡的多元视角，展现艺术评论的周期性变化"
    },
    {
      title_zh: "负形关注",
      title_en: "Negative Space Focus",
      description_zh: "突出过程文档和初始草稿，而非仅展示完成品"
    },
    {
      title_zh: "AI 时代思考",
      title_en: "AI Age Reflection",
      description_zh: "通过 AI 辅助评论生成探讨技术与艺术的关系"
    }
  ]
};
