import Link from 'next/link';
import { ArrowRight, Cpu, Activity, History, Zap } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.glowBlob1} />
          <div className={styles.glowBlob2} />
        </div>

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={`glass-panel ${styles.badge} animate-fade-in-up`}>
              <span className={styles.badgeDot}></span>
              DevForge 4.0 MVP Engine
            </div>

            <h1 className={`${styles.title} animate-fade-in-up delay-100`}>
              Decouple Business Logic from <br />
              <span className="text-gradient">Application Code.</span>
            </h1>

            <p className={`${styles.subtitle} animate-fade-in-up delay-200`}>
              LogicSnap is an enterprise-grade decision intelligence platform.
              Dynamically deploy rigorous mathematical rules, advanced statistical tests,
              and boolean evaluations directly to live data streams—with zero downtime.
            </p>

            <div className={`${styles.heroActions} animate-fade-in-up delay-300`}>
              <Link href="/marketing" className="btn-primary">
                Try Text-to-Rule AI <ArrowRight size={18} />
              </Link>
              <Link href="/developer" className="btn-secondary">
                View Dependency Graph
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.grid}>

            <div className={`glass-panel ${styles.card}`}>
              <div className={styles.iconWrapper}>
                <Cpu className={styles.icon} />
              </div>
              <h3>Statistical Math Engine</h3>
              <p>Beyond simple discounts. Execute multi-variable linear algebra, moving averages, and Z-Score anomaly detection in real-time.</p>
            </div>

            <div className={`glass-panel ${styles.card}`}>
              <div className={styles.iconWrapper}>
                <Zap className={styles.icon} />
              </div>
              <h3>AI Text-to-Rule</h3>
              <p>Empower marketing teams to type natural language requirements and instantly translate them into standardized, deployable JSON schemas.</p>
            </div>

            <div className={`glass-panel ${styles.card}`}>
              <div className={styles.iconWrapper}>
                <History className={styles.icon} />
              </div>
              <h3>Time-Travel Backtesting</h3>
              <p>Simulate financial and operational impact against historical data streams before ever deploying a rule to production.</p>
            </div>

            <div className={`glass-panel ${styles.card}`}>
              <div className={styles.iconWrapper}>
                <Activity className={styles.icon} />
              </div>
              <h3>Blast Radius Governance</h3>
              <p>Visually map overlapping rules and cross-system dependencies to mitigate risk and prevent unintended logic collisions.</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
