export const ellipsisFormat = (input: string | number, number = 10) => {
    const arr = String(input).split('')
    arr.splice(number, arr.length - number - 8, '....')
    return arr.join('')
}