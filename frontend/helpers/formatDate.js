const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("tr-TR") +" " + d.toLocaleTimeString("tr-TR", { hour12: false });
}

export default formatDate;
