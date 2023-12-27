export const convertPathNameToIndexName = (pathname) => {
    return pathname.split('.')?.[0].replaceAll('/','--');
}