// Toast Container Component
import { useToast } from '../../hooks/useToast';
import './ToastContainer.css';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast toast-${toast.type} fade-in`}
                    onClick={() => removeToast(toast.id)}
                >
                    <div className="toast-content">
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '✕'}
                        {toast.type === 'warning' && '⚠'}
                        {toast.type === 'info' && 'ℹ'}
                        <span>{toast.message}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
