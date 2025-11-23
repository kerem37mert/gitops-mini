import classes from "./StatCard.module.css";

const StatCard = ({ title, value, icon: Icon, color = "primary" }) => {
    return (
        <div className={`${classes["stat-card"]} ${classes[color]}`}>
            <div className={classes.icon}>
                {Icon && <Icon />}
            </div>
            <div className={classes.content}>
                <p className={classes.title}>{title}</p>
                <p className={classes.value}>{value}</p>
            </div>
        </div>
    );
}

export default StatCard;
