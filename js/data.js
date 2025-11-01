// Exhibition data - embedded directly to avoid CDN caching issues
const ExhibitionData = {
  artworks: [
    {
      id: "artwork-01",
      title: "Memory (Drawing Operations Unit: Generation 2)",
      title_zh: "记忆（绘画操作单元：第二代）",
      artist: "Sougwen Chung",
      artist_zh: "愫君（Sougwen Chung）",
      year: 2022,
      description: "A groundbreaking artwork exploring human-machine collaboration through neural networks."
    },
    {
      id: "artwork-02",
      title: "Drawing Operations Unit: Generation 1 (Mimicry)",
      title_zh: "绘画操作单元：第一代（模仿）",
      artist: "Sougwen Chung",
      artist_zh: "愫君（Sougwen Chung）",
      year: 2015,
      description: "Robots mirror the artist's hand movements in real-time, creating a dialogue between human and machine."
    },
    {
      id: "artwork-03",
      title: "Omnia per Omnia",
      title_zh: "万物于万物",
      artist: "Sougwen Chung",
      artist_zh: "愫君（Sougwen Chung）",
      year: 2018,
      description: "NYC's urban rhythms translated into robotic artworks through data visualization."
    },
    {
      id: "artwork-04",
      title: "Exquisite Corpus: A Sepal, A Petal, A Thorn",
      title_zh: "精美对话：花萼、花瓣、刺",
      artist: "Sougwen Chung",
      artist_zh: "愫君（Sougwen Chung）",
      year: 2020,
      description: "Biofeedback-driven artwork exploring the feedback loops between human body and machine."
    }
  ],

  critiques: [
    { artwork_id: "artwork-01", persona_id: "su-shi", critique: "This work embodies the essence of yi. The neural network becomes a mirror of inner landscape. Like literati painting, artistry lies in cultivating spirit.", critique_zh: "这件作品体现意的本质。神经网络成为内心风景的镜子。艺术性在于培养精神。" },
    { artwork_id: "artwork-01", persona_id: "guo-xi", critique: "The spatial composition intrigues me. Like my three-distance theory, this captures multiple temporalities. Past encoded in networks, present of creation, future of algorithms.", critique_zh: "空间构图让我深感兴趣。像三远理论捕捉多个视角。编码的过去、创作的现在、算法的未来。" },
    { artwork_id: "artwork-01", persona_id: "john-ruskin", critique: "This achieves genuine moral elevation, rare in technological art. Technology guided by artistic intention amplifies spiritual development.", critique_zh: "这实现了真正道德提升，技术艺术中很少见。艺术意图引导的技术放大精神发展。" },
    { artwork_id: "artwork-01", persona_id: "mama-zola", critique: "I perceive memory in how communities remember. Through repetition, accumulation of gestures. Machine learning is deep listening, honoring what came before.", critique_zh: "我看到记忆在社区如何记忆。通过重复和手势积累。机器学习是深刻倾听，尊重过去。" },
    { artwork_id: "artwork-01", persona_id: "professor-petrova", critique: "Formalist perspective shows masterful deconstruction of form and creation. The RNN makes visible the underlying syntax of gesture.", critique_zh: "形式主义角度展示巧妙解构形式与创作。RNN使笔势的基本句法可见。" },
    { artwork_id: "artwork-01", persona_id: "ai-ethics-reviewer", critique: "Exemplifies responsible AI in artistic practice. Transparent neural network demonstrates ethical engagement. Essential artwork for our time.", critique_zh: "体现艺术实践中负责任的AI。透明神经网络展示伦理互动。我们时代必需的艺术作品。" },

    { artwork_id: "artwork-02", persona_id: "su-shi", critique: "Synchronization beautiful because imperfect. Highest art when skill serves intention. Machine learning to dance with human spirit.", critique_zh: "同步因不完美而美丽。最高艺术当技能服务于意图。机器学会与人类精神共舞。" },
    { artwork_id: "artwork-02", persona_id: "guo-xi", critique: "Demonstrates sophisticated understanding of parallel perspective. Artist and robot create parallel marks, maintaining individual character. Each gesture creates new harmony.", critique_zh: "展示对平行透视的精妙理解。艺术家和机器人创造平行痕迹，保持个人特征。每对笔势创造新和谐。" },
    { artwork_id: "artwork-02", persona_id: "john-ruskin", critique: "Speaks to human dignity through machine collaboration. Robots amplify capacity, not diminish. Partnership, not replacement. True beauty when honoring precision and human intention.", critique_zh: "通过机器协作讲述人类尊严。机器人放大能力而非削弱。伙伴关系而非替代。当尊重精确性和人类意图时真正的美出现。" },
    { artwork_id: "artwork-02", persona_id: "mama-zola", critique: "I see communication and conversation between different beings. Robot responding like call and response. Drawing together creates community of creation.", critique_zh: "我看到不同生命之间的交流。机器人反应像呼应。一起绘画创造创作共同体。" },
    { artwork_id: "artwork-02", persona_id: "professor-petrova", critique: "Formalist innovation at its finest. Deconstructs gesture into programmable components. System where agency and rule coexist. Reveals grammar of mark-making.", critique_zh: "最好的形式主义创新。将笔势分解成可编程组件。个人代理和规则共存。揭示笔迹的基本语法。" },
    { artwork_id: "artwork-02", persona_id: "ai-ethics-reviewer", critique: "Exemplary human-robot collaboration raising questions of agency. Artist ensures transparency by making process visible. Model for ethical AI.", critique_zh: "人机协作典范提出代理权问题。艺术家通过可见过程确保透明度。伦理AI的模范。" },

    { artwork_id: "artwork-03", persona_id: "su-shi", critique: "Landscape painting expresses state of mind, not mere place. NYC flows and energies become gesture source. Profound philosophical understanding.", critique_zh: "风景画表达精神状态而非仅仅地点。纽约市流动和能量成为手势源头。艺术家展示深刻哲学理解。" },
    { artwork_id: "artwork-03", persona_id: "guo-xi", critique: "Series demonstrates mastery of algorithmic composition. Studies of Density, Velocity, Dwell, Direction correspond to spatial principles. Robots create organic compositions, not geometric patterns.", critique_zh: "系列展示算法构图的掌握。密度、速度、停留、方向研究对应空间原则。机器人创建有机构成而非几何图案。" },
    { artwork_id: "artwork-03", persona_id: "john-ruskin", critique: "Meditation on relationship between civilization and beauty. City as source suggests rhythm and harmony in urban environments. Deeply moral art.", critique_zh: "关于文明与美关系的沉思。城市作为源材料暗示城市环境的节奏和和谐。深刻的道德艺术。" },
    { artwork_id: "artwork-03", persona_id: "mama-zola", critique: "City is living being, this work honors that truth. Communities have rhythms. Robots become instruments of deep listening. Reminds us all are interconnected.", critique_zh: "城市是活的生命，这作品尊重这个真实。社区有节奏。机器人成为深刻倾听工具。提醒我们都相互联系。" },
    { artwork_id: "artwork-03", persona_id: "professor-petrova", critique: "Highest achievement in formalist innovation. Each study formally investigates data becoming visual. Artist creates visual language where complex information becomes immediately apprehensible.", critique_zh: "形式主义创新的最高成就。每项研究都形式调查数据如何变成视觉。艺术家创建视觉语言使复杂信息立即可理解。" },
    { artwork_id: "artwork-03", persona_id: "ai-ethics-reviewer", critique: "Series raises questions about representing urban space and agency. AI extracts patterns, democratizing perception. Demonstrates responsible data practice.", critique_zh: "系列提出关于城市空间代表和代理权的问题。AI提取模式，民主化感知。显示技术创新和美学成就。" },

    { artwork_id: "artwork-04", persona_id: "su-shi", critique: "Art born from vulnerability - path to genuine wisdom. Biofeedback guides creation, artist surrenders to body wisdom. Complete vision of human existence.", critique_zh: "从脆弱性诞生的艺术——通往真正智慧的道路。生物反馈引导创作，艺术家屈服于身体智慧。人类存在的完整愿景。" },
    { artwork_id: "artwork-04", persona_id: "guo-xi", critique: "Work demonstrates how tools expand awareness of body spatial dimensions. Biofeedback creates map of internal landscape. Artist creates self-portrait at biological process level.", critique_zh: "作品展示工具如何扩展对身体空间维度的认识。生物反馈创建内部风景的地图。艺术家创建生物过程水平的自画像。" },
    { artwork_id: "artwork-04", persona_id: "john-ruskin", critique: "Achieves elevation through honest confrontation with reality. Vulnerability becomes source material demonstrating courage. Beauty of authenticity.", critique_zh: "通过真诚面对现实实现提升。脆弱性成为源材料展示勇气。呈现身体诚实反应。真实性的美。" },
    { artwork_id: "artwork-04", persona_id: "mama-zola", critique: "Woman brave enough to let heartbeat become visible. Body carries wisdom and memory. Making internal rhythm external, shares deeply personal yet universal.", critique_zh: "足够勇敢让心跳变得可见的女性。身体承载智慧和记忆。使内部节奏外部化，分享深刻私人但普遍的东西。" },
    { artwork_id: "artwork-04", persona_id: "professor-petrova", critique: "Masterpiece of formal innovation. New visual language for invisible data. Each mark becomes information unit, collection creates organic compositions.", critique_zh: "形式创新的杰作。无形数据的新视觉语言。每个痕迹成为信息单位，集合创建有机构成。" },
    { artwork_id: "artwork-04", persona_id: "ai-ethics-reviewer", critique: "Ethical engagement with biometric data. Artist uses biofeedback for self-knowledge, not exploitation. Technology as vehicle for authenticity.", critique_zh: "与生物测量数据的伦理互动。艺术家用生物反馈实现自知而非剥削。技术作为真实性的载体。" }
  ]
};
