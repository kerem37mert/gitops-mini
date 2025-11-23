import classes from "./StatusBadge.module.css";

const StatusBadge = ({ status, size = "small" }) => {
    const getStatusText = () => {
        switch (status) {
            case 'active':
                return 'Başarılı';
            case 'failed':
                return 'Hatalı';
            case 'pending':
                return 'Beklemede';
            case 'success':
                return 'Başarılı';
            default:
                return status;
        }
    };

    return (
        <span className={`${classes.badge} ${classes[status]} ${classes[size]}`}>
            {getStatusText()}
        </span>
    );
}

export default StatusBadge;
