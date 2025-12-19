export interface BiographyData {
    deceased_name: string;
    birth_date?: string;
    death_date?: string;
    birth_background?: string;
    childhood?: string;
    adolescence?: string;
    youth?: string;
    career?: string;
    achievements?: string;
    midlife?: string;
    family?: string;
    tribute?: string;
    quote?: string;
}

export async function generateMockBiography(data: BiographyData): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return `
[AI가 생성한 전기문 초안입니다]

"${data.quote || '사랑하며 살다.'}"

우리의 곁을 떠난 故 ${data.deceased_name}님은 ${data.birth_date || '생년 미상'}에 태어나 ${data.death_date || '별세일 미상'}에 영면하셨습니다.

고인은 ${data.birth_background || '알 수 없는 곳'}에서 태어나셨습니다. 
어린 시절, ${data.childhood || '평범하지만 소중한 시간'}을 보내며 성장하셨고,
청소년기에는 ${data.adolescence || '많은 꿈을 꾸며'} 미래를 준비하셨습니다.

청년 시절에는 ${data.youth || '치열한 삶'}을 사셨으며,
사회에 진출하여 ${data.career || '자신의 자리에서 최선'}을 다하셨습니다.
특히 ${data.achievements || '많은 업적'}은 주위 사람들에게 깊은 인상을 남기셨습니다.

중장년에 이르러서는 ${data.midlife || '여유로운 삶'}을 즐기시며,
가족들에게는 ${data.family || '따뜻한 사랑'}을 베푸셨습니다.

마지막 순간까지 ${data.tribute || '평안한 모습'}으로 우리 곁에 머무셨던 ${data.deceased_name}님.
당신이 남기신 사랑과 가르침을 영원히 기억하겠습니다.

부디 평안히 잠드소서.
  `.trim();
}
