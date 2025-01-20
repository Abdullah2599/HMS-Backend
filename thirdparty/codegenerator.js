function generateCode() {
    const numbers = '0123456789';
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const allCharacters = numbers + alphabets;

    const oneNumber = numbers[Math.floor(Math.random() * numbers.length)];

    const twoAlphabets = Array(2)
        .fill(null)
        .map(() => alphabets[Math.floor(Math.random() * alphabets.length)])
        .join('');

    const remainingCharacters = Array(3)
        .fill(null)
        .map(() => allCharacters[Math.floor(Math.random() * allCharacters.length)])
        .join('');

    const code = (oneNumber + twoAlphabets + remainingCharacters)
        .split('')
        .sort(() => Math.random() - 0.5) 
        .join('');

    return code;
}

module.exports=generateCode;
