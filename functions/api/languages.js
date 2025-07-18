export async function onRequest(context) {
  const { request, env } = context;
  
  // 设置 CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // 处理 OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      // 获取所有语言
      const { results } = await env.DB.prepare(
        'SELECT code, name, native_name, is_active FROM languages WHERE is_active = 1 ORDER BY code'
      ).all();

      return new Response(JSON.stringify({
        success: true,
        data: results
      }), { headers: corsHeaders });

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