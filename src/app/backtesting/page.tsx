'use client';

import { useState } from 'react';
import { Play, Activity, CheckCircle2, XCircle } from 'lucide-react';
import styles from './page.module.css';

export default function Backtesting() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const runBacktest = async () => {
        setLoading(true);
        // Dummy rule for testing: 30% off, max 120, based on Z-Score > 1
        const dummyRules = [{
            id: "rule_1",
            name: "High Value Surge Discount",
            description: "Apply up to 120 discount on anomalous transaction amounts",
            conditionLogic: "AND",
            conditions: [{
                field: "amount",
                operator: "GREATER_THAN",
                value: 1.0,
                type: "zscore"
            }],
            action: {
                type: "DISCOUNT",
                payload: { type: "PERCENTAGE", value: 30, maxLimit: 120 }
            }
        }];

        try {
            const res = await fetch('/api/backtest', {
                method: 'POST',
                body: JSON.stringify({ rules: dummyRules })
            });
            const data = await res.json();
            setResults(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Time-Travel <span className="text-gradient">Backtesting</span></h1>
                    <p>Simulate financial impact against historical data streams before ever deploying a rule to production.</p>
                </header>

                <section className={styles.dashboard}>
                    <div className={`glass-panel ${styles.controlPanel}`}>
                        <div className={styles.rulePreview}>
                            <h3>Testing Logic Schema</h3>
                            <pre>
                                {`{
  "name": "High Value Surge Discount",
  "conditions": [{
    "field": "amount",
    "type": "zscore",
    "operator": "GREATER_THAN",
    "value": 1.0
  }],
  "action": {
    "type": "DISCOUNT",
    "payload": { "value": 30, "maxLimit": 120 }
  }
}`}
                            </pre>
                        </div>

                        <button
                            className={`btn-primary ${styles.runBtn}`}
                            onClick={runBacktest}
                            disabled={loading}
                        >
                            {loading ? <Activity className="animate-spin" /> : <Play />}
                            {loading ? 'Simulating 30 Days...' : 'Run Simulation'}
                        </button>
                    </div>

                    <div className={styles.resultsArea}>
                        {!results && !loading && (
                            <div className={styles.emptyState}>
                                <Activity size={48} />
                                <p>Run a backtest simulation to view financial impact</p>
                            </div>
                        )}

                        {results && (
                            <div className={`animate-fade-in-up ${styles.report}`}>
                                <div className={styles.summaryCards}>
                                    <div className={`glass-panel ${styles.statCard}`}>
                                        <small>Total Historical Txns</small>
                                        <div className={styles.statValue}>{results.summary.totalTransactions}</div>
                                    </div>
                                    <div className={`glass-panel ${styles.statCard}`}>
                                        <small>Transactions Affected</small>
                                        <div className={styles.statValue}>{results.summary.transactionsAffected}</div>
                                        <div className={styles.statSub}>{results.summary.impactPercentage}% Impact</div>
                                    </div>
                                    <div className={`glass-panel ${styles.statCard} ${styles.financialStat}`}>
                                        <small>Total Discount Cost Simulated</small>
                                        <div className={styles.statValue}>${results.summary.totalDiscountApplied.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className={`glass-panel ${styles.logTable}`}>
                                    <h3>Simulation Log (Last 30 Days)</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Txn ID</th>
                                                <th>Amount</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                                <th>Discount Applied</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.timeSeriesData.slice(0, 10).map((row: any, i: number) => (
                                                <tr key={i}>
                                                    <td>{row.transaction.transactionId}</td>
                                                    <td>${row.transaction.amount}</td>
                                                    <td>{row.transaction.category}</td>
                                                    <td>
                                                        {row.discountApplied ?
                                                            <span className={styles.tagSuccess}><CheckRule passed /> Triggered</span> :
                                                            <span className={styles.tagNeutral}><XCircle size={14} /> Passed</span>}
                                                    </td>
                                                    <td>
                                                        {row.discountApplied ? 'Yes' : 'No'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {results.timeSeriesData.length > 10 && (
                                        <div className={styles.tableFooter}>
                                            Showing 10 of {results.timeSeriesData.length} records.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

const CheckRule = ({ passed }: { passed: boolean }) => {
    return <CheckCircle2 size={14} />;
}
