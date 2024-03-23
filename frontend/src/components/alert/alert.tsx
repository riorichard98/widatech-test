import styles from './style.module.css';
import { useGlobalState ,AlertState} from '@/providers/store';

export default function Alert() {
    const { state: alert} = useGlobalState<AlertState>('alert');
    
    return (
        <div>
            {/* Use alert state from Redux store */}
            {alert.show && (
                <div className={styles.content}>
                    {alert.message}
                </div>
            )}
        </div>
    );
}
