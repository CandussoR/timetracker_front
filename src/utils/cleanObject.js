const cleanObject = (obj) => Object.fromEntries(Object.entries(obj).filter(([k,v]) => v != null));
export default cleanObject