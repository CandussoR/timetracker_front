const cleanObject = (obj) => Object.fromEntries(Object.entries(obj).filter(([,v]) => v != null && v != ''));
export default cleanObject