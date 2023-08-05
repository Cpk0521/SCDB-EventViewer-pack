export const isUrl = (src : string) => {
    try { return Boolean(new URL(src)); }
    catch(e){ return false; }
}