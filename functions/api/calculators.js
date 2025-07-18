export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'en';
    const slug = url.pathname.split('/').pop();

    if (request.method === 'GET') {
      if (slug && slug !== 'calculators') {
        // 获取特定计算器详情
        const { results } = await env.DB.prepare(`
          SELECT 
            c.slug,
            c.icon,
            ct.title,
            ct.description,
            ct.instructions,
            cc.config
          FROM calculators c
          LEFT JOIN calculator_translations ct ON c.id = ct.calculator_id AND ct.language_code = ?
          LEFT JOIN calculator_configs cc ON c.id = cc.calculator_id
          WHERE c.slug = ? AND c.is_active = 1
        `).bind(lang, slug).all();

        if (results.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Calculator not found'
          }), { 
            status: 404,
            headers: corsHeaders 
          });
        }

        const calculator = results[0];
        calculator.config = JSON.parse(calculator.config);

        return new Response(JSON.stringify({
          success: true,
          data: calculator
        }), { headers: corsHeaders });

      } else {
        // 获取计算器列表
        const { results } = await env.DB.prepare(`
          SELECT 
            c.slug,
            c.icon,
            ct.title,
            ct.description,
            cat.slug as category_slug,
            cat_trans.name as category_name
          FROM calculators c
          LEFT JOIN calculator_translations ct ON c.id = ct.calculator_id AND ct.language_code = ?
          LEFT JOIN categories cat ON c.category_id = cat.id
          LEFT JOIN category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
          WHERE c.is_active = 1
          ORDER BY cat.id, c.id
        `).bind(lang, lang).all();

        // 按分类组织数据
        const calculatorsByCategory = {};
        results.forEach(calc => {
          const category = calc.category_slug || 'other';
          if (!calculatorsByCategory[category]) {
            calculatorsByCategory[category] = {
              slug: category,
              name: calc.category_name || 'Other',
              calculators: []
            };
          }
          calculatorsByCategory[category].calculators.push({
            slug: calc.slug,
            title: calc.title,
            description: calc.description,
            icon: calc.icon
          });
        });

        return new Response(JSON.stringify({
          success: true,
          data: Object.values(calculatorsByCategory)
        }), { headers: corsHeaders });
      }
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed'
      }), { 
        status: 405,
        headers: corsHeaders 
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500,
      headers: corsHeaders 
    });
  }
} 