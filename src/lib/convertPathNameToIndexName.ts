export const convertPathNameToIndexName = (pathname:string) => {
    return pathname.split('.')?.[0].replaceAll('/','--');
}