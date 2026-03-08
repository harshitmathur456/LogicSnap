import { NextResponse } from 'next/server';
import { AIGeneratedRuleSchema } from '@/lib/schema';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Simulate AI parsing delay (normally this would call Gemini/OpenAI)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple heuristic-based mock generator for the MVP to simulate natural language parsing
        let parsedRule: any = {
            name: "Generated Promo Logic",
            description: prompt,
            conditionLogic: "AND",
            conditions: [{
                field: "transaction.amount",
                operator: "GREATER_THAN_OR_EQUALS",
                value: 100,
                type: "standard"
            }],
            action: {
                type: "DISCOUNT",
                payload: {
                    type: "PERCENTAGE",
                    value: 10,
                    maxLimit: 50
                }
            },
            confidenceScore: 0.95
        };

        // Keyword heuristics just for MVP demonstration
        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes("30% off upto 120")) {
            parsedRule.action.payload.value = 30;
            parsedRule.action.payload.maxLimit = 120;
            parsedRule.name = "Sunday Surge Discount";
        }

        if (lowerPrompt.includes("sunday")) {
            parsedRule.conditions.push({
                field: "time.dayOfWeek",
                operator: "EQUALS",
                value: 0, // Sunday
                type: "standard"
            });
        }

        if (lowerPrompt.includes("anomaly") || lowerPrompt.includes("surge")) {
            parsedRule.conditions = [{
                field: "transaction.amount",
                operator: "GREATER_THAN",
                value: 1.5,
                type: "zscore" // Switch to standard deviation engine
            }];
        }

        // CRITICAL ENTERPRISE FEATURE: Zod Parse to prevent LLM Hallucinations
        const validationResult = AIGeneratedRuleSchema.safeParse(parsedRule);

        if (!validationResult.success) {
            console.error("AI Generated Garbage JSON:", validationResult.error);
            return NextResponse.json(
                { error: 'AI Generated invalid schema. Please refine your prompt.' },
                { status: 422 }
            );
        }

        // Append ID after validation just for frontend rendering
        const finalSchema = {
            ...validationResult.data,
            id: `rule_ai_${Date.now()}`
        };

        return NextResponse.json({ schema: finalSchema });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
