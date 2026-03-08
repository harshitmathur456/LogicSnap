'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hexagon, Code2, LineChart, FileJson } from 'lucide-react';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/', icon: Hexagon },
        { name: 'Marketing Portal', href: '/marketing', icon: FileJson },
        { name: 'Backtesting', href: '/backtesting', icon: LineChart },
        { name: 'Dev Graph', href: '/developer', icon: Code2 },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>LS</div>
                    <span className="text-gradient">LogicSnap</span>
                </div>

                <div className={styles.navLinks}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                                {isActive && <div className={styles.activeIndicator} />}
                            </Link>
                        );
                    })}
                </div>

                <div className={styles.actions}>
                    <button className="btn-secondary">Documentation</button>
                </div>
            </div>
        </nav>
    );
}
