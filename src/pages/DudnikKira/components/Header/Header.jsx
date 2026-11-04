import React from 'react';
import Timer from '../Timer/Timer';
import Counter from '../Counter/Counter';
import RestartButton from '../RestartButton/RestartButton';
import styles from './Header.module.css';

export default function Header({ flagsLeft, timer, status, onRestart }) {
    return (
        <div className={styles.header}>
            <Counter value={flagsLeft} />
            <RestartButton status={status} onClick={onRestart} />
            <Timer time={timer} />
        </div>
    );
}