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
    const slug = url.pathname.split('/').pop();

    if (request.method === 'POST') {
      const body = await request.json();
      const { inputs, lang = 'en' } = body;

      // 获取计算器配置
      const { results } = await env.DB.prepare(`
        SELECT cc.config
        FROM calculators c
        LEFT JOIN calculator_configs cc ON c.id = cc.calculator_id
        WHERE c.slug = ? AND c.is_active = 1
      `).bind(slug).all();

      if (results.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Calculator not found'
        }), { 
          status: 404,
          headers: corsHeaders 
        });
      }

      const config = JSON.parse(results[0].config);
      const result = performCalculation(config, inputs);

      return new Response(JSON.stringify({
        success: true,
        data: result
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

function performCalculation(config, inputs) {
  const { type, fields } = config;
  
  switch (type) {
    case 'basic':
      return performBasicCalculation(inputs);
    case 'scientific':
      return performScientificCalculation(inputs);
    case 'percentage':
      return performPercentageCalculation(inputs);
    case 'interest':
      return performInterestCalculation(inputs);
    case 'loan':
      return performLoanCalculation(inputs);
    case 'bmi':
      return performBMICalculation(inputs);
    case 'age':
      return performAgeCalculation(inputs);
    case 'converter':
      return performConversion(inputs);
    default:
      throw new Error('Unknown calculator type');
  }
}

function performBasicCalculation(inputs) {
  const { expression } = inputs;
  try {
    // 安全地计算表达式
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
    const result = eval(sanitized);
    return { result: Number(result) };
  } catch (error) {
    throw new Error('Invalid expression');
  }
}

function performPercentageCalculation(inputs) {
  const { value, percentage } = inputs;
  const numValue = parseFloat(value);
  const numPercentage = parseFloat(percentage);
  
  if (isNaN(numValue) || isNaN(numPercentage)) {
    throw new Error('Invalid input values');
  }
  
  const result = (numValue * numPercentage) / 100;
  return { result: result.toFixed(2) };
}

function performInterestCalculation(inputs) {
  const { principal, rate, time, type = 'simple' } = inputs;
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(time);
  
  if (isNaN(p) || isNaN(r) || isNaN(t)) {
    throw new Error('Invalid input values');
  }
  
  let result;
  if (type === 'compound') {
    result = p * Math.pow(1 + r, t);
  } else {
    result = p * (1 + r * t);
  }
  
  return { result: result.toFixed(2) };
}

function performLoanCalculation(inputs) {
  const { amount, rate, term } = inputs;
  const p = parseFloat(amount);
  const r = parseFloat(rate) / 100 / 12; // 月利率
  const n = parseFloat(term) * 12; // 月数
  
  if (isNaN(p) || isNaN(r) || isNaN(n)) {
    throw new Error('Invalid input values');
  }
  
  const monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - p;
  
  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    totalInterest: totalInterest.toFixed(2)
  };
}

function performBMICalculation(inputs) {
  const { weight, height } = inputs;
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100; // 转换为米
  
  if (isNaN(w) || isNaN(h)) {
    throw new Error('Invalid input values');
  }
  
  const bmi = w / (h * h);
  let category = '';
  
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  
  return {
    bmi: bmi.toFixed(1),
    category: category
  };
}

function performAgeCalculation(inputs) {
  const { birthdate } = inputs;
  const birth = new Date(birthdate);
  const today = new Date();
  
  if (isNaN(birth.getTime())) {
    throw new Error('Invalid birth date');
  }
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return { age: age };
}

function performConversion(inputs) {
  const { value, from_unit, to_unit } = inputs;
  const val = parseFloat(value);
  
  if (isNaN(val)) {
    throw new Error('Invalid value');
  }
  
  // 长度转换
  const lengthConversions = {
    meters: 1,
    feet: 3.28084,
    inches: 39.3701,
    cm: 100,
    mm: 1000
  };
  
  if (lengthConversions[from_unit] && lengthConversions[to_unit]) {
    const meters = val / lengthConversions[from_unit];
    const result = meters * lengthConversions[to_unit];
    return { result: result.toFixed(4) };
  }
  
  throw new Error('Unsupported conversion');
}

function performScientificCalculation(inputs) {
  const { expression } = inputs;
  try {
    // 扩展的数学函数
    const mathFunctions = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      log: Math.log10,
      ln: Math.log,
      sqrt: Math.sqrt,
      pow: Math.pow
    };
    
    // 这里需要更复杂的表达式解析器
    // 简化版本，仅支持基本运算
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
    const result = eval(sanitized);
    return { result: Number(result) };
  } catch (error) {
    throw new Error('Invalid expression');
  }
} 