import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get Request Data
        const {
            deceased_name,
            birth_date,
            death_date,
            childhood,
            youth,
            adulthood,
            biography_data
        } = await req.json()

        // 2. Identify User/IP
        const authHeader = req.headers.get('Authorization')
        let userId = null
        if (authHeader) {
            const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
            userId = user?.id
        }

        // Get IP from headers (Supabase Edge standard)
        const ipAddress = req.headers.get('x-forwarded-for') || 'unknown'

        // 3. Rate Limiting Check
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        // Check logs for this IP or User in the last 24h
        let query = supabaseClient
            .from('ai_generation_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', yesterday)

        if (userId) {
            query = query.or(`user_id.eq.${userId},ip_address.eq.${ipAddress}`)
        } else {
            query = query.eq('ip_address', ipAddress)
        }

        const { count, error: countError } = await query

        if (countError) throw countError

        if (count !== null && count >= 3) {
            return new Response(
                JSON.stringify({ error: '일일 생성 한도(3회)를 초과했습니다. 내일 다시 시도해주세요.' }),
                { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 4. Construct Prompt
        const prompt = `
당신은 '추모 전문 작가'입니다. 유족이 입력한 고인의 정보를 바탕으로, 깊은 애도와 존경이 담긴 고품격 추모 기사(전기문) 초안을 작성해주세요.

[입력 정보]
- 고인 성함: ${deceased_name}
- 생년월일: ${birth_date || '미상'}
- 임종일: ${death_date || '미상'}
- 내용(유년/청년/중년/가족 등): 
${JSON.stringify(biography_data || { childhood, youth, adulthood })}

[작성 가이드]
1. 톤앤매너: 차분하고 격조 높으며, 유족에게 위로가 되는 감성적인 문체.
2. 구성:
    - 도입: 고인의 영면을 알리고 애도하는 문장.
    - 본문: 고인의 삶의 궤적과 인품, 주요 일화들을 매끄럽게 연결.
    - 결문: 고인이 남긴 사랑과 교훈을 기리며 평안한 안식을 기원.
3. 주의사항:
    - 입력된 정보가 부족하면 일반적이고 보편적인 덕담으로 자연스럽게 채워주세요.
    - '미상'인 날짜는 언급하지 마세요.
    - 너무 기계적이거나 딱딱하지 않게, 사람의 온기가 느껴지도록 써주세요.
    - 전체 분량은 1000자 내외로 풍성하게 작성해주세요.
    `

        // 5. Call OpenAI
        const openAiKey = Deno.env.get('OPENAI_API_KEY')
        if (!openAiKey) throw new Error('OpenAI API Key not configured')

        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o', // or gpt-3.5-turbo if cost constrained, user said "Demo version" so 4o is fine for quality
                messages: [
                    { role: 'system', content: '당신은 품격 있는 추모 기사를 작성하는 전문 작가입니다.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
            }),
        })

        const aiData = await openAiResponse.json()
        const generatedText = aiData.choices[0].message.content

        // 6. Log Usage
        await supabaseClient.from('ai_generation_logs').insert({
            user_id: userId,
            ip_address: ipAddress
        })

        // 7. Return Result
        return new Response(
            JSON.stringify({ content: generatedText }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
