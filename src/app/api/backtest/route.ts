import { NextResponse } from 'next/server';
import { RuleEngine, RuleSchema } from '@/lib/engine/RuleEngine';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export async function POST(request: Request) {
    try {
        const apiKey = request.headers.get('x-api-key');
        if (!apiKey) return NextResponse.json({ error: 'Unauthorized: Missing API Key' }, { status: 401 });

        const body = await request.json();
        const rules: RuleSchema[] = body.rules || [];

        if (!rules || rules.length === 0) {
            return NextResponse.json({ error: 'No guidelines provided for backtesting' }, { status: 400 });
        }

        // Connect to Supabase to fetch exactly the past 30 days of historical events for this Host Project
        const { data: events, error } = await supabase
            .from('historical_events')
            .select('payload, created_at')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: true });

        if (error) throw new Error(error.message);

        const historicalData = events || [];

        const engine = new RuleEngine(rules);

        // Arrays for visualization
        const results = [];
        let totalDiscountApplied = 0;
        let transactionsAffected = 0;

        // We will build a rolling context to properly test moving averages and z-scores
        const rollingAmounts = [];

        for (const event of historicalData) {
            const dataPoint = event.payload;
            rollingAmounts.push(dataPoint.amount);

            const context = {
                amount: rollingAmounts
            };

            const evaluation = engine.evaluate(dataPoint, context);

            if (evaluation.length > 0) {
                transactionsAffected++;
                // Simulate applying a discount action
                const action = evaluation[0].action;
                if (action && action.type === 'DISCOUNT') {
                    let discount = 0;
                    if (action.payload.type === 'PERCENTAGE') {
                        discount = dataPoint.amount * (action.payload.value / 100);
                        if (action.payload.maxLimit && discount > action.payload.maxLimit) {
                            discount = action.payload.maxLimit;
                        }
                    }
                    totalDiscountApplied += discount;
                }

                results.push({
                    transaction: dataPoint,
                    rulesPassed: evaluation,
                    discountApplied: true
                });
            } else {
                results.push({
                    transaction: dataPoint,
                    rulesPassed: [],
                    discountApplied: false
                });
            }
        }

        return NextResponse.json({
            summary: {
                totalTransactions: historicalData.length,
                transactionsAffected,
                totalDiscountApplied: parseFloat(totalDiscountApplied.toFixed(2)),
                impactPercentage: parseFloat(((transactionsAffected / historicalData.length) * 100).toFixed(2))
            },
            timeSeriesData: results
        });

    } catch (error: any) {
        console.error('Backtesting error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
