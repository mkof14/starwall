import type { Messages } from "@/lib/i18n/messages";

export const zh: Messages = {
  nav: {
    home: "首页",
    howItWorks: "工作原理",
    interface: "界面",
    levels: "层级",
    technology: "技术",
    faq: "FAQ",
    containers: "集装箱",
    contact: "联系",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    primary: "主导航",
    mobile: "移动导航",
    footer: "页脚",
  },
  chrome: {
    rights: "© AGRON Inc. 2026 · 保留所有权利",
    themeToLight: "切换到浅色主题",
    themeToDark: "切换到深色主题",
    language: "语言",
  },
  seo: {
    home: "StarWall by AGRON — 海上安全情报",
    howItWorks: "StarWall 如何工作 — StarWall by AGRON",
    interface: "AGRON Bridge — 交互演示 — StarWall by AGRON",
    levels: "订阅层级 — StarWall by AGRON",
    technology: "设备与集成 — StarWall by AGRON",
    faq: "FAQ — StarWall by AGRON",
    containers: "集装箱 — AGRON",
    containersDetection: "探测套件 — AGRON Containers",
    containersSpecs: "规格 — AGRON Containers",
    containersCountermeasures: "反制措施 — AGRON Containers",
    containersTiers: "层级 — AGRON Containers",
    containersDeployment: "部署 — AGRON Containers",
    contact: "联系 — StarWall by AGRON",
  },
  home: {
    kicker: "AGRON MARITIME · STARWALL BY AGRON",
    title: "一幅态势。全部来源。一个可以信赖的决定。",
    lead: "StarWall 把游艇、码头、港口或私人岛屿上已有的设备汇成一幅持续更新的态势图 — 并在数秒内为值班负责人提供每一项决定的清晰依据。",
    points: [
      "对接现有设备即可工作 — 无需更换",
      "学习您的船舶或场地，运行越久越精准",
      "关键时刻直接接通 AGRON 的 Security Support Center",
    ],
    contactCta: "联系 AGRON Maritime",
    pdfCta: "下载概览（PDF）",
    cards: [
      { title: "工作原理", body: "接入、理解、决策 — 三步完成" },
      { title: "看实际效果", body: "交互查看 Bridge 界面" },
      { title: "层级", body: "从必要监测到完全定制构建" },
      { title: "设备", body: "对接什么，如何对接" },
    ],
    containersLink: "StarWall 也可运行于 AGRON 可部署集装箱硬件之中 →",
  },
  how: {
    kicker: "工作原理",
    title: "接入、理解、决策",
    stepsLabel: "三步流程",
    steps: [
      {
        title: "接入",
        body: "StarWall 读取已安装的雷达、摄像机、AIS 及其他系统 — 无需更换设备。",
      },
      {
        title: "理解",
        body: "信号汇入同一时间轴与地图；每次告警关闭后历史仍会保留。",
      },
      {
        title: "决策",
        body: "清晰、可解释的风险等级，必要时直连 AGRON 的 Security Support Center。",
      },
    ],
    architecture: "架构",
    architectureLabel:
      "StarWall 架构流程：数据源、集成、统一数据、情报 / 人工智能、风险与情景、决策、Support Center",
    stages: [
      { name: "数据源", lines: ["雷达、AIS、", "摄像机、传感器"] },
      { name: "集成", lines: ["适配器、协议、API"] },
      { name: "统一数据", lines: ["一套共享数据模型"] },
      { name: "情报 / 人工智能", lines: ["关联、学习"] },
      { name: "风险与情景", lines: ["可解释的风险等级"] },
      { name: "决策", lines: ["建议的下一步"] },
      { name: "Support Center", lines: ["人工专家，实时"] },
    ],
    does: "StarWall 做什么",
    capabilities: [
      {
        title: "统一态势",
        body: "雷达、视频、AIS、无人机与周界传感器呈现为一幅态势图，而不是分散的屏幕。",
      },
      {
        title: "连续历史",
        body: "每个目标与事件都会保留，不会在告警关闭后丢弃。",
      },
      {
        title: "可解释的风险等级",
        body: "既定标尺 — Normal、Attention、Elevated、Critical — 每次变化的原因始终可见。",
      },
      {
        title: "对接现有设备",
        body: "叠加在船上或场地上已有的系统之上，不限制造商。",
      },
      {
        title: "学习特定船舶或场地",
        body: "为该游艇、码头或物业建立正常活动画像，并标出偏离之处。",
      },
      {
        title: "连通 AGRON 的 Support Center",
        body: "在情势需要时升级至受过训练的专家，而不仅是自动告警。",
      },
    ],
  },
  walkthrough: {
    kicker: "情景",
    title: "演练",
    note: "示意情景。请在下方实时演示中亲自试用。",
    steps: [
      "02:14 — 一个无 AIS 信号的目标进入 6 NM 范围，方位可能截击 M/Y Aurelia 的航向。",
      "StarWall 在数秒内关联雷达与 AIS 馈送，并将风险等级升至 Elevated。",
      "Bridge 给出一条明确建议：在 VHF ch.16 呼叫，加强值班，若距离降至 1.0 NM 以下则准备改向。",
      "事件自动记录并加盖时间戳，可直接用于晨报 — 无需手工撰写。",
    ],
  },
  bridge: {
    title: "AGRON Bridge",
    subtitle: "船长 / 安保官界面",
    mobileNotice: "此界面在较大屏幕上查看效果更好。",
    riskLevel: "风险等级",
    situational: "态势图",
    contacts4: "范围 6.0 NM · 4 个目标",
    contacts5: "范围 6.0 NM · 5 个目标",
    connected: "已连接系统",
    recommended: "建议行动",
    eventLog: "事件日志",
    live: "LIVE",
    simulate: "模拟告警",
    resolve: "解除并复位",
    disclaimer: "© AGRON Inc. · StarWall — 演示界面，示意数据，并非实船。",
    risks: ["Normal", "Attention", "Elevated", "Critical"],
    systems: [
      "雷达",
      "AIS",
      "CCTV · 6 路摄像机",
      "周界传感器",
      "声呐",
      "卫星通信链路",
    ],
    online: "在线",
    standby: "待命",
    telemetry: ["船舶", "位置", "航向", "航速", "风", "水深"],
    log: [
      "目标 SIRENA 已重新分类 — 已知船舶，码头邻船",
      "周界传感器 3 — 例行检查，无异常",
      "不明目标进入 6 NM 范围，无 AIS 信号",
      "航线更新已接受 — 下一航路点 41°19'N 002°05'E",
      "交接班 — Support Center 已确认",
    ],
    normalAdvice:
      "态势稳定。已知交通保持航向。维持标准值班，并将不明目标保持在标绘上。",
    elevatedAdvice:
      "不明目标以 8 kn 沿近似截击方位接近，两次尝试后无 AIS 应答。建议：在 VHF ch.16 呼叫，加强值班，若距离降至 1.0 NM 以下则准备改向。",
    resolveLog:
      "已呼叫并识别该目标 — 当地渔船，未装 AIS。风险等级已复位。",
  },
  levels: {
    kicker: "层级",
    title: "从必要监测到完全定制构建",
    tiersLabel: "服务层级",
    honestySr: "现已提供与开发中",
    mapNote:
      "这些层级对应 AGRON Maritime 现有服务结构：LIGHT 与 ADVANCED 属于 Protect，INTELLIGENCE 与 CUSTOM 延伸至 Intelligence + Support。",
    honesty: "我们宁可准确说明已经建成的部分，也不一次性承诺全部能力。",
    available: "现已提供",
    developing: "开发中",
    tiers: [
      {
        name: "LIGHT",
        subtitle: "必要能力",
        points: [
          "对接客户已有设备",
          "单一界面中的统一态势",
          "工作时间支持",
        ],
      },
      {
        name: "ADVANCED",
        subtitle: "标准防护",
        points: [
          "Risk Engine，4 级威胁",
          "事件与目标历史",
          "Support Center 24/7",
        ],
      },
      {
        name: "INTELLIGENCE",
        subtitle: "自适应",
        points: [
          "自适应人工智能与异常检测",
          "Scenario Engine",
          "主动监测支持",
        ],
      },
      {
        name: "CUSTOM",
        subtitle: "定制方案",
        points: [
          "个性化配置",
          "专用设备，Crisis Mode",
          "专职安保负责人",
        ],
      },
    ],
    availableNow: [
      "设备集成（Gateway）",
      "统一态势图",
      "基于规则的风险等级",
      "Bridge 界面",
      "手动升级至 Support Center",
    ],
    inDevelopment: [
      "自适应人工智能 / 异常检测",
      "Scenario Engine",
      "多目标 Family Office 视图",
      "Special Event / Crisis Mode",
      "自动生成报告",
    ],
  },
  tech: {
    kicker: "技术",
    title: "对接什么，如何对接",
    lead: "StarWall 不绑定单一制造商。集成层通过适配器连接市场上任何现代设备 — 包括新发布和专用设备类别。",
    catalog: "设备目录",
    category: "类别",
    connects: "对接内容",
    legal:
      "部分设备类别 — 例如射频 / 反无人机探测或电子战系统 — 在部署前需按管辖区进行出口管制与许可审查。StarWall 的架构将其作为可选模块支持；启用其中任何一项都必须先经过单独法律审查，相关响应能力需要持证操作员与人工授权。详情请",
    contactUs: "联系我们",
    oem: "OEM 合作",
    rows: [
      {
        name: "船舶 / 场地平台",
        connects:
          "船载网络、NMEA 网关、码头 / 庄园基础设施总线",
      },
      {
        name: "导航与船用电子",
        connects: "NMEA0183/2000、AIS、GPS/GNSS、雷达",
      },
      {
        name: "视频与光学",
        connects: "ONVIF、RTSP、PTZ、热像仪、EO/IR 模块",
      },
      {
        name: "周界与物联网",
        connects: "Modbus、MQTT、CAN、SNMP、周界与基础设施传感器",
      },
      {
        name: "无人机与反无人机",
        connects: "RF 无人机探测、分类、电子围栏",
      },
      {
        name: "水下",
        connects: "声呐，水下目标与游泳者探测",
      },
      {
        name: "卫星通信",
        connects: "Starlink、VSAT — 既作为数据通道，也作为受监测系统",
      },
    ],
    partners: [
      { name: "Compatibility", body: "通过开放协议对接市场上的任何设备" },
      {
        name: "StarWall Certified",
        body: "技术验证，客户推荐中优先",
      },
      {
        name: "Technology Partner",
        body: "为新设备类别共同开发集成",
      },
      {
        name: "Exclusive / OEM",
        body: "按 StarWall 配置共建产品",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "我们预期会先被问到的问题",
    items: [
      {
        q: "StarWall 会取代船长吗？",
        a: "不会。StarWall 提供更快、更清晰的信息和下一步建议 — 决定与责任始终由船长或安保官承担。",
      },
      {
        q: "如果失去连接会怎样？",
        a: "StarWall 继续在本地工作，并缓存数据直至连接恢复。失去一条链路不会关闭对该目标的防护。",
      },
      {
        q: "谁能访问我们的数据？",
        a: "访问按角色划分：船东、船长、码头、Support Center 各自只看到相关内容。可识别的目标数据不会出于任何人工智能训练目的共享到账户之外。",
      },
      {
        q: "我们听说 StarWall 可以集成专用探测设备 — 这合法吗？",
        a: "部分设备类别（例如射频 / 反无人机探测）在部署前需按管辖区进行出口与许可核查。StarWall 的架构将其作为可选模块支持；启用前必须先经过单独法律审查。",
      },
      {
        q: "必须更换现有设备吗？",
        a: "不必。StarWall 通过适配器对接已安装的雷达、摄像机、导航设备，而不是替换它们。",
      },
    ],
  },
  contact: {
    kicker: "联系",
    title: "申请情况介绍",
    lead: "面向正在评估试点的船东、船长、经纪人和团队。出站邮件服务尚未接通 — 在 AGRON 确认渠道之前，提交内容在本地接收。",
    name: "姓名",
    email: "电子邮箱",
    message: "留言",
    send: "发送",
    sending: "发送中…",
    success: "已在本地接收。出站邮件服务尚未接通。",
    error: "出现问题。",
    unable: "无法发送。",
  },
  containers: {
    kicker: "AGRON · 可部署安保集装箱",
    title: "一个集装箱。全谱态势感知。",
    lead: "自成一体的探测、分析与响应平台 — 可在数小时内而非数周内部署于陆地、海上或固定场地。探测与分析运行于 StarWall；响应设备在选定层级提供，始终需要人工授权。",
    contact: "联系 AGRON",
    back: "← 返回集装箱总览",
    eyebrow: "AGRON Containers",
    howLink: "了解工作原理 →",
    detectionLink:
      "本集装箱上的探测与分析运行于 StarWall —",
    zones: [
      {
        title: "探测套件",
        body: "雷达、声学传感器、EO/IR 与多光谱摄像机、声呐",
      },
      {
        title: "反制舱",
        body: "在选定层级提供 — 见反制措施页",
      },
      {
        title: "生命保障与信息技术",
        body: "电力、通信、服务器与数据机柜、环境控制",
      },
      {
        title: "操作员工位",
        body: "现场值守或完全远程操控",
      },
    ],
    subpages: ["层级", "规格", "反制措施", "部署"],
    detectionTitle: "探测套件",
    equipment: "设备",
    spec: "规格",
    detectionRows: [
      { name: "3D AESA Radar", spec: "360° 空中与水面探测，最远 15 km" },
      {
        name: "Acoustic Radar",
        spec: "探测低空、低速、小型目标及水面扰动",
      },
      {
        name: "Spectral Analyzer",
        spec: "RF 与信号情报，宽频谱监测",
      },
      {
        name: "Multi-Spectrum Cameras",
        spec: "昼、夜、热成像、SWIR，最远 10 km",
      },
      { name: "Acoustic Sonar", spec: "水下威胁探测，最远 1 km" },
    ],
    detectionNote: "本套件的全部探测与分析运行于 StarWall —",
    specsTitle: "集装箱规格",
    specs: [
      { label: "长度", value: "6.058 m (19.9 ft)" },
      { label: "宽度", value: "2.438 m (8.0 ft)" },
      { label: "高度", value: "2.896 m (9.5 ft)" },
      { label: "重量", value: "~9,500 kg" },
      { label: "功率", value: "10–15 kW" },
      { label: "工作温度", value: "−30°C to +50°C" },
      { label: "续航能力", value: "72+ 小时（视任务而定）" },
    ],
    rapid: "快速部署：抵达后不到 2 小时即可投入运行。",
    cmTitle: "反制措施",
    cmLegal:
      "反制设备在选定集装箱层级提供。启用或操作始终需要管辖区专项授权及持证操作员。AGRON Container 的探测与分析层（StarWall）绝不会自行触发这些系统 — 每次启动都是由授权操作员作出的人为决定。",
    cmItems: [
      {
        name: "拦截无人机系统",
        body: "高速多用途 UAV，遥控。最高速度 200+ km/h，航程最远 20 km，续航最长 25 min。",
      },
      { name: "电子战", body: "干扰、欺骗、信号阻断" },
      { name: "微波系统", body: "非动能定向能，反集群" },
    ],
    tiersTitle: "集装箱层级",
    customBadge: "定制",
    tiers: [
      { name: "Basic", body: "仅探测套件 + StarWall 分析" },
      { name: "Business", body: "+ 扩展传感器距离，连接 Support Center" },
      {
        name: "Premium",
        body: "+ 反制舱（非动能：电子战）",
      },
      {
        name: "Exclusive",
        body: "完全定制构建，最高可达经授权的政府 / 防务配置，须遵守出口管制及最终用户认证",
      },
    ],
    deployTitle: "部署",
    photo: "照片 —",
    cases: [
      {
        name: "海上",
        body: "船上或岸上持续防护，并与现有导航和安防系统集成。",
      },
      {
        name: "港口与港湾",
        body: "对水面、空中和岸上接近方向进行大范围监视。",
      },
      {
        name: "关键基础设施",
        body: "为固定设施提供周界与空域态势。",
      },
      {
        name: "私人庄园与岛屿",
        body: "在难以持续派人值守之处，提供远程、自给的防护。",
      },
      {
        name: "特殊活动",
        body: "为高规格集会临时部署，可快速架设与撤收。",
      },
    ],
  },
};
