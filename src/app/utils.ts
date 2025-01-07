export const ellipsisFormat = (input: string | number, number = 10) => {
    const arr = String(input).split('')
    arr.splice(number, arr.length - number - 8, '....')
    return arr.join('')
}

export const sleep = (time: number) =>
    new Promise((res) => setTimeout(res, 1000 * time))

/**
 * 替换 IPFS URL 的函数
 * @param {string} url - Origin HTTP URL
 * @returns {string} New HTTPS URL
 */
export const replaceIpfsUrl = (url: string) => {
    const oldBase = "http://8.219.11.39:8080/ipfs/";
    const newBase = "https://dev-ipfs.nulink.org/ipfs/";

    if (url && url.startsWith(oldBase)) {
        return url.replace(oldBase, newBase);
    }
    return url;
}
