// Detailed product data for 4 functional drinks
// Using Western-focused health language (not TCM)

export interface Ingredient {
    name: string;
    nameCn: string;
    scientificName: string;
    benefit: string;
    benefitCn: string;
    emoji: string;
}

export interface ProductDetail {
    id: string;
    name: string;
    nameCn: string;
    tagline: string;
    taglineCn: string;
    description: string;
    descriptionCn: string;
    price: number;
    imageUrl: string;
    tags: string[];
    tagsCn: string[];
    flavorProfile: string;
    flavorProfileCn: string;
    flavorDescription: string;
    flavorDescriptionCn: string;
    coreIngredients: Ingredient[];
    baseIngredients: Ingredient[];
    benefits: string[];
    benefitsCn: string[];
    color: string; // Accent color for the product
}

export const products: ProductDetail[] = [
    {
        id: 'wrecked-ralph',
        name: 'Wrecked Ralph - Placeholder 1',
        nameCn: '醉后拉尔夫 - 占位符1',
        tagline: 'Party too hard? Ralph\'s got your back.',
        taglineCn: '昨晚喝挂了？拉尔夫来给你洗胃。',
        description: 'A powerful blend of liver-supporting botanicals that helps your body recover after a night out. Designed for the morning after.',
        descriptionCn: '融合护肝植物精华的强效配方，帮助你的身体在狂欢之后快速恢复。专为"昨晚"设计。',
        price: 4.99,
        imageUrl: '/wrecked-ralph.png',
        tags: ['Hangover', 'Detox', 'Liver Support'],
        tagsCn: ['解酒', '排毒', '护肝'],
        flavorProfile: 'Yuzu Ginger & Honeyed Peel',
        flavorProfileCn: '柚子姜味 + 蜜炼陈皮',
        flavorDescription: 'Refreshing like Korean yuzu tea meets ginger soda. Clean, crisp, and subtly sweet with citrus undertones.',
        flavorDescriptionCn: '清爽如韩国柚子茶与姜汁汽水的邂逅。清新爽脆，带着淡淡的柑橘甜香。',
        color: '#FF6B35', // Orange
        coreIngredients: [
            {
                name: 'Kudzu Root',
                nameCn: '葛根',
                scientificName: 'Pueraria lobata',
                benefit: 'Supports liver function and helps process alcohol byproducts faster',
                benefitCn: '支持肝脏功能，加速酒精代谢',
                emoji: '🌿'
            },
            {
                name: 'Schisandra Berry',
                nameCn: '五味子',
                scientificName: 'Schisandra chinensis',
                benefit: 'Powerful adaptogen that protects liver cells and reduces fatigue',
                benefitCn: '强效适应原，保护肝细胞，减轻疲劳',
                emoji: '🍇'
            },
            {
                name: 'Gardenia Fruit',
                nameCn: '栀子',
                scientificName: 'Gardenia jasminoides',
                benefit: 'Natural anti-inflammatory that helps clear toxins from your system',
                benefitCn: '天然抗炎成分，帮助清除体内毒素',
                emoji: '🌸'
            }
        ],
        baseIngredients: [
            {
                name: 'Lily Bulb',
                nameCn: '百合',
                scientificName: 'Lilium brownii',
                benefit: 'Soothes and hydrates, calming internal heat',
                benefitCn: '滋润舒缓，清热降燥',
                emoji: '🪻'
            },
            {
                name: 'Longan',
                nameCn: '龙眼',
                scientificName: 'Dimocarpus longan',
                benefit: 'Natural sweetness with restorative properties',
                benefitCn: '天然甜味，滋补元气',
                emoji: '🫐'
            },
            {
                name: 'Tangerine Peel',
                nameCn: '陈皮',
                scientificName: 'Citrus reticulata',
                benefit: 'Aids digestion and adds bright citrus notes',
                benefitCn: '助消化，增添清新柑橘风味',
                emoji: '🍊'
            },
            {
                name: 'Licorice Root',
                nameCn: '甘草',
                scientificName: 'Glycyrrhiza glabra',
                benefit: 'Harmonizes all ingredients and provides natural sweetness',
                benefitCn: '调和配方，天然回甘',
                emoji: '🌾'
            }
        ],
        benefits: [
            'Accelerates alcohol metabolism for faster recovery',
            'Protects liver cells from oxidative stress',
            'Replenishes electrolytes and hydration',
            'Reduces morning-after headaches and nausea'
        ],
        benefitsCn: [
            '加速酒精代谢，快速恢复',
            '保护肝细胞免受氧化损伤',
            '补充电解质和水分',
            '缓解宿醉头痛和恶心'
        ]
    },
    {
        id: 'bloated-bob',
        name: 'Bloated Bob - Placeholder 2',
        nameCn: '胀气鲍伯 - 占位符2',
        tagline: 'Ate too much? Bob helps you deflate.',
        taglineCn: '吃太多撑得像气球？鲍勃帮你放气。',
        description: 'A warming digestive tonic that eases bloating, gas, and discomfort. Your belly\'s new best friend after big meals.',
        descriptionCn: '温和的消化滋补饮品，缓解胀气和不适。大餐后肚子的新好友。',
        price: 4.99,
        imageUrl: '/bloated-bob.png',
        tags: ['Digestion', 'Bloating Relief', 'Gut Health'],
        tagsCn: ['消化', '缓解胀气', '肠道健康'],
        flavorProfile: 'Spiced Citrus Cola',
        flavorProfileCn: '柑橘辛香可乐',
        flavorDescription: 'Like a craft herbal cola with warm spice notes. Rich, complex, and surprisingly refreshing.',
        flavorDescriptionCn: '像一杯精酿草本可乐，带着温暖的香料风味。层次丰富，回味无穷。',
        color: '#8B4513', // Brown/Cola
        coreIngredients: [
            {
                name: 'Radish Seed',
                nameCn: '莱菔子',
                scientificName: 'Raphanus sativus',
                benefit: 'Breaks down food stagnation and relieves bloating fast',
                benefitCn: '消食化积，快速缓解胀气',
                emoji: '🌱'
            },
            {
                name: 'Galangal',
                nameCn: '良姜',
                scientificName: 'Alpinia officinarum',
                benefit: 'Warms the stomach and stimulates digestive enzymes',
                benefitCn: '温胃散寒，促进消化酶分泌',
                emoji: '🫚'
            },
            {
                name: 'Clove',
                nameCn: '丁香',
                scientificName: 'Syzygium aromaticum',
                benefit: 'Soothes nausea and prevents acid reflux',
                benefitCn: '缓解恶心，防止胃酸返流',
                emoji: '🌺'
            },
            {
                name: 'Jujube Date',
                nameCn: '大枣',
                scientificName: 'Ziziphus jujuba',
                benefit: 'Strengthens digestive function and adds natural sweetness',
                benefitCn: '补中益气，增添天然甜味',
                emoji: '🌰'
            }
        ],
        baseIngredients: [
            {
                name: 'Lily Bulb',
                nameCn: '百合',
                scientificName: 'Lilium brownii',
                benefit: 'Soothes and hydrates, calming internal heat',
                benefitCn: '滋润舒缓，清热降燥',
                emoji: '🪻'
            },
            {
                name: 'Longan',
                nameCn: '龙眼',
                scientificName: 'Dimocarpus longan',
                benefit: 'Natural sweetness with restorative properties',
                benefitCn: '天然甜味，滋补元气',
                emoji: '🫐'
            },
            {
                name: 'Tangerine Peel',
                nameCn: '陈皮',
                scientificName: 'Citrus reticulata',
                benefit: 'Aids digestion and adds bright citrus notes',
                benefitCn: '助消化，增添清新柑橘风味',
                emoji: '🍊'
            },
            {
                name: 'Licorice Root',
                nameCn: '甘草',
                scientificName: 'Glycyrrhiza glabra',
                benefit: 'Harmonizes all ingredients and provides natural sweetness',
                benefitCn: '调和配方，天然回甘',
                emoji: '🌾'
            }
        ],
        benefits: [
            'Relieves bloating and trapped gas within 30 minutes',
            'Stimulates natural digestive enzyme production',
            'Soothes stomach discomfort and cramping',
            'Prevents post-meal heaviness and sluggishness'
        ],
        benefitsCn: [
            '30分钟内缓解胀气',
            '促进天然消化酶分泌',
            '舒缓胃部不适和痉挛',
            '防止餐后沉重感和疲倦'
        ]
    },
    {
        id: 'heavy-kev',
        name: 'Heavy Kev - Placeholder 3',
        nameCn: '沉重凯文 - 占位符3',
        tagline: 'Feeling heavy? Kev helps you lighten up.',
        taglineCn: '感觉身体重得像灌了铅？凯文帮你排水。',
        description: 'A gentle metabolism-boosting blend that helps reduce water retention and supports healthy weight management.',
        descriptionCn: '温和的代谢促进配方，帮助减少水肿，支持健康体重管理。',
        price: 4.99,
        imageUrl: '/heavy-kev.png',
        tags: ['Metabolism', 'Water Retention', 'Slimming'],
        tagsCn: ['代谢', '消水肿', '轻盈'],
        flavorProfile: 'Citrus Amber Iced Tea',
        flavorProfileCn: '琥珀陈皮冰茶',
        flavorDescription: 'Like a premium lemon iced tea with a sophisticated herbal backbone. Light, refreshing, perfect for daily sipping.',
        flavorDescriptionCn: '像高级柠檬冰茶，带着优雅的草本底韵。轻盈清爽，适合每日饮用。',
        color: '#DAA520', // Golden
        coreIngredients: [
            {
                name: 'Lotus Leaf',
                nameCn: '荷叶',
                scientificName: 'Nelumbo nucifera',
                benefit: 'Boosts metabolism and helps break down body fat',
                benefitCn: '促进代谢，帮助分解体脂',
                emoji: '🍃'
            },
            {
                name: 'Astragalus',
                nameCn: '生黄芪',
                scientificName: 'Astragalus membranaceus',
                benefit: 'Increases energy and supports healthy fluid balance',
                benefitCn: '增强能量，促进水液代谢平衡',
                emoji: '🌿'
            },
            {
                name: 'Coix Seed',
                nameCn: '炒薏仁',
                scientificName: 'Coix lacryma-jobi',
                benefit: 'Reduces water retention and supports kidney function',
                benefitCn: '减少水肿，支持肾脏功能',
                emoji: '🌾'
            },
            {
                name: 'Alisma',
                nameCn: '泽泻',
                scientificName: 'Alisma plantago-aquatica',
                benefit: 'Natural diuretic that flushes excess fluids',
                benefitCn: '天然利尿，排出多余水分',
                emoji: '💧'
            }
        ],
        baseIngredients: [
            {
                name: 'Lily Bulb',
                nameCn: '百合',
                scientificName: 'Lilium brownii',
                benefit: 'Soothes and hydrates, calming internal heat',
                benefitCn: '滋润舒缓，清热降燥',
                emoji: '🪻'
            },
            {
                name: 'Longan',
                nameCn: '龙眼',
                scientificName: 'Dimocarpus longan',
                benefit: 'Natural sweetness with restorative properties',
                benefitCn: '天然甜味，滋补元气',
                emoji: '🫐'
            },
            {
                name: 'Tangerine Peel',
                nameCn: '陈皮',
                scientificName: 'Citrus reticulata',
                benefit: 'Aids digestion and adds bright citrus notes',
                benefitCn: '助消化，增添清新柑橘风味',
                emoji: '🍊'
            },
            {
                name: 'Licorice Root',
                nameCn: '甘草',
                scientificName: 'Glycyrrhiza glabra',
                benefit: 'Harmonizes all ingredients and provides natural sweetness',
                benefitCn: '调和配方，天然回甘',
                emoji: '🌾'
            }
        ],
        benefits: [
            'Reduces visible bloating and puffiness',
            'Supports healthy metabolism and energy levels',
            'Gentle natural diuretic without harsh effects',
            'Helps maintain healthy fluid balance'
        ],
        benefitsCn: [
            '减少可见的浮肿和臃肿',
            '支持健康代谢和能量水平',
            '温和天然利尿，无刺激副作用',
            '帮助维持健康的水液平衡'
        ]
    },
    {
        id: 'manic-max',
        name: 'Manic Max - Placeholder 4',
        nameCn: '狂躁麦克斯 - 占位符4',
        tagline: 'Brain won\'t stop? Max helps you power down.',
        taglineCn: '脑子转得停不下来？麦克斯给你强行关机。',
        description: 'A calming botanical blend for overstimulated minds. Helps reduce anxiety, quiet racing thoughts, and promote restful sleep.',
        descriptionCn: '为过度刺激的大脑打造的镇静植物配方。帮助减轻焦虑，平息杂念，促进安睡。',
        price: 4.99,
        imageUrl: '/manic-max.png',
        tags: ['Calm', 'Anti-Anxiety', 'Sleep Support'],
        tagsCn: ['安神', '抗焦虑', '助眠'],
        flavorProfile: 'Sparkling Rose & Longan',
        flavorProfileCn: '玫瑰龙眼气泡',
        flavorDescription: 'Like a sophisticated lychee-rose sparkling wine, but without the alcohol. Floral, fruity, and elegantly refreshing.',
        flavorDescriptionCn: '像精致的荔枝玫瑰起泡酒，但不含酒精。花香果香交织，优雅清新。',
        color: '#E91E8C', // Pink/Rose
        coreIngredients: [
            {
                name: 'Jujube Seed',
                nameCn: '酸枣仁',
                scientificName: 'Ziziphus spinosa',
                benefit: 'Calms the nervous system and promotes deep, restful sleep',
                benefitCn: '镇静神经系统，促进深度睡眠',
                emoji: '🌙'
            },
            {
                name: 'Prince Shen',
                nameCn: '太子参',
                scientificName: 'Pseudostellaria heterophylla',
                benefit: 'Gently restores energy without stimulation',
                benefitCn: '温和恢复能量，不产生刺激',
                emoji: '✨'
            },
            {
                name: 'Rose Petals',
                nameCn: '玫瑰花',
                scientificName: 'Rosa rugosa',
                benefit: 'Eases tension and lifts mood naturally',
                benefitCn: '舒缓紧张，自然提升心情',
                emoji: '🌹'
            }
        ],
        baseIngredients: [
            {
                name: 'Lily Bulb (Double)',
                nameCn: '百合（加倍）',
                scientificName: 'Lilium brownii',
                benefit: 'Extra calming effect, deeply soothes and moisturizes',
                benefitCn: '加倍安神效果，深层滋润舒缓',
                emoji: '🪻'
            },
            {
                name: 'Longan',
                nameCn: '龙眼',
                scientificName: 'Dimocarpus longan',
                benefit: 'Natural sweetness with restorative properties',
                benefitCn: '天然甜味，滋补元气',
                emoji: '🫐'
            },
            {
                name: 'Tangerine Peel',
                nameCn: '陈皮',
                scientificName: 'Citrus reticulata',
                benefit: 'Aids digestion and adds bright citrus notes',
                benefitCn: '助消化，增添清新柑橘风味',
                emoji: '🍊'
            },
            {
                name: 'Licorice Root',
                nameCn: '甘草',
                scientificName: 'Glycyrrhiza glabra',
                benefit: 'Harmonizes all ingredients and provides natural sweetness',
                benefitCn: '调和配方，天然回甘',
                emoji: '🌾'
            }
        ],
        benefits: [
            'Reduces anxiety and racing thoughts',
            'Promotes natural, restful sleep without grogginess',
            'Eases stress and emotional tension',
            'Supports overall mental wellness and balance'
        ],
        benefitsCn: [
            '减轻焦虑和杂念',
            '促进自然安睡，不产生困倦感',
            '舒缓压力和情绪紧张',
            '支持整体心理健康和平衡'
        ]
    }
];

// Helper function to get product by ID
export function getProductById(id: string): ProductDetail | undefined {
    return products.find(p => p.id === id);
}
