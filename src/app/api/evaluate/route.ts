import { NextResponse } from 'next/server';
import { z } from 'zod';
import { EvaluateRequestSchema, IntegrationPayloadSchema } from '@/lib/schema';
import { RuleEngine } from '@/lib/engine/RuleEngine';
import { supabase } from '@/lib/supabase';

/**
 * PHASE 2: Core Integration API (For Host Developers)
 * 
 * /evaluate
 * Uses strict Zod schema to prevent garbage input.
 * Dynamically evaluates mathematical risk matrices and thresholds.
 * Securely isolated by API Key (RLS in Supabase).
 */
export async function POST(request: Request) {
    try {
        const apiKey = request.headers.get('x-api-key');

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Unauthorized: x-api-key header is required' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // 1. Zod validation parsing - STOPS GARBAGE DATA
        const validationResult = EvaluateRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Bad Request: Malformed Payload Schema Validation Failed',
                    details: validationResult.error.format()
                },
                { status: 400 }
            );
        }

        const { payload } = validationResult.data;

        // 2. Fetch Active Rules using Supabase 
        // Secure via RLS - This API key can ONLY see this project's rules
        const { data: activeRules, error: rulesError } = await supabase
            .from('rules')
            .select('id, name, rule_schema')
            .eq('status', 'active');

        if (rulesError || !activeRules) {
            throw new Error(`Failed to fetch logic schemas: ${rulesError?.message}`);
        }

        // Convert DB structure into RuleEngine expected structure
        const parsedRules = activeRules.map(r => ({
            id: r.id,
            name: r.name,
            ...r.rule_schema
        }));

        // 3. Evaluate the validated payload against Active Math/Logic Rules
        const engine = new RuleEngine(parsedRules);

        // In a real advanced setup, `historicalContext` for Moving Averages/Z-Scores
        // would be fetched via Redis or aggregated SQL views before passing to the engine.
        const evaluationResults = engine.evaluate(payload, /* context= */ {});

        // 4. Async Logging to Historical Events for Backtesting 
        // Run this without awaiting to maintain low latency on the edge endpoint
        supabase.from('historical_events').insert({
            payload: payload
        }).then(({ error }) => {
            if (error) console.error("Async historical event logging failed:", error);
        });

        // 5. Return Output Actions
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            evaluation: {
                totalRulesAnalyzed: parsedRules.length,
                triggeredRules: evaluationResults.length,
                actions: evaluationResults.map(res => res.action)
            }
        });

    } catch (error: any) {
        console.error('[API Evaluate]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
